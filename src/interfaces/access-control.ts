import { TAction } from '../types/action';
import { TResource } from '../types/resource';
import { IAccess } from './access';
import { ISubject } from './subject';

export interface IAccessControl {
  authorize(subject: ISubject<any>, resource: TResource, action: TAction, environment?: {}): Promise<IAccess>;
  can(subject: ISubject<any>, resource: TResource, action: TAction, environment?: {}): Promise<boolean>;
}
