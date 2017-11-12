import { PermissionEffect } from '../constants/permission-effect';
import { RESOURCE_PARTS_SEPARATOR } from '../constants/resource-parts-separator';
import { blanksToWildCards } from '../utils/blanks-to-wild-cards';
import { implies } from '../utils/implies';
import { TResource } from '../types/resource';
import { TAction } from '../types/action';
import { IAccess } from '../interfaces/access';
import { TAccessFactory } from '../interfaces/access-factory';
import { IAuthorizer } from '../interfaces/authorizer';
import { Access } from './access';
import { TEnvironment } from '../types/environment';
import { TPermission } from '../types/permission';
import { anyImplies } from '../utils/any-implies';
import { makeArray } from '@bluejay/utils';

const DEFAULT_ACCESS_FACTORY = (allowed: boolean) => new Access(allowed);

export class Authorizer implements IAuthorizer {
  private accessFactory: TAccessFactory;

  public constructor(accessFactory?: TAccessFactory) {
    this.accessFactory = accessFactory || DEFAULT_ACCESS_FACTORY;
  }

  protected filterRelevantPermissions(resource: TResource, action: TAction, permissions: TPermission[]): TPermission[] {
    const relevant: TPermission[] = [];
    const parts = resource.split(RESOURCE_PARTS_SEPARATOR);

    for (const candidate of permissions) {
      if (anyImplies(makeArray(candidate.action), action)) {
        for (const candidateResource of makeArray(candidate.resource)) {
          const candidateParts = candidateResource.split(RESOURCE_PARTS_SEPARATOR);
          const sameLengthParts = blanksToWildCards(parts, candidateParts.length);

          let allPartsMatch = true;

          for (let i = 0, len = candidateParts.length; i < len; i++) {
            if (!implies(candidateParts[i], sameLengthParts[i])) {
              allPartsMatch = false;
              break;
            }
          }

          if (allPartsMatch) {
            relevant.push(candidate);
            break;
          }
        }
      }
    }

    return relevant;
  }

  public authorize(resource: TResource, action: TAction, permissions: TPermission[], environment?: TEnvironment): IAccess {
    const relevantPermissions = this.filterRelevantPermissions(resource, action, permissions);

    // White list approach: no permissions, no access
    if (!relevantPermissions.length) {
      return this.accessFactory(false);
    }

    // "deny" takes precedence over "allow"
    if (relevantPermissions.find(permission => permission.effect === PermissionEffect.DENY)) {
      return this.accessFactory(false);
    }

    // An explicit "allow" grants access
    if (relevantPermissions.find(permission => permission.effect === PermissionEffect.ALLOW)) {
      return this.accessFactory(true);
    }

    // Should never reach this point, however this is a protection against wrong `effect` values
    return this.accessFactory(false);
  }
}