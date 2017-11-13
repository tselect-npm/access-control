import { TConditionEvaluationFactory } from './condition-evaluation-factory';
import { TConditionOperationMatcherMap } from './condition-operation-matcher-map';

export type TConditionEvaluatorConstructorOptions = {
  conditionEvaluationFactory?: TConditionEvaluationFactory;
  conditionOperationMatchersMap?: TConditionOperationMatcherMap;
};