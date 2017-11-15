import { TPermission } from '../types/permission';
import { DecisionCode } from '../constants/decision-code';
import { TAccessJSON } from '../types/access-json';
import { TEnvironment } from '../types/environment';
import { TAccessJournal, TAccessJournalEntry } from '../types/access-journal';

export interface IAccess {
  isAllowed(): boolean;
  isDenied(): boolean;
  allow(decisivePermission: TPermission): this;
  deny(code: DecisionCode, decisivePermission?: TPermission): this;
  getEnvironment(): TEnvironment | null | undefined;
  getDecisivePermission(): TPermission | null;
  getDecisionCode(): DecisionCode;
  isEvaluated(): boolean;
  getConsideredPermissions(): TPermission[];
  getJournal(): TAccessJournal;
  logJournalEntry(entry: TAccessJournalEntry): this;
  toJSON(): TAccessJSON;
}