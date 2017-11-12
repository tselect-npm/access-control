import { ComparisonOperator } from '../constants/comparison-operator';
import { TAttributeName } from './attribute-name';
import { TComparisonValue } from './comparison-value';

export type TPermissionCondition = {
  [operator in Partial<ComparisonOperator>]: {
    [attribute in TAttributeName]: TComparisonValue | TComparisonValue[];
  }
}