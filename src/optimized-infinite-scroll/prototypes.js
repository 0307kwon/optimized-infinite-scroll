Array.prototype.findLast = function (isElementLookingFor) {
  let lastIndex = this.length - 1;

  for (let index = lastIndex; index > 0; index--) {
    if (!isElementLookingFor(this[index])) {
      continue;
    }

    if (typeof this[index] === "object") {
      return { ...this[index] };
    }

    return this[index];
  }

  return undefined;
};
