import { ConditionOperator } from '../constants/condition-operator';
import { TAttributeName } from './attribute-name';

export type TAttributeConditionEvaluationJSON = {
  result: boolean;
  operator: ConditionOperator;
  attributeName: TAttributeName;
  environmentValue: any;
};