import { IAccess } from './access';
import { TAction } from '../types/action';
import { TResource } from '../types/resource';
import { ISubject } from './subject';
import { TAttributeName } from '../types/attribute-name';

export interface IAccessControl {
  authorize(subject: ISubject<any>, resource: TResource, action: TAction): Promise<IAccess>;
  can(subject: ISubject<any>, resource: TResource, action: TAction): Promise<boolean>;
}