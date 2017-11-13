import { IConditionEvaluation } from '../interfaces/condition-evaluation';

export type TConditionEvaluationConstructorOptions = {
  result: boolean;
};

export class ConditionEvaluation implements IConditionEvaluation {
  private result: boolean;

  public constructor(options: TConditionEvaluationConstructorOptions) {
    this.result = options.result;
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
}