export enum ConditionOperator {
  STRING_EQUALS = 'stringEquals',
  STRING_NOT_EQUALS = 'stringNotEquals',
  STRING_IMPLIES = 'stringImplies',
  STRING_NOT_IMPLIES = 'stringNotImplies',

  NUMBER_EQUALS = 'numberEquals',
  NUMBER_NOT_EQUALS = 'numberNotEquals',
  NUMBER_GREATER_THAN = 'numberGreaterThan',
  NUMBER_GREATER_THAN_EQUALS = 'numberGreaterThanEquals',
  NUMBER_LOWER_THAN = 'numberLowerThan',
  NUMBER_LOWER_THAN_EQUALS = 'numberLowerThanEquals',

  BOOL = 'bool',

  NULL = 'null',

  DATE_EQUALS = 'dateEquals',
  DATE_NOT_EQUALS = 'dateNotEquals',
  DATE_GREATER_THAN = 'dateGreaterThan',
  DATE_GREATER_THAN_EQUALS = 'dateGreaterThanEquals',
  DATE_LOWER_THAN = 'dateLowerThan',
  DATE_LOWER_THAN_EQUALS = 'dateLowerThanEquals'
}