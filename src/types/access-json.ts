import { DecisionCode } from '../constants/decision-code';
import { TPermission } from './permission';
import { TConditionEvaluationJSON } from './condition-evaluation-json';

export type TAccessJSON = {
  allowed: boolean;
  decisionCode: DecisionCode;
  decisivePermission: TPermission | null;
  consideredPermissions: TPermission[];
  decisiveConditionEvaluation: TConditionEvaluationJSON | null;
};