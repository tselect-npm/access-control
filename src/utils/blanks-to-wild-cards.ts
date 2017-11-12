import { WILD_CARD } from '../constants/wild-card';

export function blanksToWildCards(arr: string[], targetLength: number): string[] {
  const result = arr.slice(0);

  while (result.length < targetLength) {
    result.push(WILD_CARD);
  }

  return result;
}