export class Access {
  private allowed: boolean;

  public constructor(allowed: boolean) {
    this.allowed = allowed;
  }

  public isDenied() {
    return !this.allowed;
  }

  public isAllowed() {
    return this.allowed;
  }
}