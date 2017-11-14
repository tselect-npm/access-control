import { ConditionEvaluationResultCode } from '../constants/condition-evaluation-result-code';
import { ConditionEvaluationErrorCode } from '../constants/condition-evaluation-error-code';
import { TConditionEvaluationErrorDetails } from './condition-evaluation-error-details';
import { TPermissionCondition } from './permission-condition';

export type TConditionEvaluationJSON = {
  succeeded: boolean;
  resultCode: ConditionEvaluationResultCode;
  errorCode: ConditionEvaluationErrorCode | null;
  errorDetails: TConditionEvaluationErrorDetails | null;
  condition: TPermissionCondition;
};