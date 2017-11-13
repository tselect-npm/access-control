import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { TConditionEvaluationConstructorOptions } from '../types/condition-evaluation-constructor-options';
import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';
import { TAttributeName } from '../types/attribute-name';
import { ComparisonOperator } from '../constants/comparison-operator';

export class ConditionEvaluation implements IConditionEvaluation {
  private result: boolean;
  private attributeName: TAttributeName | null;
  private operator: ComparisonOperator | null;
  private environmentValue: any;

  public constructor(options: TConditionEvaluationConstructorOptions) {
    this.result = options.result;

    if (!this.result) {
      if (!options.operator) {
        throw new Error(`A failing operation evaluation requires an operator value.`)
      } else {
        this.operator = options.operator;
      }
      if (!options.attributeName) {
        throw new Error(`A failing operation evaluation requires an attributeName value.`)
      } else {
        this.attributeName = options.attributeName;
      }
      if (!options.environmentValue) {
        throw new Error(`A failing operation evaluation requires an environmentValue value.`)
      } else {
        this.environmentValue = options.environmentValue;
      }
    } else {
      this.operator = this.attributeName = null;
    }
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

  public getOperator(): ComparisonOperator | null {
    return this.operator;
  }

  public getAttributeName(): TAttributeName | null {
    return this.attributeName;
  }

  public getEnvironmentValue(): any {
    return this.environmentValue;
  }

  public toJSON(): TConditionEvaluationJSON {
    return {
      result: this.result,
      operator: this.operator,
      attributeName: this.attributeName,
      environmentValue: this.environmentValue
    };
  }
}