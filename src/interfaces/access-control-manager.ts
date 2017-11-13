import { IAccess } from './access';
import { TAction } from '../types/action';
import { TResource } from '../types/resource';
import { ISubject } from './subject';
import { TAttributeName } from '../types/attribute-name';

export interface IAccessControlManager {
  authorize(subject: ISubject<any>, resource: TResource, action: TAction): Promise<IAccess>;
  filterAttributes<T extends {}>(payload: T, allowedAttributes: TAttributeName[]): Partial<T>;
  filterListAttributes<T extends {}>(list: T[], allowAttributes: TAttributeName[]): (Partial<T>)[];
}