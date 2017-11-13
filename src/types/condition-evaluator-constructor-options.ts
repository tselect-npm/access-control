import { TConditionEvaluationFactory } from './condition-evaluation-factory';
import { TConditionOperationMatcherMap } from './condition-operation-matcher-map';
import { TAttributeConditionEvaluationFactory } from './attribute-condition-evaluation-factory';

export type TConditionEvaluatorConstructorOptions = {
  conditionEvaluationFactory?: TConditionEvaluationFactory;
  conditionOperationMatchersMap?: TConditionOperationMatcherMap;
  attributeConditionEvaluationFactory?: TAttributeConditionEvaluationFactory;
};