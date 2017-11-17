import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { ConditionOperator } from '../constants/condition-operator';

export type TConditionOperatorsHandlerManager = {
  [operator in ConditionOperator]: TConditionOperatorHandler;
}

export interface IConditionOperatorsManager extends TConditionOperatorsHandlerManager {

}