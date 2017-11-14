import { makeArray } from '@bluejay/utils';
import * as Lodash from 'lodash';
import { ConditionOperator } from '../constants/condition-operator';
import { IAttributeConditionEvaluation } from '../interfaces/attribute-condition-evaluation';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TAttributeConditionEvaluationConstructorOptions } from '../types/attribute-condition-evaluation-constructor-options';
import { TAttributeConditionEvaluationFactory } from '../types/attribute-condition-evaluation-factory';
import { TConditionEvaluationConstructorOptions } from '../types/condition-evaluation-constructor-options';
import { TConditionEvaluationFactory } from '../types/condition-evaluation-factory';
import { TConditionEvaluatorConstructorOptions } from '../types/condition-evaluator-constructor-options';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { TEnvironment } from '../types/environment';
import { TPermissionCondition } from '../types/permission-condition';
import { isIfExistsModifier } from '../utils/is-if-exists-modifier';
import { AttributeConditionEvaluation } from './attribute-condition-evaluation';
import { ConditionEvaluation } from './condition-evaluation';
import { MalformedConditionError } from './errors/malformed-condition';
import { ConditionOperatorsHandlerManager } from './condition-operators-handler-manager';
import { IConditionOperatorsHandlerManager } from '../interfaces/condition-operators-handler-manager';
import { ConditionModifierHandlerManager } from './condition-modifier-handler-manager';
import { IConditionModifierHandlerManager } from '../interfaces/condition-modifier-handler-manager';
import { TConditionModifierHandler } from '../types/condition-modifier-handler';
import { UnmappedConditionOperatorError } from './errors/unmapped-condition-operator';
import { UnmappedConditionModifierError } from './errors/unmapped-condition-modifier';

const defaultConditionEvaluationFactory = (options: TConditionEvaluationConstructorOptions) => new ConditionEvaluation(options);
const defaultAttributeConditionEvaluationFactory = (options: TAttributeConditionEvaluationConstructorOptions) => new AttributeConditionEvaluation(options);
const defaultConditionOperatorsHandlerManager = new ConditionOperatorsHandlerManager();
const defaultConditionModifierHandlerManager = new ConditionModifierHandlerManager();

export class ConditionEvaluator implements IConditionEvaluator {
  private conditionEvaluationFactory: TConditionEvaluationFactory;
  private attributeConditionEvaluationFactory: TAttributeConditionEvaluationFactory;
  private conditionOperatorsHandlerManager: IConditionOperatorsHandlerManager;
  private conditionModifierHandlerManager: IConditionModifierHandlerManager;

  public constructor(options: TConditionEvaluatorConstructorOptions = {}) {
    this.conditionEvaluationFactory = options.conditionEvaluationFactory || defaultConditionEvaluationFactory;
    this.attributeConditionEvaluationFactory = options.attributeConditionEvaluationFactory || defaultAttributeConditionEvaluationFactory;
    this.conditionOperatorsHandlerManager = options.conditionOperatorsHandlerManager || defaultConditionOperatorsHandlerManager;
    this.conditionModifierHandlerManager = options.conditionModifierHandlerManager || defaultConditionModifierHandlerManager;
  }

  public evaluate(condition: TPermissionCondition | null | undefined, environment: TEnvironment): IConditionEvaluation {
    // No condition means no evaluation
    if (!condition) {
      return this.conditionEvaluationFactory({ result: true });
    }

    // Malformed condition
    if (!Lodash.isPlainObject(condition)) {
      throw new MalformedConditionError(condition);
    }

    const operators = Object.keys(condition);

    for (const operator of operators) {
      const operatorHandler: TConditionOperatorHandler = this.conditionOperatorsHandlerManager[operator];

      if (typeof operatorHandler !== 'function') {
        throw new UnmappedConditionOperatorError(operator);
      }

      const operatorDescription = condition[operator];
      const modifiers = Object.keys(operatorDescription);

      for (const modifier of modifiers) {
        const modifierHandler: TConditionModifierHandler = this.conditionModifierHandlerManager[modifier];

        if (typeof modifierHandler !== 'function') {
          throw new UnmappedConditionModifierError(modifier);
        }

        const modifierHash = operatorDescription[modifier];
        const attributePaths = Object.keys(modifierHash);

        for (const attributePath of attributePaths) {
          const environmentValue: any = Lodash.get(environment, attributePath);
          const conditionValue = modifierHash[attributePath];
          const result = modifierHandler.call(this.conditionModifierHandlerManager, operatorHandler.bind(this.conditionOperatorsHandlerManager), makeArray(conditionValue), environmentValue);

          if (!result) {
            return this.conditionEvaluationFactory({ result: false });
          }
        }
      }
    }

    return this.conditionEvaluationFactory({ result: true });
  }
}