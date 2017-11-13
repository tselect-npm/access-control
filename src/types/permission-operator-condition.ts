import { TAttributeName } from './attribute-name';
import { TComparisonValue } from './comparison-value';

export type TPermissionOperatorCondition = {
  [attribute in TAttributeName]: TComparisonValue | TComparisonValue[];
};