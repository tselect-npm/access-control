import { DecisionCode } from '../constants/decision-code';
import { TAccessJournal } from './access-journal';
import { TAction } from './action';
import { TEnvironment } from './environment';
import { TPermission } from './permission';
import { TResource } from './resource';

export type TAccessJSON = {
  allowed: boolean;
  resource: TResource;
  action: TAction;
  decisionCode: DecisionCode;
  consideredPermissions: TPermission[];
  environment: TEnvironment | null;
  decisivePermission: TPermission | null;
  journal: TAccessJournal;
};
