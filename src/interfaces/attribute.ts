export interface IAttribute {
  getName(): string;
  getType(): string;
  isOfType(type: string): boolean;
}
