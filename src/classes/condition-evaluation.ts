import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { TConditionEvaluationConstructorOptions } from '../types/condition-evaluation-constructor-options';
import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';
import { IAttributeConditionEvaluation } from '../interfaces/attribute-condition-evaluation';

export class ConditionEvaluation implements IConditionEvaluation {
  private result: boolean;
  private failedAttributeConditionEvaluation: IAttributeConditionEvaluation | null;

  public constructor(options: TConditionEvaluationConstructorOptions) {
    this.result = options.result;
    this.failedAttributeConditionEvaluation = options.failedAttributeConditionEvaluation || null;
  }

  public getResult() {
    return this.result;
  }

  public succeeded() {
    return this.result === true;
  }

  public failed() {
    return this.result === false;
  }

  public getFailedAttributeConditionEvaluation(): IAttributeConditionEvaluation | null {
    return this.failedAttributeConditionEvaluation;
  }

  public toJSON(): TConditionEvaluationJSON {
    return {
      result: this.result,
      failedAttributeConditionEvaluation: this.failedAttributeConditionEvaluation ? this.failedAttributeConditionEvaluation.toJSON() : null
    };
  }
}