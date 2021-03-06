export const getDividedElementsByColumn = <T>(
  target: ArrayLike<T>,
  column: number
) => {
  return [...Array(Math.ceil(target.length / column))].map((_, row) => {
    return [...Array(column)]
      .map((_, col) => {
        const index = row * column + col;

        return target[index];
      })
      .filter(Boolean);
  });
};

export const isSameArray = (arrayA: unknown[], arrayB: unknown[]) => {
  const maxLength = Math.max(arrayA.length, arrayB.length);

  return [...Array(maxLength)].every(
    (_, index) => arrayA[index] === arrayB[index]
  );
};
