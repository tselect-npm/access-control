import { IAccess } from './access';
import { TAction } from '../types/action';
import { TResource } from '../types/resource';
import { ISubject } from './subject';

export interface IAccessControlManager {
  authorize(subject: ISubject<any>, resource: TResource, action: TAction): Promise<IAccess>;
}