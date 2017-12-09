import { VARIABLE_REG } from '../constants/variable-reg';
import { TEnvironment } from '../types/environment';
import { Keys } from './keys';
import { makeArray } from '@bluejay/utils';

export function parseConditionValue(value: string, environment: TEnvironment): string[] {
  const match: string[] | null = VARIABLE_REG.exec(value);

  if (match) {
    return Keys.getValues(environment, match[1]);
  }

  return makeArray(value);
}