import { IConditionModifierHandlerManager } from '../interfaces/condition-modifier-handlers-manager';
import { TConditionOperatorHandler } from '../types/condition-operator-handler';
import { TComparisonValue } from '../types/comparison-value';
import * as Lodash from 'lodash';

export class ConditionModifierHandlersManager implements IConditionModifierHandlerManager {
  public forAllValues(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    for (const value of conditionValues) {
      if (!handler(value, environmentValue)) {
        return false;
      }
    }

    return true;
  }

  public forAllValuesIfExists(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    if (!this.exists(environmentValue)) {
      return true;
    }

    return this.forAllValues(handler, conditionValues, environmentValue);
  }

  public forAnyValue(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    for (const value of conditionValues) {
      if (handler(value, environmentValue)) {
        return true;
      }
    }

    return false;
  }

  public forAnyValueIfExists(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    if (!this.exists(environmentValue)) {
      return true;
    }

    return this.forAnyValue(handler, conditionValues, environmentValue);
  }

  public exactValue(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    return handler(conditionValues[0], environmentValue);
  }

  public exactValueIfExists(handler: TConditionOperatorHandler, conditionValues: TComparisonValue[], environmentValue: any): boolean {
    if (!this.exists(environmentValue)) {
      return true;
    }
    return this.exactValue(handler, conditionValues, environmentValue);
  }

  protected exists(value: any): boolean {
    return !Lodash.isUndefined(value);
  }
}