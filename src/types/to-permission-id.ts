import { TPermissionOrId } from './permission-or-id';
import { TPermissionId } from './permission-id';
import * as Lodash from 'lodash';
import { TPermission } from './permission';

export function toPermissionId(permissionOrId: TPermissionOrId): TPermissionId {
  return Lodash.isPlainObject(permissionOrId) ? (<TPermission>permissionOrId).id : <TPermissionId>permissionOrId;
}