/**
 * Restricts the given value to be inside an inclusive range.
 *
 * @param value The value to be clamped
 * @param min The minimum value
 * @param max The maximum value
 * @returns A number which falls within the range `{min..max}`
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}

/**
 * Checks whether or not the given value is undefined.
 *
 * @param value The possibly-undefined value
 * @returns `true` if `value` is not `undefined`
 */
export function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Checks whether or not the given objects are equal at their top level.
 *
 * @param one The first object
 * @param two The second object
 * @returns `true` if the two objects have the same length and keys.
 */
export function shallowEqual<T>(one: T, two: T): boolean {
  const keysOne = Object.keys(one);
  const keysTwo = Object.keys(two);

  if (keysOne.length !== keysTwo.length) {
    return false;
  }

  for (let i = 0; i < keysOne.length; i++) {
    if (one[keysOne[i]] !== two[keysTwo[i]]) {
      return false;
    }
  }

  return true;
}

/**
 * Gets a random number in an inclusive range of integers.
 *
 * @param min The minimum integer value
 * @param max The maximum integer value
 * @returns An integer which falls within the range `{min..max}`
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if the given floating-point numbers are equal by comparing their
 * difference to the given epsilon value.
 *
 * @param actual The number to be checked
 * @param expected The number that `actual` should be checked against
 * @param epsilon The margin of error for the comparison (default `0.001`)
 * @returns `true` if the difference of `actual` and `expected` is smaller than the value of `epsilon`
 */
export function isFloatEqual(actual: number, expected: number, epsilon: number = 0.001): boolean {
  return Math.abs(actual - expected) < epsilon;
}

/**
 * Gets the minimum number of bits used to represent the given number.
 *
 * @param value The number to be checked
 * @returns The number of binary bits needed to represent `value`
 */
export function bitsInNumber(value: number): number {
  return ((Math.log(value) / Math.log(2)) + 1) | 0;
}
