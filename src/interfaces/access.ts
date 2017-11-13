import { TPermission } from '../types/permission';
import { DecisionCode } from '../constants/decision-code';
import { IConditionEvaluation } from './condition-evaluation';
import { TAccessJSON } from '../types/access-json';

export interface IAccess {
  isAllowed(): boolean;
  isDenied(): boolean;
  allow(): this;
  deny(): this;
  setDecisivePermission(permission: TPermission): this;
  getDecisivePermission(): TPermission | null;
  setDecisionCode(code: DecisionCode): this;
  getDecisionCode(): DecisionCode;
  setConsideredPermissions(permissions: TPermission[]): this;
  getConsideredPermissions(): TPermission[];
  setDecisiveConditionEvaluation(conditionEvaluation: IConditionEvaluation): this;
  getDecisiveConditionEvaluation(): IConditionEvaluation | null;
  toJSON(): TAccessJSON;
}