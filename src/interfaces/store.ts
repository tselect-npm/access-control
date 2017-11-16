import { ISubject } from './subject';
import { TPermission } from '../types/permission';

export interface IStore {
  getPermissionsForSubject(subject: ISubject<any>): TPermission[] | Promise<TPermission[]>;
}