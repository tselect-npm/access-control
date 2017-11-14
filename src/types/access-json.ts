import { DecisionCode } from '../constants/decision-code';
import { TAccessJournal } from './access-journal';
import { TEnvironment } from './environment';
import { TPermission } from './permission';

export type TAccessJSON = {
  allowed: boolean;
  decisionCode: DecisionCode;
  consideredPermissions: TPermission[];
  environment: TEnvironment | null;
  decisivePermission: TPermission | null;

  journal: TAccessJournal;
};