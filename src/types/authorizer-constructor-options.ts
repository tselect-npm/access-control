import { IAccess } from '../interfaces/access';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TConditionEvaluatorConstructorOptions } from './condition-evaluator-constructor-options';

export type TAuthorizerConstructorOptions = {
  accessFactory?: (allowed: boolean) => IAccess;
  conditionEvaluator?: IConditionEvaluator;
  conditionEvaluatorOptions?: TConditionEvaluatorConstructorOptions;
}