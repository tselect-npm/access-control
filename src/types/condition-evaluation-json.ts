import { ConditionEvaluationErrorCode } from '../constants/condition-evaluation-error-code';
import { ConditionEvaluationResultCode } from '../constants/condition-evaluation-result-code';
import { TConditionEvaluationErrorDetails } from './condition-evaluation-error-details';

export type TConditionEvaluationJSON = {
  succeeded: boolean;
  resultCode: ConditionEvaluationResultCode;
  errorCode: ConditionEvaluationErrorCode | null;
  errorDetails: TConditionEvaluationErrorDetails | null;
};
