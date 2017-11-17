import { TConditionValue } from './condition-value';
import { TConditionOperatorHandler } from './condition-operator-handler';

export type TConditionModifierHandler = (handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValue: any) => boolean;