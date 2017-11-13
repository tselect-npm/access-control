export enum DecisionCode {
  NOT_EVALUATED = 'not_evaluated',
  NO_RELEVANT_PERMISSIONS = 'no_relevant_permissions',
  EXPLICIT_DENY = 'explicit_deny',
  EXPLICIT_ALLOW = 'explicit_allow',
  NO_ALLOW_PERMISSIONS = 'no_allow_permissions',
  EXPLICIT_ALLOW_FAILED_CONDITION = 'explicit_allow_failed_condition'
}