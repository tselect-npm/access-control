export enum DecisionCode {
  NOT_EVALUATED = 'not_evaluated',
  NO_RELEVANT_PERMISSION_FOUND = 'no_relevant_permission_found',
  EXPLICITLY_DENIED = 'explicitly_denied',
  EXPLICITLY_ALLOWED = 'explicitly_allowed',
  NO_ALLOW_PERMISSION_FOUND = 'no_allow_permission_found',
  EXPLICIT_ALLOW_FAILED_CONDITION = 'explicit_allow_failed_condition',
  PERMISSION_CONDITION_ERRORED = 'permission_condition_errored'
}