export default {
  enumName: 'ConditionOperator',
  baseEnumName: 'BaseConditionOperator',
  SEPARATOR: '_',
  keys: {
    STRING_EQUALS: { value: 'stringEquals', supportsSuffixes: '*' },
    STRING_NOT_EQUALS: { value: 'stringNotEquals', supportsSuffixes: '*' },

    NUMBER_EQUALS: { value: 'numberEquals', supportsSuffixes: '*' },
    NUMBER_NOT_EQUALS: { value: 'numberNotEquals', supportsSuffixes: '*' },
    NUMBER_GREATER_THAN: { value: 'numberGreaterThan', supportsSuffixes: '*' },
    NUMBER_GREATER_THAN_EQUALS: { value: 'numberGreaterThanEquals', supportsSuffixes: '*' },
    NUMBER_LOWER_THAN: { value: 'numberLowerThan', supportsSuffixes: '*' },
    NUMBER_LOWER_THAN_EQUALS: { value: 'numberLowerThanEquals', supportsSuffixes: '*' },

    BOOL: { value: 'bool', supportsSuffixes: ['IF_EXISTS'] },

    DATE_EQUALS: { value: 'dateEquals', supportsSuffixes: '*' },
    DATE_NOT_EQUALS: { value: 'dateNotEquals', supportsSuffixes: '*' },
    DATE_GREATER_THAN: { value: 'dateGreaterThan', supportsSuffixes: '*' },
    DATE_GREATER_THAN_EQUALS: { value: 'dateGreaterThanEquals', supportsSuffixes: '*' },
    DATE_LOWER_THAN: { value: 'dateLowerThan', supportsSuffixes: '*' },
    DATE_LOWER_THAN_EQUALS: { value: 'dateLowerThanEquals', supportsSuffixes: '*' }
  }
};