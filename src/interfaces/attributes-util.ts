export interface IAttributesUtil {
  filter<T extends ({} | {}[])>(data: T, matchingPatterns: string | string[]): Partial<T>;
}