import { TAttributeName } from '../types/attribute-name';
import { ConditionOperator } from '../constants/condition-operator';
import { TAttributeConditionEvaluationJSON } from '../types/attribute-condition-evaluation-json';

export interface IAttributeConditionEvaluation {
  getResult(): boolean;
  succeeded(): boolean;
  failed(): boolean;
  getOperator(): ConditionOperator | null;
  getAttributeName(): TAttributeName | null;
  getEnvironmentValue(): any;
  toJSON(): TAttributeConditionEvaluationJSON;
}