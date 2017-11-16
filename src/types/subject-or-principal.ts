import { TSubjectPrincipal } from './subject-principal';
import { ISubject } from '../interfaces/subject';

export type TSubjectOrPrincipal<T extends object = {}> = TSubjectPrincipal | ISubject<T>;