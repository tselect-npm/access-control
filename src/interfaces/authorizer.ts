import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccess } from './access';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';

export interface IAuthorizer {
  authorize(resource: TResource, action: TAction, permissions: TPermission[], environment?: TEnvironment): IAccess;
}