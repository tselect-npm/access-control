const reg = /IfExists$/;

export function isIfExistsModifier(str: string): boolean {
  return reg.test(str);
}
