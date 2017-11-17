import { IConditionModifiersManager } from '../interfaces/condition-modifiers-manager';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { TConditionValue } from '../types/condition-value';
import * as Lodash from 'lodash';

export class ConditionModifiersManager implements IConditionModifiersManager {
  public forAllValues(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    for (const environmentValue of environmentValues) {
      let matchesOne = false;

      for (const conditionValue of conditionValues) {
        if (handler(conditionValue, environmentValue)) {
          matchesOne = true;
          break;
        }
      }

      if (!matchesOne) {
        return false;
      }
    }

    return true;
  }

  public forAllValuesIfExists(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    for (const environmentValue of environmentValues) {
      if (!this.exists(environmentValue)) {
        continue;
      }
      for (const conditionValue of conditionValues) {
        if (!handler(conditionValue, environmentValue)) {
          return false;
        }
      }
    }
    return true;
  }

  public forAnyValue(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    for (const environmentValue of environmentValues) {
      for (const conditionValue of conditionValues) {
        if (handler(conditionValue, environmentValue)) {
          return true;
        }
      }
    }
    return false;
  }

  public forAnyValueIfExists(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    let oneExists = false;
    for (const environmentValue of environmentValues) {
      if (!this.exists(environmentValue)) {
        continue;
      } else {
        oneExists = true;
      }
      for (const conditionValue of conditionValues) {
        if (handler(conditionValue, environmentValue)) {
          return true;
        }
      }
    }
    return !oneExists;
  }

  public simpleValue(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    const environmentValue = environmentValues[0];
    for (const conditionValue of conditionValues) {
      if (handler(conditionValue, environmentValue)) {
        return true;
      }
    }
    return false;
  }

  public simpleValueIfExists(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    const environmentValue = environmentValues[0];
    if (!this.exists(environmentValue)) {
      return true;
    }
    return this.simpleValue(handler, conditionValues, environmentValues);
  }

  protected exists(value: any): boolean {
    return !Lodash.isUndefined(value);
  }
}