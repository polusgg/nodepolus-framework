/**
 * A utility type to make another type recursively required.
 *
 * @typeParam T The type that will have all of its properties set to required
 */
export type AllRequired<T> = {
  [K in keyof T]-?: AllRequired<T[K]>;
};
