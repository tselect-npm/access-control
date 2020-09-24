import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { IStore } from '../interfaces/store';
import { TAuthorizerConstructorOptions } from './authorizer-constructor-options';

export type TAccessControlManagerConstructorOptions = {
  store: IStore;
  authorizer?: IAccessAuthorizer;
  authorizerOptions?: TAuthorizerConstructorOptions;
};
