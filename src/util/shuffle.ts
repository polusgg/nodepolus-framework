/**
 * Shuffles the given array using the Fisher-Yates algorithm.
 *
 * This *does* modify the source array.
 *
 * @see Source: {@link https://basarat.gitbook.io/algorithms/shuffling}
 * @typeParam T - The type of each item in `items`
 * @param items - The array whose items will be shuffled in place
 */
const shuffleArray = <T>(items: T[]): void => {
  if (items.length <= 1) {
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const randomIndex = Math.floor(Math.random() * (items.length - i)) + i;

    [items[i], items[randomIndex]] = [items[randomIndex], items[i]];
  }
};

/**
 * Gets a new array, cloned from the given array, that is then shuffled using
 * the Fisher-Yates algorithm.
 *
 * This *does not* modify the source array.
 *
 * @see Source: {@link https://basarat.gitbook.io/algorithms/shuffling}
 * @typeParam T - The type of each item in `items`
 * @param items - The array whose items will be shuffled and returned
 */
const shuffleArrayClone = <T>(items: T[]): T[] => {
  const clone = items.slice();

  shuffleArray(clone);

  return clone;
};

export { shuffleArray, shuffleArrayClone };
