// choose a number within a range, integer (whole number) by default
export const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;

  if (float) {
    return val;
  }

  return Math.floor(val);
};
