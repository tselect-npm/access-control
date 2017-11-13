import { ComparisonOperator } from '../../constants/comparison-operator';

export class InvalidComparisonValueError extends Error {
  public constructor(operator: ComparisonOperator, value: any) {
    const message = `Invalid comparison value for operator ${operator}: ${value}.`;
    super(message);
  }
}