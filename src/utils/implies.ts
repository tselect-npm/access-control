import { isWildCard } from './is-wild-card';

export function implies(left: string, right: string) {
  return left === right || isWildCard(left);
}
