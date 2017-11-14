import config from '../config/condition-operators';

const SUFFIXES_WILD_CARD = '*';

function supportsSuffix(list: string[] | '*', value: string): boolean {
  return list === SUFFIXES_WILD_CARD || list.includes(value);
}

function createEnumString(result: { [key: string]: string }, name: string): string {
  const lines = [];

  lines.push(`export enum ${name} {`);

  const keys = Object.keys(result);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    lines.push(`  ${key} = '${result[key]}'${i === len - 1 ? '' : ','}`);
  }

  lines.push(`}`);

  return lines.join('\n');
}

(function generateConditionOperators() {
  const result = {};
  const baseResult = {};

  for (const enumBaseKey in config.keys) {
    const keyConfig = config.keys[enumBaseKey];
    const enumBaseValue = keyConfig.value;

    result[enumBaseKey] = enumBaseValue;
    baseResult[enumBaseKey] = enumBaseValue;

    if (supportsSuffix(keyConfig.supportsSuffixes, 'IF_EXISTS')) {
      result[enumBaseKey + '_IF_EXISTS'] = enumBaseValue + '_ifExists';
    }

    if (supportsSuffix(keyConfig.supportsSuffixes, 'IF_EXISTS_FOR_ALL_VALUES')) {
      result[enumBaseKey + '_IF_EXISTS_FOR_ALL_VALUES'] = enumBaseValue + '_ifExists_forAllValues';
    }

    if (supportsSuffix(keyConfig.supportsSuffixes, 'IF_EXISTS_FOR_ANY_VALUE')) {
      result[enumBaseKey + '_IF_EXISTS_FOR_ANY_VALUE'] = enumBaseValue + '_ifExists_forAnyValue';
    }

    if (supportsSuffix(keyConfig.supportsSuffixes, 'FOR_ANY_VALUE')) {
      result[enumBaseKey + '_FOR_ANY_VALUE'] = enumBaseValue + '_forAnyValue';
    }

    if (supportsSuffix(keyConfig.supportsSuffixes, 'FOR_ALL_VALUES')) {
      result[enumBaseKey + '_FOR_ALL_VALUES'] = enumBaseValue + '_forAllValues';
    }
  }

  console.log(createEnumString(result, config.enumName));
  console.log('\n\n\n\n');
  console.log(createEnumString(baseResult, config.baseEnumName));
})();