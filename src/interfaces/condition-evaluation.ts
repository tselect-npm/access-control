import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';
import { ComparisonOperator } from '../constants/comparison-operator';
import { TAttributeName } from '../types/attribute-name';

export interface IConditionEvaluation {
  getResult(): boolean;
  succeeded(): boolean;
  failed(): boolean;
  getOperator(): ComparisonOperator | null;
  getAttributeName(): TAttributeName | null;
  getEnvironmentValue(): any;
  toJSON(): TConditionEvaluationJSON;
}