import * as Lodash from 'lodash';
import { ConditionEvaluationErrorCode } from '../constants/condition-evaluation-error-code';
import { ConditionModifier } from '../constants/condition-modifier';
import { ConditionOperator } from '../constants/condition-operator';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { IConditionModifiersManager } from '../interfaces/condition-modifiers-manager';
import { IConditionOperatorsManager } from '../interfaces/condition-operators-manager';
import { TConditionEvaluationFactory } from '../types/condition-evaluation-factory';
import { TConditionEvaluatorConstructorOptions } from '../types/condition-evaluator-constructor-options';
import { TConditionModifierHandler } from '../types/condition-modifier-handler';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { TEnvironment } from '../types/environment';
import { TPermissionCondition } from '../types/permission-condition';
import { Keys } from '../utils/keys';
import { parseConditionValue } from '../utils/parse-condition-value';
import { ConditionEvaluation } from './condition-evaluation';
import { ConditionModifiersManager } from './condition-modifiers-manager';
import { ConditionOperatorsManager } from './condition-operators-manager';
import { InvalidConditionValueError } from './errors/invalid-condition-value';
import { InvalidEnvironmentValueError } from './errors/invalid-enviroment-value';

const defaultConditionOperatorsHandlerManager = new ConditionOperatorsManager();
const defaultConditionModifierHandlerManager = new ConditionModifiersManager();
const defaultConditionEvaluationFactory = () => new ConditionEvaluation();

export class ConditionEvaluator implements IConditionEvaluator {
  private conditionOperatorsHandlerManager: IConditionOperatorsManager;
  private conditionModifierHandlerManager: IConditionModifiersManager;
  private conditionEvaluationFactory: TConditionEvaluationFactory;

  public constructor(options: TConditionEvaluatorConstructorOptions = {}) {
    this.conditionOperatorsHandlerManager = options.conditionOperatorsHandlerManager || defaultConditionOperatorsHandlerManager;
    this.conditionModifierHandlerManager = options.conditionModifierHandlerManager || defaultConditionModifierHandlerManager;
    this.conditionEvaluationFactory = options.conditionEvaluationFactory || defaultConditionEvaluationFactory;
  }

  public evaluate(condition: TPermissionCondition | null | undefined, environment: TEnvironment): IConditionEvaluation {
    const evaluation = this.conditionEvaluationFactory();

    if (!condition) {
      return evaluation.succeed();
    }

    if (!Lodash.isPlainObject(condition)) {
      return evaluation.error(ConditionEvaluationErrorCode.MALFORMED_CONDITION, { value: condition });
    }

    const operators = Object.keys(condition);

    for (const operator of operators) {
      const operatorHandler: TConditionOperatorHandler = this.conditionOperatorsHandlerManager[operator];

      if (typeof operatorHandler !== 'function') {
        return evaluation.error(ConditionEvaluationErrorCode.UNKNOWN_OPERATOR, { value: operator });
      }

      const operatorDescription = condition[operator];
      const modifiers = Object.keys(operatorDescription);

      for (const modifier of modifiers) {
        const modifierHandler: TConditionModifierHandler = this.conditionModifierHandlerManager[modifier];

        if (typeof modifierHandler !== 'function') {
          return evaluation.error(ConditionEvaluationErrorCode.UNKNOWN_MODIFIER, { value: modifier });
        }

        const modifierHash = operatorDescription[modifier];
        const attributePaths = Object.keys(modifierHash);

        for (const attributePath of attributePaths) {
          const environmentValues = Keys.getValues(environment, attributePath).map(value => {
            // The evaluation requires simple values. If `foo.bar` resolves to an object, we then consider that it does
            // not resolve to a valid value and evaluate it as non-existing.
            if (Lodash.isPlainObject(value)) {
              return undefined;
            }
            return value;
          });

          const conditionValues = parseConditionValue(modifierHash[attributePath], environment);

          let matches: boolean;

          try {
            matches = modifierHandler.call(this.conditionModifierHandlerManager,
              operatorHandler.bind(this.conditionOperatorsHandlerManager),
              conditionValues,
              environmentValues
            );
          } catch (err: any) {
            switch (true) {
              case InvalidEnvironmentValueError.hasInstance(err):
                return evaluation.error(ConditionEvaluationErrorCode.INVALID_ENVIRONMENT_VALUE, {
                  value: err.getValue(),
                  operator: operator as ConditionOperator,
                  modifier: modifier as ConditionModifier,
                  attribute: attributePath
                });
              case InvalidConditionValueError.hasInstance(err):
                return evaluation.error(ConditionEvaluationErrorCode.INVALID_CONDITION_VALUE, {
                  value: err.getValue(),
                  operator: operator as ConditionOperator,
                  modifier: modifier as ConditionModifier,
                  attribute: attributePath
                });
              /* istanbul ignore next */
              default:
                throw err;
            }
          }

          // Return early if any handler failed.
          if (!matches) {
            return evaluation.fail();
          }
        }
      }
    }

    // If we haven't returned yet, that means that all conditions were met and the evaluation is a success.
    return evaluation.succeed();
  }
}
