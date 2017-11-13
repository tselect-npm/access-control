import { TPermissionCondition } from '../../types/permission-condition';
import * as stringifyObject from 'stringify-object';

export class MalformedConditionError extends Error {
  public constructor(condition: TPermissionCondition) {
    const message = `Malformed condition ${stringifyObject(condition)}.`;
    super(message);
  }
}