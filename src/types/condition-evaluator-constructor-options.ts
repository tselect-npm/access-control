import { TConditionEvaluationFactory } from './condition-evaluation-factory';
import { TAttributeConditionEvaluationFactory } from './attribute-condition-evaluation-factory';
import { IConditionOperatorsHandlerManager } from '../interfaces/condition-operators-handler-manager';
import { IConditionModifierHandlerManager } from '../interfaces/condition-modifier-handler-manager';

export type TConditionEvaluatorConstructorOptions = {
  conditionEvaluationFactory?: TConditionEvaluationFactory;
  attributeConditionEvaluationFactory?: TAttributeConditionEvaluationFactory;
  conditionOperatorsHandlerManager?: IConditionOperatorsHandlerManager;
  conditionModifierHandlerManager?: IConditionModifierHandlerManager;
};