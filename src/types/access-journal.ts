import { TPermission } from './permission';
import { TConditionEvaluationJSON } from './condition-evaluation-json';

export type TAccessJournalEntry = {
  permission: TPermission;
  conditionEvaluation: TConditionEvaluationJSON;
}
export type TAccessJournal = TAccessJournalEntry[];