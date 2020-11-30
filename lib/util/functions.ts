/**
 * Checks whether ot not the provided type is undefined
 * https://github.com/microsoft/TypeScript/issues/20707#issuecomment-351874491
 */
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
