export class InvalidEnvironmentValueError extends Error {
  private value: any;

  public constructor(value: any) {
    super(`Invalid environment value: ${value}`);
    this.value = value;
  }

  public getValue(): any {
    return this.value;
  }

  public static hasInstance(err: any): err is InvalidEnvironmentValueError {
    return err instanceof InvalidEnvironmentValueError;
  }
}