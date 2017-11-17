import { TAttributeName } from './attribute-name';
import { TConditionValue } from './condition-value';
import { ConditionModifier } from '../constants/condition-modifier';

export type TPermissionConditionOperatorDescription = {
  [modifier in ConditionModifier]?: {
    [attributeName in TAttributeName]: TConditionValue | TConditionValue[];
  }
}