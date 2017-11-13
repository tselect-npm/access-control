import { ComparisonOperator } from '../constants/comparison-operator';

const reg = /if_exists$/;

export function isIfExistsOperator(operator: ComparisonOperator): boolean {
  return reg.test(operator);
}