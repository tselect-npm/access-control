import { TAction } from '../types/action';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';
import { TResource } from '../types/resource';
import { IAccess } from './access';

export interface IAccessAuthorizer {
  authorize(resource: TResource, action: TAction, permissions: TPermission[], environment?: TEnvironment): IAccess;
}
