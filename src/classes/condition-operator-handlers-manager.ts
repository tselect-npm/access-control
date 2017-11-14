import { IConditionOperatorsHandlerManager } from '../interfaces/condition-operator-handlers-manager';
import * as Lodash from 'lodash';
import { InvalidConditionValueError } from './errors/invalid-condition-value';

export class ConditionOperatorHandlersManager implements IConditionOperatorsHandlerManager {
  public stringEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public stringNotEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public numberEquals(conditionValue: string, environmentValue: any): boolean {
    return environmentValue === this.castToNumber(conditionValue);
  }

  public numberNotEquals(conditionValue: string, environmentValue: any): boolean {
    return !this.numberEquals(conditionValue, environmentValue);
  }

  public numberGreaterThan(conditionValue: string, environmentValue: any): boolean {
    if (!this.isNumber(environmentValue)) {
      return false;
    }

    return this.castToNumber(conditionValue) < environmentValue;
  }

  public numberGreaterThanEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public numberLowerThan(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public numberLowerThanEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public bool(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateNotEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateGreaterThan(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateGreaterThanEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateLowerThan(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  public dateLowerThanEquals(conditionValue: string, environmentValue: any): boolean {
    return true;
  }

  protected castToNumber(value: any): number {
    const num = parseFloat(value);

    const isValid = this.isNumber(num) && value.toString() === num.toString(10);

    if (!isValid) {
      throw new InvalidConditionValueError(value);
    }

    return num;
  }

  protected isNumber(value: any): value is number {
    return !isNaN(value) && Lodash.isNumber(value);
  }
}