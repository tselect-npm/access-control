import { ConditionEvaluationErrorCode } from '../constants/condition-evaluation-error-code';
import { ConditionEvaluationResultCode } from '../constants/condition-evaluation-result-code';
import {
  TConditionEvaluationErrorDetails} from '../types/condition-evaluation-error-details';
import {
  TConditionEvaluationInvalidConditionValueErrorDetails,
  TConditionEvaluationInvalidEnvironmentValueErrorDetails,
  TConditionEvaluationMalformedConditionErrorDetails, TConditionEvaluationUnknownModifierErrorDetails,
  TConditionEvaluationUnknownOperatorErrorDetails
} from '../types/condition-evaluation-error-details';
import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';

export interface IConditionEvaluation {
  succeeded(): boolean;
  failed(): boolean;
  errored(): boolean;
  isKnown(): boolean;
  fail(): this;
  succeed(): this;
  getResultCode(): ConditionEvaluationResultCode;
  getErrorCode(): ConditionEvaluationErrorCode | null;
  getErrorDetails(): TConditionEvaluationErrorDetails | null;
  error(code: ConditionEvaluationErrorCode.MALFORMED_CONDITION, details: TConditionEvaluationMalformedConditionErrorDetails): this;
  error(code: ConditionEvaluationErrorCode.UNKNOWN_OPERATOR, details: TConditionEvaluationUnknownOperatorErrorDetails): this;
  error(code: ConditionEvaluationErrorCode.UNKNOWN_MODIFIER, details: TConditionEvaluationUnknownModifierErrorDetails): this;
  error(code: ConditionEvaluationErrorCode.INVALID_CONDITION_VALUE, details: TConditionEvaluationInvalidConditionValueErrorDetails): this;
  error(code: ConditionEvaluationErrorCode.INVALID_ENVIRONMENT_VALUE, details: TConditionEvaluationInvalidEnvironmentValueErrorDetails): this;
  error(code: ConditionEvaluationErrorCode, details: TConditionEvaluationErrorDetails): this;
  toJSON(): TConditionEvaluationJSON;
}
