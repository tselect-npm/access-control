import { DecisionCode } from '../constants/decision-code';
import { TAccessJournal, TAccessJournalEntry } from '../types/access-journal';
import { TAccessJSON } from '../types/access-json';
import { TAttributeName } from '../types/attribute-name';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';
import { TWildCard } from '../types/wild-card';

export interface IAccess {
  isAllowed(): boolean;
  isDenied(): boolean;
  allow(decisivePermission: TPermission): this;
  deny(code: DecisionCode, decisivePermission?: TPermission): this;
  getEnvironment(): TEnvironment | null | undefined;
  getDecisivePermission(): TPermission | null;
  getReturnedAttributes(): TAttributeName[] | TWildCard | undefined;
  getCustomData(): Object | undefined;
  getDecisionCode(): DecisionCode;
  isEvaluated(): boolean;
  getConsideredPermissions(): TPermission[];
  getJournal(): TAccessJournal;
  logJournalEntry(entry: TAccessJournalEntry): this;
  toJSON(): TAccessJSON;
}
