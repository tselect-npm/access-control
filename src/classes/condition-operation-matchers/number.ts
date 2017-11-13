import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';
import * as Lodash from 'lodash';
import { InvalidComparisonValueError } from '../errors/invalid-comparison-value';

export class NumberConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.NUMBER_EQUALS:
      case ComparisonOperator.NUMBER_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator);
      case ComparisonOperator.NUMBER_NOT_EQUALS:
      case ComparisonOperator.NUMBER_NOT_EQUALS_IF_EXISTS:
        return this.notEquals(comparisonValues, envValue, operator);
      case ComparisonOperator.NUMBER_LOWER_THAN:
      case ComparisonOperator.NUMBER_LOWER_THAN_IF_EXISTS:
        return this.lowerThan(comparisonValues, envValue, operator);
      case ComparisonOperator.NUMBER_LOWER_THAN_EQUALS:
      case ComparisonOperator.NUMBER_LOWER_THAN_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator) || this.lowerThan(comparisonValues, envValue, operator);
      case ComparisonOperator.NUMBER_GREATER_THAN:
      case ComparisonOperator.NUMBER_GREATER_THAN_IF_EXISTS:
        return this.greaterThan(comparisonValues, envValue, operator);
      case ComparisonOperator.NUMBER_GREATER_THAN_EQUALS:
      case ComparisonOperator.NUMBER_GREATER_THAN_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator) || this.greaterThan(comparisonValues, envValue, operator);
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected equals(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    const envNumber = parseFloat(envValue);

    if (Lodash.isNaN(envNumber)) {
      return false;
    }

    for (const numberStr of comparisonValues) {
      const compNumber = parseFloat(numberStr);

      this.assertValidNumber(compNumber, operator);

      if (envNumber === compNumber) {
        return true;
      }
    }

    return false;
  }

  protected notEquals(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    const envNumber = parseFloat(envValue);

    if (Lodash.isNaN(envNumber)) {
      return false;
    }

    for (const numberStr of comparisonValues) {
      const compNumber = parseFloat(numberStr);

      this.assertValidNumber(compNumber, operator);

      if (envNumber === compNumber) {
        return false;
      }
    }

    return true;
  }

  protected lowerThan(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    const envNumber = parseFloat(envValue);

    if (Lodash.isNaN(envNumber)) {
      return false;
    }

    for (const numberStr of comparisonValues) {
      const compNumber = parseFloat(numberStr);

      this.assertValidNumber(compNumber, operator);

      if (envNumber < compNumber) {
        return true;
      }
    }

    return false;
  }

  protected greaterThan(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    const envNumber = parseFloat(envValue);

    if (Lodash.isNaN(envNumber)) {
      return false;
    }

    for (const numberStr of comparisonValues) {
      const compNumber = parseFloat(numberStr);

      this.assertValidNumber(compNumber, operator);

      if (envNumber > compNumber) {
        return true;
      }
    }

    return false;
  }

  protected assertValidNumber(value: any, operator: ComparisonOperator) {
    if (Lodash.isNaN(value)) {
      throw new InvalidComparisonValueError(value, operator);
    }
  }
}