export class InvalidConditionValueError extends Error {
  private value: any;

  public constructor(value: any) {
    super(`Invalid condition value: ${value}`);
    this.value = value;
  }

  public getValue() {
    return this.value;
  }

  public static hasInstance(err: any): err is InvalidConditionValueError {
    return err instanceof InvalidConditionValueError;
  }
}