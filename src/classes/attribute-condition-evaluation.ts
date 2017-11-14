import { TAttributeName } from '../types/attribute-name';
import { ConditionOperator } from '../constants/condition-operator';
import { IAttributeConditionEvaluation } from '../interfaces/attribute-condition-evaluation';
import { TAttributeConditionEvaluationConstructorOptions } from '../types/attribute-condition-evaluation-constructor-options';
import { TAttributeConditionEvaluationJSON } from '../types/attribute-condition-evaluation-json';

export class AttributeConditionEvaluation implements IAttributeConditionEvaluation {
  private result: boolean;
  private attributeName: TAttributeName;
  private operator: ConditionOperator;
  private environmentValue: any;

  public constructor(options: TAttributeConditionEvaluationConstructorOptions) {
    this.result = options.result;
    this.attributeName = options.attributeName;
    this.operator = options.operator;
    this.environmentValue = options.environmentValue;
  }

  public getResult(): boolean {
    return this.result;
  }

  public succeeded(): boolean {
    return this.result === true;
  }

  public failed(): boolean {
    return this.result === false;
  }

  public getOperator(): ConditionOperator | null {
    return this.operator;
  }

  public getAttributeName(): TAttributeName | null {
    return this.attributeName;
  }

  public getEnvironmentValue(): any {
    return this.environmentValue;
  }

  public toJSON(): TAttributeConditionEvaluationJSON {
    return {
      result: this.result,
      operator: this.operator,
      attributeName: this.attributeName,
      environmentValue: this.environmentValue
    };
  }
}