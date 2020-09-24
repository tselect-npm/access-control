import { IConditionModifiersManager } from '../interfaces/condition-modifiers-manager';
import { IConditionOperatorsManager } from '../interfaces/condition-operators-manager';
import { TConditionEvaluationFactory } from './condition-evaluation-factory';

export type TConditionEvaluatorConstructorOptions = {
  conditionOperatorsHandlerManager?: IConditionOperatorsManager;
  conditionModifierHandlerManager?: IConditionModifiersManager;
  conditionEvaluationFactory?: TConditionEvaluationFactory;
};
