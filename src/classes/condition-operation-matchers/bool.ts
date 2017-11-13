import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import { InvalidComparisonValueError } from '../errors/invalid-comparison-value';
import * as Lodash from 'lodash';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';

export class BoolConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.BOOL:
      case ComparisonOperator.BOOL_IF_EXISTS:
        const value = Boolean(comparisonValues[0]);
        this.assertValidBoolean(value, operator);
        return envValue === value;
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected assertValidBoolean(value: any, operator: ComparisonOperator) {
    if (!Lodash.isBoolean(value)) {
      throw new InvalidComparisonValueError(value, operator);
    }
  }
}