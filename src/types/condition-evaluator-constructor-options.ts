import { IConditionOperatorsManager } from '../interfaces/condition-operators-manager';
import { IConditionModifiersManager } from '../interfaces/condition-modifiers-manager';
import { TConditionEvaluationFactory } from './condition-evaluation-factory';

export type TConditionEvaluatorConstructorOptions = {
  conditionOperatorsHandlerManager?: IConditionOperatorsManager;
  conditionModifierHandlerManager?: IConditionModifiersManager;
  conditionEvaluationFactory?: TConditionEvaluationFactory;
};