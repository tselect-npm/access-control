import { TSubjectPrincipal } from '../types/subject-principal';

export interface ISubject<T extends object> {
  getPrincipal(): TSubjectPrincipal;
  get<K extends keyof Partial<T>>(key: K): T[K];
  set<K extends keyof Partial<T>>(key: K, value: T[K]): this;
}