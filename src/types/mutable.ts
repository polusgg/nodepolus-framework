/**
 * A utility type to make another type and all of its immediate members mutable.
 *
 * @typeParam T - The type that will be made mutable
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
};
