import { ConditionModifier } from '../constants/condition-modifier';
import { TAttributeName } from './attribute-name';
import { TConditionValue } from './condition-value';

export type TPermissionConditionOperatorDescription = {
  [modifier in ConditionModifier]?: {
    [attributeName in TAttributeName]: TConditionValue | TConditionValue[];
  }
};
