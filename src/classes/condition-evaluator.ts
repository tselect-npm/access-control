import { ComparisonOperator } from '../constants/comparison-operator';
import { isIfExistsOperator } from '../utils/is-if-exists-operator';
import * as Lodash from 'lodash';
import { TPermissionOperatorCondition } from '../types/permission-operator-condition';
import { TEnvironment } from '../types/environment';
import { IConditionEvaluator } from '../interfaces/condition-evaluator';
import { TPermissionCondition } from '../types/permission-condition';
import { IConditionEvaluation } from '../interfaces/condition-evaluation';
import { TConditionEvaluationFactory } from '../types/condition-evaluation-factory';
import { MalformedConditionError } from './errors/malformed-condition';
import { IConditionOperationMatcher } from '../interfaces/condition-operation-matcher';
import { makeArray } from '@bluejay/utils';
import { TConditionOperationMatcherMap } from '../types/condition-operation-matcher-map';
import { TConditionEvaluatorConstructorOptions } from '../types/condition-evaluator-constructor-options';
import { ConditionEvaluation, TConditionEvaluationConstructorOptions } from './condition-evaluation';
import { StringConditionOperationMatcher } from './condition-operation-matchers/string';
import { DateConditionOperationMatcher } from './condition-operation-matchers/date';
import { NumberConditionOperationMatcher } from './condition-operation-matchers/number';
import { StringArrayConditionOperationMatcher } from './condition-operation-matchers/string-array';
import { HashAttributesConditionOperationMatcher } from './condition-operation-matchers/hash-attributes';
import { BoolConditionOperationMatcher } from './condition-operation-matchers/bool';
import { UnmappedConditionOperatorError } from './errors/unmapped-condition-operator';

const defaultConditionEvaluationFactory = (options: TConditionEvaluationConstructorOptions) => new ConditionEvaluation(options);

const stringConditionOperationMatcher = new StringConditionOperationMatcher();
const dateConditionOperationMatcher = new DateConditionOperationMatcher();
const numberConditionOperationMatcher = new NumberConditionOperationMatcher();
const stringArrayConditionOperationMatcher = new StringArrayConditionOperationMatcher();
const hashAttributesConditionOperationMatcher = new HashAttributesConditionOperationMatcher();
const boolConditionOperationMatcher = new BoolConditionOperationMatcher();

const defaultConditionOperationMatchersMap: TConditionOperationMatcherMap = new Map([
  // Strings
  [ComparisonOperator.STRING_EQUALS, stringConditionOperationMatcher as IConditionOperationMatcher],
  [ComparisonOperator.STRING_NOT_EQUALS, stringConditionOperationMatcher],
  [ComparisonOperator.STRING_EQUALS_IF_EXISTS, stringConditionOperationMatcher],
  [ComparisonOperator.STRING_NOT_EQUALS_IF_EXISTS, stringConditionOperationMatcher],

  // Numbers
  [ComparisonOperator.NUMBER_EQUALS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_NOT_EQUALS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_LOWER_THAN, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_LOWER_THAN_EQUALS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_GREATER_THAN, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_GREATER_THAN_EQUALS, numberConditionOperationMatcher],

  [ComparisonOperator.NUMBER_EQUALS_IF_EXISTS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_NOT_EQUALS_IF_EXISTS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_LOWER_THAN_IF_EXISTS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_LOWER_THAN_EQUALS_IF_EXISTS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_GREATER_THAN_IF_EXISTS, numberConditionOperationMatcher],
  [ComparisonOperator.NUMBER_GREATER_THAN_EQUALS_IF_EXISTS, numberConditionOperationMatcher],

  // Booleans
  [ComparisonOperator.BOOL, boolConditionOperationMatcher],

  [ComparisonOperator.BOOL_IF_EXISTS, boolConditionOperationMatcher],

  // Dates
  [ComparisonOperator.DATE_EQUALS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_NOT_EQUALS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_LOWER_THAN, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_LOWER_THAN_EQUALS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_GREATER_THAN, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_GREATER_THAN_EQUALS, dateConditionOperationMatcher],

  [ComparisonOperator.DATE_EQUALS_IF_EXISTS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_NOT_EQUALS_IF_EXISTS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_LOWER_THAN_IF_EXISTS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_LOWER_THAN_EQUALS_IF_EXISTS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_GREATER_THAN_IF_EXISTS, dateConditionOperationMatcher],
  [ComparisonOperator.DATE_GREATER_THAN_EQUALS_IF_EXISTS, dateConditionOperationMatcher],

  // Hash attributes
  [ComparisonOperator.HASH_ATTRIBUTES_EQUAL, hashAttributesConditionOperationMatcher],
  [ComparisonOperator.HASH_ATTRIBUTES_INCLUDE, hashAttributesConditionOperationMatcher],
  [ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE, hashAttributesConditionOperationMatcher],

  [ComparisonOperator.HASH_ATTRIBUTES_EQUAL_IF_EXISTS, hashAttributesConditionOperationMatcher],
  [ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_IF_EXISTS, hashAttributesConditionOperationMatcher],
  [ComparisonOperator.HASH_ATTRIBUTES_INCLUDE_AT_LEAST_ONE_IF_EXISTS, hashAttributesConditionOperationMatcher],

  // String arrays
  [ComparisonOperator.STRING_ARRAY_MEMBERS_EQUAL, stringArrayConditionOperationMatcher],
  [ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE, stringArrayConditionOperationMatcher],
  [ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE, stringArrayConditionOperationMatcher],

  [ComparisonOperator.STRING_ARRAY_MEMBERS_EQUAL_IF_EXISTS, stringArrayConditionOperationMatcher],
  [ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_IF_EXISTS, stringArrayConditionOperationMatcher],
  [ComparisonOperator.STRING_ARRAY_MEMBERS_INCLUDE_AT_LEAST_ONE_IF_EXISTS, stringArrayConditionOperationMatcher]
]);

