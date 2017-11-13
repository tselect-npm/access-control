import { ComparisonOperator } from '../constants/comparison-operator';
import { TAttributeName } from './attribute-name';

export type TAttributeConditionEvaluationJSON = {
  result: boolean;
  operator: ComparisonOperator;
  attributeName: TAttributeName;
  environmentValue: any;
};