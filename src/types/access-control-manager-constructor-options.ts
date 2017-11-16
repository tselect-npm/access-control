import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TAuthorizerConstructorOptions } from './authorizer-constructor-options';
import { IStore } from '../interfaces/store';

export type TAccessControlManagerConstructorOptions = {
  store: IStore;
  authorizer?: IAccessAuthorizer;
  authorizerOptions?: TAuthorizerConstructorOptions;
};