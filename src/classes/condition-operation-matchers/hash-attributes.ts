import { IConditionOperationMatcher } from '../../interfaces/condition-operation-matcher';
import { ComparisonOperator } from '../../constants/comparison-operator';
import { TComparisonValue } from '../../types/comparison-value';
import { UnmappedConditionOperatorError } from '../errors/unmapped-condition-operator';
import * as Lodash from 'lodash';

export class HashAttributesConditionOperationMatcher implements IConditionOperationMatcher {
  public matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean {
    switch (operator) {
      case ComparisonOperator.HASH_ATTRIBUTES_EQUAL:
      case ComparisonOperator.HASH_ATTRIBUTES_EQUAL_IF_EXISTS:
        return this.equal(comparisonValues, envValue);
      case ComparisonOperator.HASH_ATTRIBUTES_INCLUDE:
      case ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_IF_EXISTS:
        return this.include(comparisonValues, envValue);
      case ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE:
      case ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE_IF_EXISTS:
        return this.include(comparisonValues, envValue) && Object.keys(envValue as {}).length >= 1;
      default:
        throw new UnmappedConditionOperatorError(operator);
    }
  }

  protected equal(comparisonValues: TComparisonValue[], envValue: any): boolean {
    if (!Lodash.isPlainObject(envValue)) {
      return false;
    }

    const envAttributes = Object.keys(envValue as {});

    if (envAttributes.length !== comparisonValues.length) {
      return false;
    }

    for (const attr of envAttributes) {
      if (!comparisonValues.find(compAttr => compAttr === attr)) {
        return false;
      }
    }

    return true;
  }

  protected include(comparisonValues: TComparisonValue[], envValue: any): boolean {
    if (!Lodash.isPlainObject(envValue)) {
      return false;
    }

    const envAttributes = Object.keys(envValue as {});

    for (const attr of envAttributes) {
      if (!comparisonValues.find(compAttr => compAttr === attr)) {
        return false;
      }
    }

    return true;
  }
}