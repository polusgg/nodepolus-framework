/**
 * A utility type to make another type recursively immutable.
 *
 * @typeParam T - The type that will be made immutable
 */
export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};
