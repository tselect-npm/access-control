import { IStore } from '../interfaces/store';
import { IAccessAuthorizer } from '../interfaces/access-authorizer';
import { TAccessFactory } from '../interfaces/access-factory';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TAuthorizerConstructorOptions } from './authorizer-constructor-options';

export type TAccessControlManagerConstructorOptions = {
  store?: IStore;
  authorizer?: IAccessAuthorizer;
  authorizerOptions?: TAuthorizerConstructorOptions;
};