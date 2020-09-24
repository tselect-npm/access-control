import * as Lodash from 'lodash';
import { ISubject } from '../interfaces/subject';
import { TSubjectOrPrincipal } from '../types/subject-or-principal';
import { TSubjectPrincipal } from '../types/subject-principal';

export function toSubjectPrincipal(subjectOrPrincipal: TSubjectOrPrincipal): TSubjectPrincipal {
  return Lodash.isObject(subjectOrPrincipal) ? (<ISubject<any>>subjectOrPrincipal).getPrincipal() : <TSubjectPrincipal>subjectOrPrincipal;
}
