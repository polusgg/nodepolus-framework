/**
 * Checks whether or not the provided type is undefined
 * https://github.com/microsoft/TypeScript/issues/20707#issuecomment-351874491
 */
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Checks whether or not the two objects are equal at the first level
 */
export function shallowEqual<T>(object1: T, object2: T): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i++) {
    if (object1[keys1[i]] !== object2[keys2[i]]) {
      return false;
    }
  }

  return true;
}
