import { WILD_CARD } from '../constants/wild-card';

export function isWildCard(value: string): boolean {
  return value === WILD_CARD;
}