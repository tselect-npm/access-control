import { ConditionOperator } from '../constants/condition-operator';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';

export type TConditionOperatorsHandlerManager = {
  [operator in ConditionOperator]: TConditionOperatorHandler;
};

export interface IConditionOperatorsManager extends TConditionOperatorsHandlerManager {

}
