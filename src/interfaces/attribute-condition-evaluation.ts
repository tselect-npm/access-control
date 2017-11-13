import { TAttributeName } from '../types/attribute-name';
import { ComparisonOperator } from '../constants/comparison-operator';
import { TAttributeConditionEvaluationJSON } from '../types/attribute-condition-evaluation-json';

export interface IAttributeConditionEvaluation {
  getResult(): boolean;
  succeeded(): boolean;
  failed(): boolean;
  getOperator(): ComparisonOperator | null;
  getAttributeName(): TAttributeName | null;
  getEnvironmentValue(): any;
  toJSON(): TAttributeConditionEvaluationJSON;
}