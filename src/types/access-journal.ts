import { TConditionEvaluationJSON } from './condition-evaluation-json';
import { TPermissionId } from './permission-id';

export type TAccessJournalEntry = {
  permissionId: TPermissionId;
  conditionEvaluation: TConditionEvaluationJSON;
};
export type TAccessJournal = TAccessJournalEntry[];
