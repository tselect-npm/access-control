import { TPermission } from './permission';
import { TPermissionId } from './permission-id';

export type TCreatePermission = Pick<TPermission, 'effect' | 'resource' | 'action' | 'condition' | 'returnedAttributes' | 'customData'> & { id?: TPermissionId };
