import { TConditionEvaluationConstructorOptions } from '../classes/condition-evaluation';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';

export type TConditionEvaluationFactory = (options: TConditionEvaluationConstructorOptions) => IConditionEvaluation;