import { IStore } from '../interfaces/store';
import { IAuthorizer } from '../interfaces/authorizer';
import { TAccessFactory } from '../interfaces/access-factory';

export type TAccessControlManagerConstructorOptions = {
  store?: IStore;
  accessBuilder?: IAuthorizer;
  accessFactory?: TAccessFactory;
};