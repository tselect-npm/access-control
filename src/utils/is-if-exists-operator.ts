import { ComparisonOperator } from '../constants/comparison-operator';

const reg = /IfExists$/;

export function isIfExistsOperator(operator: ComparisonOperator): boolean {
  return reg.test(operator);
}