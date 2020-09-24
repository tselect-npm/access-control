import { TEnvironment } from '../types/environment';
import { TPermissionCondition } from '../types/permission-condition';
import { IConditionEvaluation } from './condition-evaluation';

export interface IConditionEvaluator {
  evaluate(condition: TPermissionCondition | null | undefined, environment: TEnvironment): IConditionEvaluation;
}
