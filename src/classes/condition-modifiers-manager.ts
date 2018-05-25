import * as Lodash from 'lodash';
import { IConditionModifiersManager } from '../interfaces/condition-modifiers-manager';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { TConditionValue } from '../types/condition-value';

export class ConditionModifiersManager implements IConditionModifiersManager {
  public forAllValues(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    if (!environmentValues.length) {
      return true;
    }

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
    const existingEnvironmentValues = environmentValues.reduce((acc, currentValue) => {
      if (this.exists(currentValue)) {
        acc.push(currentValue);
      }

      return acc;
    }, []);

    return this.forAllValues(handler, conditionValues, existingEnvironmentValues);
  }

  public forAnyValue(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    if (!environmentValues.length) {
      return false;
    }

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
    const existingEnvironmentValues = environmentValues.reduce((acc, currentValue) => {
      if (this.exists(currentValue)) {
        acc.push(currentValue);
      }

      return acc;
    }, []);

    return this.forAnyValue(handler, conditionValues, existingEnvironmentValues);
  }

  public simpleValue(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    if (!environmentValues.length) {
      return false;
    }

    const environmentValue = environmentValues[0];

    for (const conditionValue of conditionValues) {
      if (handler(conditionValue, environmentValue)) {
        return true;
      }
    }

    return false;
  }

  public simpleValueIfExists(handler: TConditionOperatorHandler, conditionValues: TConditionValue[], environmentValues: any[]): boolean {
    const existingEnvironmentValues = environmentValues.reduce((acc, currentValue) => {
      if (this.exists(currentValue)) {
        acc.push(currentValue);
      }

      return acc;
    }, []);

    if (!existingEnvironmentValues.length) {
      return true;
    }

    return this.simpleValue(handler, conditionValues, existingEnvironmentValues);
  }

  protected exists(value: any): boolean {
    return !Lodash.isUndefined(value);
  }
}