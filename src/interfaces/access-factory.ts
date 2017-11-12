import { IAccess } from './access';

export type TAccessFactory = (allowed: boolean) => IAccess;