export interface IAccess {
  isAllowed(): boolean;
  isDenied(): boolean;
  allow(): this;
  deny(): this;
}