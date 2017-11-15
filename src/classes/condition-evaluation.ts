import { ConditionEvaluationErrorCode } from '../constants/condition-evaluation-error-code';
import {
  TConditionEvaluationErrorDetails} from '../types/condition-evaluation-error-details';
import { ConditionEvaluationResultCode } from '../constants/condition-evaluation-result-code';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import {
  TConditionEvaluationInvalidConditionValueErrorDetails,
  TConditionEvaluationInvalidEnvironmentValueErrorDetails,
  TConditionEvaluationMalformedConditionErrorDetails, TConditionEvaluationUnknownModifierErrorDetails,
  TConditionEvaluationUnknownOperatorErrorDetails
} from '../types/condition-evaluation-error-details';
import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';

export class ConditionEvaluation implements IConditionEvaluation {
  private resultCode: ConditionEvaluationResultCode;
  private errorCode: ConditionEvaluationErrorCode | null;
  private errorDetails: TConditionEvaluationErrorDetails | null;

  public constructor() {
    this.resultCode = ConditionEvaluationResultCode.UNKNOWN;
    this.errorCode = null;
    this.errorDetails = null;
  }

  public succeeded() {
    return this.resultCode === ConditionEvaluationResultCode.SUCCESS;
  }

  public failed() {
    return !this.succeeded();
  }

  public errored() {
    return this.resultCode === ConditionEvaluationResultCode.ERROR;
  }

  public isKnown() {
    return this.resultCode !== ConditionEvaluationResultCode.UNKNOWN;
  }

  public fail() {
    this.resultCode = ConditionEvaluationResultCode.FAILURE;
    return this;
  }

  public succeed() {
    this.resultCode = ConditionEvaluationResultCode.SUCCESS;
    this.errorCode = null;
    this.errorDetails = null;
    return this;
  }

  public error(code: ConditionEvaluationErrorCode.MALFORMED_CONDITION, details: TConditionEvaluationMalformedConditionErrorDetails): this;
  public error(code: ConditionEvaluationErrorCode.UNKNOWN_OPERATOR, details: TConditionEvaluationUnknownOperatorErrorDetails): this;
  public error(code: ConditionEvaluationErrorCode.UNKNOWN_MODIFIER, details: TConditionEvaluationUnknownModifierErrorDetails): this;
  public error(code: ConditionEvaluationErrorCode.INVALID_CONDITION_VALUE, details: TConditionEvaluationInvalidConditionValueErrorDetails): this;
  public error(code: ConditionEvaluationErrorCode.INVALID_ENVIRONMENT_VALUE, details: TConditionEvaluationInvalidEnvironmentValueErrorDetails): this;
  public error(code: ConditionEvaluationErrorCode, details: TConditionEvaluationErrorDetails): this {
    this.resultCode = ConditionEvaluationResultCode.ERROR;
    this.errorCode = code;
    this.errorDetails = details;
    return this;
  }

  public getResultCode(): ConditionEvaluationResultCode {
    return this.resultCode;
  }

  public getErrorCode(): ConditionEvaluationErrorCode | null {
    return this.errorCode;
  }

  public getErrorDetails(): TConditionEvaluationErrorDetails | null {
    return this.errorDetails;
  }

  public toJSON(): TConditionEvaluationJSON {
    return {
      succeeded: this.succeeded(),
      resultCode: this.resultCode,
      errorCode: this.errorCode,
      errorDetails: this.errorDetails
    }
  }
}