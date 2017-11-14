export class InvalidConditionValueError extends Error {
  public constructor(value: any) {
    const message = `Invalid condition value: ${value}.`;
    super(message);
  }
}