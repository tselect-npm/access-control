export class UnmappedConditionModifierError extends Error {
  public constructor(modifier: string) {
    const message = `Unmapped condition modifier: ${modifier}.`;
    super(message);
  }
}