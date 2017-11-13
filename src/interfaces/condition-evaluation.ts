export interface IConditionEvaluation {
  getResult(): boolean;
  succeeded(): boolean;
  failed(): boolean;
}