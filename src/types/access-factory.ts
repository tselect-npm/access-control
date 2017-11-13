import { TAccessConstructorOptions } from './access-constructor-options';
import { IAccess } from '../interfaces/access';

export type TAccessFactory = (options?: TAccessConstructorOptions) => IAccess;