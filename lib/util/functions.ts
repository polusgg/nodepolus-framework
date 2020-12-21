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

/**
 * Choose a random number in an inclusive range
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if the supplied floating-point numbers are equal by comparing their
 * difference with the supplied epsilon value.
 */
export function isFloatEqual(actual: number, expected: number, epsilon: number = 0.001): boolean {
  return Math.abs(actual - expected) < epsilon;
}

/**
 * Gets the minimum number of bits used to represent the supplied number.
 */
export function bitsInNumber(value: number): number {
  return ((Math.log(value) / Math.log(2)) + 1) | 0;
}
