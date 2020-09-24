import { TPermission } from '../types/permission';
import { ISubject } from './subject';

export interface IStore {
  getPermissionsForSubject(subject: ISubject<{}>): TPermission[] | Promise<TPermission[]>;
}
