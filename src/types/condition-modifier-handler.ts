import { TComparisonValue } from './comparison-value';
import { TConditionOperatorHandler } from './condition-operator-handler';

export type TConditionModifierHandler = (handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any) => boolean;