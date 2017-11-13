import { TComparisonValue } from '../types/comparison-value';
import { ComparisonOperator } from '../constants/comparison-operator';

export interface IConditionOperationMatcher {
  matches(operator: ComparisonOperator, comparisonValues: TComparisonValue[], envValue: any): boolean;
}