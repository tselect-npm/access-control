import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TAuthorizerConstructorOptions } from './authorizer-constructor-options';
import { IStore } from '../interfaces/store';
import { IAttributesUtil } from '../interfaces/attributes-util';

export type TAccessControlManagerConstructorOptions = {
  store: IStore;
  authorizer?: IAccessAuthorizer;
  authorizerOptions?: TAuthorizerConstructorOptions;
  attributesUtil?: IAttributesUtil;
};