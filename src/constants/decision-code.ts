export enum DecisionCode {
  NOT_EVALUATED = 'not_evaluated',
  NO_RELEVANT_PERMISSION_FOUND = 'no_relevant_permission_found',
  EXPLICITLY_DENIED = 'explicitly_denied',
  EXPLICITLY_ALLOWED = 'explicitly_allowed',
  EXPLICIT_ALLOW_CONDITION_FAILED = 'explicit_allow_condition_failed',
  NO_EXPLICIT_ALLOW_PERMISSION_FOUND = 'no_explicit_allow_permission_found'
}