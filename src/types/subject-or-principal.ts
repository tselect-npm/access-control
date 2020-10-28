import { ISubject } from '../interfaces/subject';
import { TSubjectPrincipal } from './subject-principal';

export type TSubjectOrPrincipal<T extends object = {}> = TSubjectPrincipal | ISubject<T>;
