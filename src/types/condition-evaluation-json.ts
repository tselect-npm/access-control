import { ComparisonOperator } from '../constants/comparison-operator';
import { TAttributeName } from './attribute-name';

export type TConditionEvaluationJSON = {
  result: boolean;
  operator: ComparisonOperator | null;
  attributeName: TAttributeName | null;
  environmentValue: any;
};