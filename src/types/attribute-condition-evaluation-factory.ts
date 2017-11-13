import { TAttributeConditionEvaluationConstructorOptions } from './attribute-condition-evaluation-constructor-options';
import { IAttributeConditionEvaluation } from '../interfaces/attribute-condition-evaluation';

export type TAttributeConditionEvaluationFactory = (options: TAttributeConditionEvaluationConstructorOptions) => IAttributeConditionEvaluation;