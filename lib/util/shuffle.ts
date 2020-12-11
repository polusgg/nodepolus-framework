/**
 * Shuffles the given array using the Fisher-Yates algorithm
 * Via https://basarat.gitbook.io/algorithms/shuffling
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
 * Returns a shuffled array without modifying the original array
 */
const shuffleArrayClone = <T>(array: T[]): T[] => {
  const clone = array.slice();

  shuffleArray(clone);

  return clone;
};

export { shuffleArray, shuffleArrayClone };
