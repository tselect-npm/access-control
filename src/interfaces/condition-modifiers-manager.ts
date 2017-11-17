import { ConditionModifier } from '../constants/condition-modifier';
import { TConditionModifierHandler } from '../types/condition-modifier-handler';

export type TConditionModifierHandlerManager = {
  [modifier in ConditionModifier]: TConditionModifierHandler;
};

export interface IConditionModifiersManager extends TConditionModifierHandlerManager {

}