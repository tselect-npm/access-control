import { ComparisonOperator } from '../constants/comparison-operator';
import { TPermissionOperatorCondition } from './permission-operator-condition';

export type TPermissionCondition = {
  [operator in ComparisonOperator]?: TPermissionOperatorCondition;
}