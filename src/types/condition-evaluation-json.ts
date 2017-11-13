import { TAttributeConditionEvaluationJSON } from './attribute-condition-evaluation-json';

export type TConditionEvaluationJSON = {
  result: boolean;
  failedAttributeConditionEvaluation: TAttributeConditionEvaluationJSON | null
};