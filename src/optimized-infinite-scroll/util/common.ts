export const getDividedElementsByColumn = <T>(
  target: ArrayLike<T>,
  column: number
) => {
  return [...Array(1 + Math.floor(target.length / column))].map((_, row) => {
    return [...Array(column)].map((_, col) => {
      const index = row * column + col;

      return target[index];
    });
  });
};
