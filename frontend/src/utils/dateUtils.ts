export const dateTimeToLocaleString = (date: Date): string => {
  return new Date(date).toLocaleString();
};

export const dateTimeToLocaleDateString = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

export const dateTimeToLocaleTimeString = (date: Date): string => {
  return new Date(date).toLocaleTimeString();
};
