import { ComparisonOperator } from '../constants/comparison-operator';
import { TPermissionOperatorCondition } from '../types/permission-operator-condition';
import { TEnvironment } from '../types/environment';
import { TPermissionCondition } from '../types/permission-condition';
import { IConditionEvaluation } from './condition-evaluation';

export interface IConditionEvaluator {
  evaluate(condition: TPermissionCondition | null | undefined, environment: TEnvironment): IConditionEvaluation;
}