export class UnmappedConditionOperatorError extends Error {
  public constructor(operator: string) {
    const message = `Unmapped condition operator: ${operator}.`;
    super(message);
  }
}