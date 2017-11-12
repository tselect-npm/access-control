export enum ComparisonOperator {
  // Strings
  STRING_EQUALS = 'stringEquals',
  STRING_NOT_EQUALS = 'stringNotEquals',

  STRING_EQUALS_IF_EXISTS = 'stringEqualsIfExists',
  STRING_NOT_EQUALS_IF_EXISTS = 'stringNotEqualsIfExists',


  // Numbers
  NUMBER_EQUALS = 'numberEquals',
  NUMBER_NOT_EQUALS = 'numberNotEquals',
  NUMBER_LOWER_THAN = 'numberLowerThan',
  NUMBER_LOWER_THAN_EQUALS = 'numberLowerThanEquals',
  NUMBER_GREATER_THAN = 'numberGreaterThan',
  NUMBER_GREATER_THAN_EQUALS = 'numberGreaterThanEquals',

  NUMBER_EQUALS_IF_EXISTS = 'numberEqualsIfExists',
  NUMBER_NOT_EQUALS_IF_EXISTS = 'numberNotEqualsIfExists',
  NUMBER_LOWER_THAN_IF_EXISTS = 'numberLowerThanIfExists',
  NUMBER_LOWER_THAN_EQUALS_IF_EXISTS = 'numberLowerThanEqualsIfExists',
  NUMBER_GREATER_THAN_IF_EXISTS = 'numberGreaterThanIfExists',
  NUMBER_GREATER_THAN_EQUALS_IF_EXISTS = 'numberGreaterThanEqualsIfExists',


  // Booleans
  BOOL = 'bool',

  BOOL_IF_EXISTS = 'boolIfExists',


  // Dates
  DATE_EQUALS = 'dateEquals',
  DATE_NOT_EQUALS = 'dateNotEquals',
  DATE_LOWER_THAN = 'dateLowerThan',
  DATE_LOWER_THAN_EQUALS = 'dateLowerThanEquals',
  DATE_GREATER_THAN = 'dateGreaterThan',
  DATE_GREATER_THAN_EQUALS = 'dateGreaterThanEquals',

  DATE_EQUALS_IF_EXISTS = 'dateEqualsIfExists',
  DATE_NOT_EQUALS_IF_EXISTS = 'dateNotEqualsIfExists',
  DATE_LOWER_THAN_IF_EXISTS = 'dateLowerThanIfExists',
  DATE_LOWER_THAN_EQUALS_IF_EXISTS = 'dateLowerThanEqualsIfExists',
  DATE_GREATER_THAN_IF_EXISTS = 'dateGreaterThanIfExists',
  DATE_GREATER_THAN_EQUALS_IF_EXISTS = 'dateGreaterThanEqualsIfExists',


  // Hash attributes
  HASH_ATTRIBUTES_EQUAL = 'hashAttributesEqual',
  HASH_ATTRIBUTES_INCLUDE = 'hashAttributesInclude',
  HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE = 'hashAttributesIncludeAtLeastOne',

  HASH_ATTRIBUTES_EQUAL_IF_EXISTS = 'hashAttributesEqualIfExists',
  HASH_ATTRIBUTES_INCLUDE_IF_EXISTS = 'hashAttributesIncludeIfExists',
  HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE_IF_EXISTS = 'hashAttributesIncludeAtLeastOneIfExists',


  // String arrays
  STRING_ARRAY_MEMBERS_EQUAL = 'stringArrayMembersEqual',
  STRING_ARRAY_MEMBERS_INCLUDE = 'stringArrayMembersInclude',
  STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE = 'stringArrayMembersIncludeAtLeastOne',

  STRING_ARRAY_MEMBERS_EQUAL_IF_EXISTS = 'stringArrayMembersEqualIfExists',
  STRING_ARRAY_MEMBERS_INCLUDE_IF_EXISTS = 'stringArrayMembersIncludeIfExists',
  STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE_IF_EXISTS = 'stringArrayMembersIncludeAtLeastOneIfExists'
}