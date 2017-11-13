export class Access {
  private allowed: boolean;

  public constructor(allowed: boolean) {
    this.allowed = allowed;
  }

  public deny() {
    this.allowed = false;
    return this;
  }

  public allow() {
    this.allowed = true;
    return this;
  }

  public isDenied() {
    return !this.allowed;
  }

  public isAllowed() {
    return this.allowed;
  }
}