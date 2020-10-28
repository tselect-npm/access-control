import { cloneDeep, makeArray } from '@bluejay/utils';
import * as Lodash from 'lodash';
import { BANG } from '../constants/bang';
import { PROPERTY_SEPARATOR } from '../constants/property-separator';
import { UNWIND } from '../constants/unwind';
import { WILD_CARD } from '../constants/wild-card';

export abstract class Keys {

  private static remove(obj: {}, pattern: string) {
    if (!pattern) {
      return obj;
    }

    const parts = pattern.split(PROPERTY_SEPARATOR);
    const count = parts.length;
    const leadingPart = parts[0];
    const nextPart = parts[1];
    const isNextPartUnwind = this.isUnwind(nextPart);
    const isLast = isNextPartUnwind ? count === 2 : count === 1;

    if (isLast) {
      delete obj[leadingPart];
      return obj;
    }

    if (isNextPartUnwind) {
      if (Array.isArray(obj[leadingPart])) {
        let emptied = 0;
        obj[leadingPart].forEach((element: any) => {
          this.remove(element, parts.slice(2).join(PROPERTY_SEPARATOR));
          if (Lodash.isEmpty(element)) {
            emptied++;
          }
        });
        if (emptied === obj[leadingPart].length) {
          delete obj[leadingPart];
        }
      } else {
        delete obj[leadingPart];
      }

      return obj;
    }

    if (Lodash.isPlainObject(obj[leadingPart])) {
      this.remove(obj[leadingPart], parts.slice(1).join(PROPERTY_SEPARATOR));
      if (Lodash.isEmpty(obj[leadingPart])) {
        delete obj[leadingPart];
      }
      return obj;
    } else {
      delete obj[leadingPart];
    }

    return obj;
  }

  private static isInvalidPattern(pattern: string) {
    this.unNegate(pattern);

    if (this.isWildCard(pattern)) {
      return false;
    }

    return pattern.startsWith(WILD_CARD) ||
      pattern.startsWith(UNWIND) ||
      pattern.startsWith(PROPERTY_SEPARATOR);
  }

  private static isNegated(pattern: string) {
    return pattern.charAt(0) === BANG;
  }

  private static unNegate(pattern: string) {
    if (this.isNegated(pattern)) {
      return pattern.slice(1);
    }
    return pattern;
  }

  private static isUnwind(pattern: string) {
    return pattern === UNWIND;
  }

  private static isWildCard(pattern: string) {
    return pattern === WILD_CARD;
  }

  private static escapeForRegExp(str: string): string {
    return str
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/\\\*$/, '\.*'); // Trailing wild card accepts anything
  }

  private static toPath(parts: string[], prefix = '') {
    return this.prefix(parts.join(PROPERTY_SEPARATOR), prefix);
  }

  private static prefix(path: string, prefix: string) {
    return prefix ? prefix + PROPERTY_SEPARATOR + path : path;
  }
  public static getValues<T = any>(data: {} | any[], path: string): T[] {
    if (Array.isArray(data)) {
      return Lodash.flattenDeep(data.map(element => this.getValues(element, path)));
    }

    const parts = path.split(PROPERTY_SEPARATOR);
    const leadingPart = parts[0];
    const nextPart = parts[1];
    const isNextUnwind = this.isUnwind(nextPart);
    const isLast = isNextUnwind ? parts.length === 2 : parts.length === 1;

    if (Lodash.isNil(data)) {
      return [undefined] as any;
    }

    if (isLast) {
      return Lodash.flattenDeep([data[leadingPart]]);
    }

    if (isNextUnwind) {
      if (Array.isArray(data[leadingPart])) {
        return Lodash.flattenDeep(data[leadingPart].map((element: any) => {
          return this.getValues(element, parts.slice(2).join(PROPERTY_SEPARATOR));
        }));
      } else {
        return [undefined] as any;
      }
    } else {
      return this.getValues(data[leadingPart], parts.slice(1).join(PROPERTY_SEPARATOR));
    }
  }

  public static filter<T extends {}>(data: T[], matchingPatterns: string | string[]): Partial<T>[];
  public static filter<T extends {}>(data: T, matchingPatterns: string | string[]): Partial<T>;
  public static filter<T extends ({} | {}[])>(data: T|T[], matchingPatterns: string | string[]): Partial<T> | Partial<T>[] {
    if (Array.isArray(data)) {
      return data.map(element => this.filter(element, matchingPatterns)) as T;
    }

    matchingPatterns = makeArray(matchingPatterns);

    if (!matchingPatterns.length) {
      return {};
    }

    const patterns: string[] = [];
    let someNegated = false;
    let isBlackList = true;

    const registerPattern = (pattern: string) => {
      if (this.isInvalidPattern(pattern)) {
        throw new Error(`Invalid pattern: "${pattern}".`);
      }
      patterns.push(pattern);
    };

    for (const pattern of matchingPatterns) {
      if (this.isNegated(pattern)) {
        someNegated = true;
        registerPattern(this.unNegate(pattern));
      } else {
        isBlackList = false;
        registerPattern(pattern);
      }

      if (someNegated && !isBlackList) {
        throw new Error(`Cannot use both black and white list modes at the same time.`);
      }
    }

    if (!Lodash.isPlainObject(data)) {
      return data;
    }

    const result = cloneDeep(data);
    const objKeys = this.list(data);

    for (const key of objKeys) {
      let shouldRemove = true;

      for (const pattern of patterns) {
        if (this.implies(pattern, key)) {
          shouldRemove = isBlackList;
          break;
        } else if (isBlackList) {
          shouldRemove = false;
        }
      }

      if (shouldRemove) {
        this.remove(result, key);
      }
    }

    return result;
  }

  public static list(obj: {}, prefix = ''): string[] {
    const result: string[] = [];

    for (const key of Object.getOwnPropertyNames(obj)) {
      const objValue = obj[key];

      if (Array.isArray(objValue)) {
        if (Lodash.isPlainObject(obj[key][0])) {
          const allKeys: Set<string> = obj[key].reduce((set: Set<string>, element: {}) => {
            const elementKeys = this.list(element);
            for (const elementKey of elementKeys) {
              set.add(elementKey);
            }
            return set;
          }, new Set());
          for (const subKey of Array.from(allKeys)) {
            result.push(this.toPath([key, UNWIND, subKey], prefix));
          }
        } else {
          result.push(this.toPath([key, UNWIND], prefix));
        }

        continue;
      }

      if (Lodash.isPlainObject(objValue)) {
        result.push(...this.list(obj[key], this.toPath([key], prefix)));
        continue;
      }

      result.push(this.toPath([key], prefix));
    }
    return result;
  }

  public static implies(pattern: string, key: string) {
    const reg = new RegExp('^' + this.escapeForRegExp(pattern) + (pattern.endsWith(WILD_CARD) ? '' : '(\\..+)?$'));
    return this.isWildCard(pattern) || !!reg.exec(key);
  }
}
