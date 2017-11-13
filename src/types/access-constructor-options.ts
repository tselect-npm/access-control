import { DecisionCode } from '../constants/decision-code';
import { TPermission } from './permission';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';

export type TAccessConstructorOptions = {
  allowed?: boolean;
  decisionCode?: DecisionCode;
  consideredPermissions?: TPermission[];
  decisivePermission?: TPermission;
  decisiveConditionEvaluation?: IConditionEvaluation | null;
};