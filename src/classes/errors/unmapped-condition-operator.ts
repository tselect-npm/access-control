import { ComparisonOperator } from '../../constants/comparison-operator';

export class UnmappedConditionOperatorError extends Error {
  public constructor(operator: ComparisonOperator) {
    const message = `Unmapped condition operator: ${operator}.`;
    super(message);
  }
}