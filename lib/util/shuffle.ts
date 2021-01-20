/**
 * Shuffles the given array using the Fisher-Yates algorithm.
 *
 * This *does* modify the source array.
 *
 * @see Source: {@link https://basarat.gitbook.io/algorithms/shuffling}
 * @typeParam T The type of items that `array` contains
 * @param array The array whose items will be shuffled in place
 */
const shuffleArray = <T>(array: T[]): void => {
  if (array.length <= 1) {
    return;
  }

  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * (array.length - i)) + i;

    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
};

/**
 * Gets a new array, cloned from the given array, that is then shuffled using
 * the Fisher-Yates algorithm.
 *
 * This *does not* modify the source array.
 *
 * @param array The source array
 * @typeParam T The type of items that `array` contains
 */
const shuffleArrayClone = <T>(array: T[]): T[] => {
  const clone = array.slice();

  shuffleArray(clone);

  return clone;
};

export { shuffleArray, shuffleArrayClone };
