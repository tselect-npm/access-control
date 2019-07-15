import { PermissionEffect } from '../constants/permission-effect';
import { TAction } from './action';
import { TAttributeName } from './attribute-name';
import { TPermissionCondition } from './permission-condition';
import { TPermissionId } from './permission-id';
import { TResource } from './resource';
import { TWildCard } from './wild-card';

export type TPermission = {
  id: TPermissionId;
  effect: PermissionEffect;
  resource: TResource | TResource[];
  action: TAction | TAction[];
  returnedAttributes?: TAttributeName[] | TWildCard;
  condition?: TPermissionCondition;
  customData?: Object;
}