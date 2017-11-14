import { ConditionOperator } from '../constants/condition-operator';
import { TPermissionConditionOperatorDescription } from './permission-condition-operator-description';

export type TPermissionCondition = {
  [operator in ConditionOperator]?: TPermissionConditionOperatorDescription;
}