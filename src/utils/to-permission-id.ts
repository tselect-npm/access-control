import * as Lodash from 'lodash';
import { TPermission } from '../types/permission';
import { TPermissionId } from '../types/permission-id';
import { TPermissionOrId } from '../types/permission-or-id';

export function toPermissionId(permissionOrId: TPermissionOrId): TPermissionId {
  return Lodash.isPlainObject(permissionOrId) ? (<TPermission>permissionOrId).id : <TPermissionId>permissionOrId;
}
