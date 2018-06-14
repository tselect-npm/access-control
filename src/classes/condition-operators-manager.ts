import { IConditionOperatorsManager } from '../interfaces/condition-operators-manager';
import * as Lodash from 'lodash';
import { Keys } from '../utils/keys';
import { InvalidConditionValueError } from './errors/invalid-condition-value';
import { TConstructible } from '@bluejay/utils';
import { InvalidEnvironmentValueError } from './errors/invalid-enviroment-value';
import * as moment from 'moment';
import { Moment } from 'moment';

const iso8601Reg = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

export class ConditionOperatorsManager implements IConditionOperatorsManager {
  /*********************
   * String
   ********************/
  public stringEquals(conditionValue: string, environmentValue: any): boolean {
    if (!this.isString(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }

    return environmentValue === conditionValue;
  }

  public stringNotEquals(conditionValue: string, environmentValue: any): boolean {
    return !this.stringEquals(conditionValue, environmentValue);
  }

  public stringImplies(conditionValue: string, environmentValue: any): boolean {
    if (!this.isString(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }

    return Keys.implies(conditionValue, environmentValue);
  }

  public stringNotImplies(conditionValue: string, environmentValue: any): boolean {
    return !this.stringImplies(conditionValue, environmentValue);
  }

  /*********************
   * Number
   ********************/
  public numberEquals(conditionValue: string, environmentValue: any): boolean {
    if (!this.isNumber(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }
    return environmentValue === this.castToNumber(conditionValue, InvalidConditionValueError);
  }

  public numberNotEquals(conditionValue: string, environmentValue: any): boolean {
    return !this.numberEquals(conditionValue, environmentValue);
  }

  public numberGreaterThan(conditionValue: string, environmentValue: any): boolean {
    if (!this.isNumber(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }

    return this.castToNumber(conditionValue, InvalidConditionValueError) < environmentValue;
  }

  public numberGreaterThanEquals(conditionValue: string, environmentValue: any): boolean {
    return this.numberEquals(conditionValue, environmentValue) || this.numberGreaterThan(conditionValue, environmentValue);
  }

  public numberLowerThan(conditionValue: string, environmentValue: any): boolean {
    if (!this.isNumber(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }

    return this.castToNumber(conditionValue, InvalidConditionValueError) > environmentValue;
  }

  public numberLowerThanEquals(conditionValue: string, environmentValue: any): boolean {
    return this.numberEquals(conditionValue, environmentValue) || this.numberLowerThan(conditionValue, environmentValue);
  }

  /*********************
   * Boolean
   ********************/
  public bool(conditionValue: string, environmentValue: any): boolean {
    if (!this.isBoolean(environmentValue)) {
      throw new InvalidEnvironmentValueError(environmentValue);
    }
    return this.castToBoolean(conditionValue, InvalidConditionValueError) === environmentValue;
  }

  /*********************
   * Date
   ********************/
  public dateEquals(conditionValue: string, environmentValue: any): boolean {
    const conditionDate = this.castToMoment(conditionValue, InvalidConditionValueError);
    const environmentDate = this.castToMoment(environmentValue, InvalidEnvironmentValueError);
    return conditionDate.isSame(environmentDate);
  }

  public dateNotEquals(conditionValue: string, environmentValue: any): boolean {
    return !this.dateEquals(conditionValue, environmentValue);
  }

  public dateGreaterThan(conditionValue: string, environmentValue: any): boolean {
    const conditionDate = this.castToMoment(conditionValue, InvalidConditionValueError);
    const environmentDate = this.castToMoment(environmentValue, InvalidEnvironmentValueError);
    return conditionDate.isBefore(environmentDate);
  }

  public dateGreaterThanEquals(conditionValue: string, environmentValue: any): boolean {
    return this.dateEquals(conditionValue, environmentValue) || this.dateGreaterThan(conditionValue, environmentValue);
  }

  public dateLowerThan(conditionValue: string, environmentValue: any): boolean {
    const conditionDate = this.castToMoment(conditionValue, InvalidConditionValueError);
    const environmentDate = this.castToMoment(environmentValue, InvalidEnvironmentValueError);
    return conditionDate.isAfter(environmentDate);
  }

  public dateLowerThanEquals(conditionValue: string, environmentValue: any): boolean {
    return this.dateEquals(conditionValue, environmentValue) || this.dateLowerThan(conditionValue, environmentValue);
  }



  /*********************
   * Utilities
   ********************/
  protected castToNumber(value: any, errorCtor: TConstructible<InvalidConditionValueError | InvalidEnvironmentValueError>): number {
    const num = parseFloat(value);

    const isValid = this.isNumber(num) && value.toString() === num.toString(10);

    if (!isValid) {
      throw new errorCtor(value);
    }

    return num;
  }

  protected castToBoolean(value: any, errorCtor: TConstructible<InvalidConditionValueError | InvalidEnvironmentValueError>): boolean {
    const bool = value === 'true' ? true : value === 'false' ? false : null;

    if (bool === null) {
      throw new errorCtor(value);
    }

    return bool;
  }

  protected castToMoment(value: any, errorCtor: TConstructible<InvalidConditionValueError | InvalidEnvironmentValueError>): Moment {
    if (!this.isDateLike(value)) {
      throw new errorCtor(value);
    }

    const mom = moment(value);

    if (!mom.isValid()) {
      throw new errorCtor(value);
    }

    return mom;
  }

  protected isNumber(value: any): value is number {
    return !isNaN(value) && Lodash.isNumber(value);
  }

  protected isString(value: any): value is string {
    return Lodash.isString(value);
  }

  protected isBoolean(value: any): value is boolean {
    return Lodash.isBoolean(value);
  }

  protected isDateLike(value: any): boolean {
    return this.isNumber(value) && parseInt(value as any, 10) === value || // Integer/timestamp
      moment.isDate(value) || // Native date
      this.isString(value) && iso8601Reg.test(value); // ISO string
  }
}