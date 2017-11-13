import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import { InvalidComparisonValueError } from '../errors/invalid-comparison-value';
import * as Lodash from 'lodash';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';

export class StringArrayConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.STRING_ARRAY_MEMBERS_EQUAL:
      case ComparisonOperator.STRING_ARRAY_MEMBERS_EQUAL_IF_EXISTS:
        return this.equal(comparisonValues, envValue, operator);
      case ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE:
      case ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_IF_EXISTS:
        return this.include(comparisonValues, envValue, operator);
      case ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE:
      case ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE_IF_EXISTS:
        return this.include(comparisonValues, envValue, operator) && (<string[]>envValue).length >= 1;
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected equal(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    if (!Array.isArray(envValue)) {
      return false;
    }

    this.assertIsValidStringArray(comparisonValues, operator);

    if (envValue.length !== comparisonValues.length) {
      return false;
    }

    for (const value of envValue) {
      if (!comparisonValues.find(val => val === value)) {
        return false;
      }
    }

    return true;
  }

  protected include(comparisonValues: TComparisonValue[], envValue: any, operator: ComparisonOperator): boolean {
    if (!Array.isArray(envValue)) {
      return false;
    }

    this.assertIsValidStringArray(comparisonValues, operator);

    for (const value of envValue) {
      if (!comparisonValues.find(val => val === value)) {
        return false;
      }
    }

    return true;
  }

  protected assertIsValidStringArray(value: any, operator: ComparisonOperator) {
    if (!Array.isArray(value) || !value.every(value => Lodash.isString(value))) {
      throw new InvalidComparisonValueError(value, operator);
    }
  }
}