import { TConditionOperatorHandler } from './condition-operator-handler';
import { TConditionValue } from './condition-value';

export type TConditionModifierHandler = (handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValue: any) => boolean;
