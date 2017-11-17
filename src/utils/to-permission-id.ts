import { TPermissionOrId } from '../types/permission-or-id';
import { TPermissionId } from '../types/permission-id';
import * as Lodash from 'lodash';
import { TPermission } from '../types/permission';

export function toPermissionId(permissionOrId: TPermissionOrId): TPermissionId {
  return Lodash.isPlainObject(permissionOrId) ? (<TPermission>permissionOrId).id : <TPermissionId>permissionOrId;
}