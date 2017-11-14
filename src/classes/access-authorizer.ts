import { PermissionEffect } from '../constants/permission-effect';
import { RESOURCE_PARTS_SEPARATOR } from '../constants/resource-parts-separator';
import { blanksToWildCards } from '../utils/blanks-to-wild-cards';
import { implies } from '../utils/implies';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccess } from '../interfaces/access';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { Access } from './access';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';
import { anyImplies } from '../utils/any-implies';
import { makeArray } from '@bluejay/utils';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { ConditionEvaluator } from './condition-evaluator';
import { TAuthorizerConstructorOptions } from '../types/authorizer-constructor-options';
import { TAccessConstructorOptions } from '../types/access-constructor-options';
import { TAccessFactory } from '../types/access-factory';
import { DecisionCode } from '../constants/decision-code';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { InvalidEnvironmentValueError } from './errors/invalid-enviroment-value';
import { InvalidConditionValueError } from './errors/invalid-condition-value';

const defaultAccessFactory = (options?: TAccessConstructorOptions) => new Access(options);
const defaultConditionEvaluator = new ConditionEvaluator();

export class AccessAuthorizer implements IAccessAuthorizer {
  private accessFactory: TAccessFactory;
  private conditionEvaluator: IConditionEvaluator;

  public constructor(options: TAuthorizerConstructorOptions = {}) {
    this.accessFactory = options.accessFactory || defaultAccessFactory;
    this.conditionEvaluator = options.conditionEvaluator || defaultConditionEvaluator;
  }

  protected filterRelevantPermissions(resource: TResource, action: TAction, permissions: TPermission[]): TPermission[] {
    const relevant: TPermission[] = [];
    const parts = resource.split(RESOURCE_PARTS_SEPARATOR);

    for (const candidate of permissions) {
      if (anyImplies(makeArray(candidate.action), action)) {
        for (const candidateResource of makeArray(candidate.resource)) {
          const candidateParts = candidateResource.split(RESOURCE_PARTS_SEPARATOR);
          const sameLengthParts = blanksToWildCards(parts, candidateParts.length);

          let allPartsMatch = true;

          for (let i = 0, len = candidateParts.length; i < len; i++) {
            if (!implies(candidateParts[i], sameLengthParts[i])) {
              allPartsMatch = false;
              break;
            }
          }

          if (allPartsMatch) {
            relevant.push(candidate);
            break;
          }
        }
      }
    }

    return relevant;
  }

  public authorize(resource: TResource, action: TAction, permissions: TPermission[], environment: TEnvironment = {}): IAccess {
    // Only evaluate relevant permissions if those haven't yet been filtered by the store.
    const relevantPermissions = this.filterRelevantPermissions(resource, action, permissions);

    const access = this.accessFactory({ consideredPermissions: relevantPermissions });

    if (!relevantPermissions.length) {
      return access.deny().setDecisionCode(DecisionCode.NO_RELEVANT_PERMISSIONS);
    }

    // We evaluate deny permissions first as an explicit deny permission takes precedence over any allow permission.
    const denyPermissions = relevantPermissions.filter(permission => permission.effect === PermissionEffect.DENY);

    for (const permission of denyPermissions) {
      let evaluation: IConditionEvaluation;

      try {
        evaluation = this.conditionEvaluator.evaluate(permission.condition, environment);
      } catch (err) {
        switch (true) {
          case InvalidEnvironmentValueError.hasInstance(err):
          case InvalidConditionValueError.hasInstance(err):
            err.setPermissionId(permission.id);
            throw err;
          default:
            throw err;
        }
      }
      // Meeting a deny permission's condition means that the permission is applicable and therefore that the access
      // is denied.
      if (evaluation.succeeded()) {
        return access
          .deny()
          .setDecisionCode(DecisionCode.EXPLICIT_DENY)
          .setDecisivePermission(permission);
      }
    }

    // We then evaluate allow permissions, and allow access if any is fulfilled.
    const allowPermissions = relevantPermissions.filter(permission => permission.effect === PermissionEffect.ALLOW);

    if (!allowPermissions.length) {
      return access
        .deny()
        .setDecisionCode(DecisionCode.NO_ALLOW_PERMISSIONS);
    }

    for (const permission of allowPermissions) {
      const evaluation = this.conditionEvaluator.evaluate(permission.condition, environment);
      if (evaluation.succeeded()) {
        return access
          .allow()
          .setDecisionCode(DecisionCode.EXPLICIT_ALLOW)
          .setDecisiveConditionEvaluation(evaluation)
          .setDecisivePermission(permission);
      } else {
        access
          .deny()
          .setDecisivePermission(permission)
          .setDecisiveConditionEvaluation(evaluation)
          .setDecisionCode(DecisionCode.EXPLICIT_ALLOW_FAILED_CONDITION);
      }
    }

    // If no explicit allow, the access is reputed denied
    return access;
  }
}