export class ConditionEvaluator implements IConditionEvaluator {
  private conditionEvaluationFactory: TConditionEvaluationFactory;
  private conditionOperationMatchersMap: TConditionOperationMatcherMap;

  public constructor(options: TConditionEvaluatorConstructorOptions = {}) {
    this.conditionEvaluationFactory = options.conditionEvaluationFactory || defaultConditionEvaluationFactory;
    this.conditionOperationMatchersMap = options.conditionOperationMatchersMap || defaultConditionOperationMatchersMap;
  }

  public evaluate(condition: TPermissionCondition | null | undefined, environment: TEnvironment): IConditionEvaluation {
    // No condition means no evaluation
    if (!condition) {
      return this.conditionEvaluationFactory({ result: true });
    }

    // Malformed condition
    if (!Lodash.isPlainObject(condition)) {
      throw new MalformedConditionError(condition);
    }

    const operators = Object.keys(condition);

    for (const operator of operators) {
      const evaluation = this.evaluateForOperator(operator as ComparisonOperator, condition[operator], environment);
      if (evaluation.failed()) {
        return evaluation;
      }
    }

    return this.conditionEvaluationFactory({ result: true });;
  }

  protected evaluateForOperator(operator: ComparisonOperator, operatorCondition: TPermissionOperatorCondition, environment: TEnvironment): IConditionEvaluation {
    const canSkip = isIfExistsOperator(operator as any);
    const attributeNames = Object.keys(operatorCondition);

    for (const attributeName of attributeNames) {
      const envValue = Lodash.get(environment, attributeName);
      if (Lodash.isUndefined(envValue)) {
        if (canSkip) {
          break;
        } else {
          return this.conditionEvaluationFactory({ result: false });
        }
      } else {
        const matcher = this.getConditionOperationMatcherForOperator(operator);
        const matches = matcher.matches(operator, makeArray(operatorCondition[attributeName]), Lodash.get(environment, attributeName));
        if (!matches) {
          return this.conditionEvaluationFactory({ result: false });
        }
      }
    }

    // If not match failed, then the evaluation succeeded
    return this.conditionEvaluationFactory({ result: true });
  }

  protected getConditionOperationMatcherForOperator(operator: ComparisonOperator): IConditionOperationMatcher {
    const matcher = this.conditionOperationMatchersMap.get(operator);

    if (!matcher) {
      throw new UnmappedConditionOperatorError(operator);
    }

    return matcher;
  }
}