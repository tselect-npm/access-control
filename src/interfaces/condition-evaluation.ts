import { TConditionEvaluationJSON } from '../types/condition-evaluation-json';
import { IAttributeConditionEvaluation } from './attribute-condition-evaluation';

export interface IConditionEvaluation {
  getResult(): boolean;
  succeeded(): boolean;
  failed(): boolean;
  getFailedAttributeConditionEvaluation(): IAttributeConditionEvaluation | null;
  toJSON(): TConditionEvaluationJSON;
}