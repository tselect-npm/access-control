import * as Lodash from 'lodash';
import * as assert from 'assert';
import { AccessControl } from '../src/classes/access-control';
import { ConditionModifiersManager } from '../src/classes/condition-modifiers-manager';
import { MemoryStore } from '../src/classes/memory-store';
import { Subject } from '../src/classes/subject';
import { PermissionEffect } from '../src/constants/permission-effect';

/**
 * Custom manager that counts "null" as non existing value.
 */
class CustomConditionModifierManager extends ConditionModifiersManager {
  protected exists(value: any): boolean {
    return !Lodash.isUndefined(value) && !Lodash.isNull(value);
  }
}

const store = new MemoryStore();
const conditionModifierHandlerManager = new CustomConditionModifierManager();

const accessControl = new AccessControl({
  store,
  authorizerOptions: {
    conditionEvaluatorOptions: {
      conditionModifierHandlerManager // <- Pass it as an option
    }
  }
});


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// USAGE
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

class UserSubject extends Subject<{ id: number; }> {
  public getPrincipal(): string | number {
    return this.get('id');
  }
}

const user = new UserSubject({ id: 1 });

store
  .addPermissionToRole('user', {
    id: 'PermID',
    effect: PermissionEffect.ALLOW,
    resource: 'bar',
    action: 'do',
    condition: {
      stringEquals: {
        forAllValuesIfExists: {
          foo: ['bar', 'baz', 'boo']
        }
      }
    }
  })
  .addRoleToSubject(user, 'user');


Promise.resolve().then(async () => {
  const okUndefined = await accessControl.authorize(user, 'bar', 'do', {
    foo: undefined
  });

  assert(okUndefined.isAllowed(), 'Undefined should pass');

  const okNull = await accessControl.authorize(user, 'bar', 'do', {
    foo: null
  });

  assert(okNull.isAllowed(), 'Null should pass');
}).catch(err => {
  console.error(err);
  process.exit(1);
});


