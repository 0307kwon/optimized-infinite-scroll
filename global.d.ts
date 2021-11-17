interface Array<T> {
  findLast: (isElementLookingFor: (element: T) => any) => T | undefined;
}
