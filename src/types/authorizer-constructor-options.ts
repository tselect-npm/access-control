import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TAccessFactory } from './access-factory';
import { TConditionEvaluatorConstructorOptions } from './condition-evaluator-constructor-options';

export type TAuthorizerConstructorOptions = {
  accessFactory?: TAccessFactory;
  conditionEvaluator?: IConditionEvaluator;
  conditionEvaluatorOptions?: TConditionEvaluatorConstructorOptions;
};
