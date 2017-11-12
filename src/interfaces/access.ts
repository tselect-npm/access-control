export interface IAccess {
  isAllowed(): boolean;
  isDenied(): boolean;
}