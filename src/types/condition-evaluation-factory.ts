import { TConditionEvaluationConstructorOptions } from './condition-evaluation-constructor-options';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';

export type TConditionEvaluationFactory = (options: TConditionEvaluationConstructorOptions) => IConditionEvaluation;