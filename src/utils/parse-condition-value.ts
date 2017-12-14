import { TEnvironment } from '../types/environment';
import { Keys } from './keys';
import { makeArray } from '@bluejay/utils';

export function parseConditionValue(value: string, environment: TEnvironment): string[] {
  const match: string[] | null = /^{{{([a-zA-Z.-_0-9]+)}}}$/g.exec(value);

  if (match) {
    return Keys.getValues(environment, match[1]);
  }

  return makeArray(value);
}