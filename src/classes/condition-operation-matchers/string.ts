import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import * as Lodash from 'lodash';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';

export class StringConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.STRING_EQUALS:
      case ComparisonOperator.STRING_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue);
      case ComparisonOperator.STRING_NOT_EQUALS:
      case ComparisonOperator.STRING_NOT_EQUALS_IF_EXISTS:
        return this.notEquals(comparisonValues, envValue);
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected equals(comparisonValues: TComparisonValue[], envValue: any): boolean {
    if (!Lodash.isString(envValue)) {
      return false;
    }

    for (const value of comparisonValues) {
      if (value === envValue) {
        return true;
      }
    }

    return false;
  }

  protected notEquals(comparisonValues: TComparisonValue[], envValue: any): boolean {
    if (!Lodash.isString(envValue)) {
      return false;
    }

    for (const value of comparisonValues) {
      if (value === envValue) {
        return false;
      }
    }

    return true;
  }
}