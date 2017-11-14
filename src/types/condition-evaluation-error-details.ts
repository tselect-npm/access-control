import { ConditionModifier } from '../constants/condition-modifier';
import { ConditionOperator } from '../constants/condition-operator';
import { TAttributeName } from './attribute-name';

export type TConditionEvaluationMalformedConditionErrorDetails = {
  value: any;
}
export type TConditionEvaluationUnknownOperatorErrorDetails = {
  value: string;
}
export type TConditionEvaluationUnknownModifierErrorDetails = {
  value: string;
}
export type TConditionEvaluationInvalidEnvironmentValueErrorDetails = {
  value: any;
  attribute: TAttributeName;
  operator: ConditionOperator;
  modifier: ConditionModifier;
}
export type TConditionEvaluationInvalidConditionValueErrorDetails = {
  value: any;
  attribute: TAttributeName;
  operator: ConditionOperator;
  modifier: ConditionModifier;
}
export type TConditionEvaluationErrorDetails =
  TConditionEvaluationUnknownOperatorErrorDetails |
  TConditionEvaluationUnknownModifierErrorDetails |
  TConditionEvaluationInvalidEnvironmentValueErrorDetails |
  TConditionEvaluationInvalidConditionValueErrorDetails;