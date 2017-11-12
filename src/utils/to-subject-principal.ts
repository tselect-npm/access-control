import { TSubjectPrincipal } from '../types/subject-principal';
import { ISubject } from '../interfaces/subject';
import * as Lodash from 'lodash';
import { TSubjectOrPrincipal } from '../types/subject-or-principal';

export function toSubjectPrincipal(subjectOrPrincipal: TSubjectOrPrincipal): TSubjectPrincipal {
  return Lodash.isObject(subjectOrPrincipal) ? (<ISubject<any>>subjectOrPrincipal).getPrincipal() : <TSubjectPrincipal>subjectOrPrincipal;
}