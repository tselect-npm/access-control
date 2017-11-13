import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';
import * as moment from 'moment';
import { InvalidComparisonValueError } from '../errors/invalid-comparison-value';
import { Moment } from 'moment';

export class DateConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.DATE_EQUALS:
      case ComparisonOperator.DATE_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator);
      case ComparisonOperator.DATE_NOT_EQUALS:
      case ComparisonOperator.DATE_NOT_EQUALS_IF_EXISTS:
        return this.notEquals(comparisonValues, envValue, operator);
      case ComparisonOperator.DATE_GREATER_THAN:
      case ComparisonOperator.DATE_GREATER_THAN_IF_EXISTS:
        return this.greaterThan(comparisonValues, envValue, operator);
      case ComparisonOperator.DATE_LOWER_THAN:
      case ComparisonOperator.DATE_LOWER_THAN_IF_EXISTS:
        return this.lowerThan(comparisonValues, envValue, operator);
      case ComparisonOperator.DATE_GREATER_THAN_EQUALS:
      case ComparisonOperator.DATE_GREATER_THAN_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator) || this.greaterThan(comparisonValues, envValue, operator);
      case ComparisonOperator.DATE_LOWER_THAN_EQUALS:
      case ComparisonOperator.DATE_LOWER_THAN_EQUALS_IF_EXISTS:
        return this.equals(comparisonValues, envValue, operator) || this.lowerThan(comparisonValues, envValue, operator);
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected equals(comparisonValues: TComparisonValue[], envValue: any, originalOperator: ComparisonOperator): boolean {
    const envDate = moment(envValue);

    if (!envDate.isValid()) {
      return false;
    }

    for (const dateStr of comparisonValues) {
      const compDate = moment(dateStr);

      this.assertValidDate(compDate, originalOperator);

      if (compDate.isSame(envDate)) {
        return true;
      }
    }

    return false;
  }

  protected notEquals(comparisonValues: TComparisonValue[], envValue: any, originalOperator: ComparisonOperator): boolean {
    const envDate = moment(envValue);

    if (!envDate.isValid()) {
      return false;
    }

    for (const dateStr of comparisonValues) {
      const compDate = moment(dateStr);

      this.assertValidDate(compDate, originalOperator);

      if (compDate.isSame(envDate)) {
        return false;
      }
    }

    return true;
  }

  protected greaterThan(comparisonValues: TComparisonValue[], envValue: any, originalOperator: ComparisonOperator): boolean {
    const envDate = moment(envValue);

    for (const dateStr of comparisonValues) {
      const compDate = moment(dateStr);

      this.assertValidDate(compDate, originalOperator);

      if (compDate.isBefore(envDate)) {
        return false;
      }
    }

    return true;
  }

  protected lowerThan(comparisonValues: TComparisonValue[], envValue: any, originalOperator: ComparisonOperator): boolean {
    const envDate = moment(envValue);

    for (const dateStr of comparisonValues) {
      const compDate = moment(dateStr);

      this.assertValidDate(compDate, originalOperator);

      if (compDate.isAfter(envDate)) {
        return false;
      }
    }

    return true;
  }

  protected assertValidDate(value: Moment, operator: ComparisonOperator) {
    if (!value.isValid())  {
      throw new InvalidComparisonValueError(operator, value.toDate());
    }
  }
}