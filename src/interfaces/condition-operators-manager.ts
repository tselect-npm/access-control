import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { ConditionOperator } from '../constants/condition-operator';

type TConditionOperatorsHandlerManager = {
  [operator in ConditionOperator]: TConditionOperatorHandler;
}

export interface IConditionOperatorsManager extends TConditionOperatorsHandlerManager {

}