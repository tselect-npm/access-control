import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TConditionEvaluatorConstructorOptions } from './condition-evaluator-constructor-options';
import { TAccessFactory } from './access-factory';

export type TAuthorizerConstructorOptions = {
  accessFactory?: TAccessFactory;
  conditionEvaluator?: IConditionEvaluator;
  conditionEvaluatorOptions?: TConditionEvaluatorConstructorOptions;
}