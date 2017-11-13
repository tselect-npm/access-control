import { IStore } from '../interfaces/store';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TAuthorizerConstructorOptions } from './authorizer-constructor-options';

export type TAccessControlManagerConstructorOptions = {
  store?: IStore;
  authorizer?: IAccessAuthorizer;
  authorizerOptions?: TAuthorizerConstructorOptions;
};