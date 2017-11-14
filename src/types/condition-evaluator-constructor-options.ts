import { IConditionOperatorsHandlerManager } from '../interfaces/condition-operator-handlers-manager';
import { IConditionModifierHandlerManager } from '../interfaces/condition-modifier-handlers-manager';
import { TConditionEvaluationFactory } from './condition-evaluation-factory';

export type TConditionEvaluatorConstructorOptions = {
  conditionOperatorsHandlerManager?: IConditionOperatorsHandlerManager;
  conditionModifierHandlerManager?: IConditionModifierHandlerManager;
  conditionEvaluationFactory?: TConditionEvaluationFactory;
};