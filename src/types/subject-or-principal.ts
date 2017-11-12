import { TSubjectPrincipal } from './subject-principal';
import { ISubject } from '../interfaces/subject';

export type TSubjectOrPrincipal<T extends object = any> = TSubjectPrincipal | ISubject<T>;