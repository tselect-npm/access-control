import { IAccess } from '../interfaces/access';
import { TAccessConstructorOptions } from './access-constructor-options';

export type TAccessFactory = (options: TAccessConstructorOptions) => IAccess;
