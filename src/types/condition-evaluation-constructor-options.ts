import { IAttributeConditionEvaluation } from '../interfaces/attribute-condition-evaluation';

export type TConditionEvaluationConstructorOptions = {
  result: boolean;
  failedAttributeConditionEvaluation?: IAttributeConditionEvaluation | null;
};