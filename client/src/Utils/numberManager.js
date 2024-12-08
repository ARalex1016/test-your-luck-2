export const getPercentage = (num, total) => {
  if (total === 0 || num === 0) return 0;

  const percentage = (num / total) * 100;

  return percentage % 1 === 0 ? percentage : percentage.toFixed(2);
};
