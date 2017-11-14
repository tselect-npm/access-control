import { TAttributeName } from './attribute-name';
import { TComparisonValue } from './comparison-value';
import { ConditionModifier } from '../constants/condition-modifier';

export type TPermissionConditionOperatorDescription = {
  [modifier in ConditionModifier]?: {
    [attributeName in TAttributeName]: TComparisonValue | TComparisonValue[];
  }
}