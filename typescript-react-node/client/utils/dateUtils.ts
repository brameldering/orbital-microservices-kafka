export const dateTimeToLocaleString = (date: Date): string => {
  // console.log('dateTimeToLocaleString date', date);
  // if (!(date instanceof Date)) {
  //   throw new Error('Invalid date');
  // }
  return new Date(date).toLocaleString();
};

export const dateTimeToLocaleDateString = (date: Date): string => {
  // console.log('dateTimeToLocaleDateString date', date);
  // if (!(date instanceof Date)) {
  //   throw new Error('Invalid date');
  // }
  return new Date(date).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const dateTimeToLocaleTimeString = (date: Date): string => {
  // console.log('dateTimeToLocaleTimeString date', date);
  // if (!(date instanceof Date)) {
  //   throw new Error('Invalid date');
  // }
  return new Date(date).toLocaleTimeString();
};
