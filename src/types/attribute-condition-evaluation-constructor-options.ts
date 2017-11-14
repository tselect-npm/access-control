import { ConditionOperator } from '../constants/condition-operator';
import { TAttributeName } from './attribute-name';

export type TAttributeConditionEvaluationConstructorOptions = {
  result: boolean;
  operator: ConditionOperator;
  attributeName: TAttributeName;
  environmentValue: any;
}