import { implies } from './implies';

export function anyImplies(left: string[], right: string): boolean {
  for (const sub of left) {
    if (implies(sub, right)) {
      return true;
    }
  }
  return false;
}