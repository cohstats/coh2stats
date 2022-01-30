const convertDateToMonthTimestamp = (dateInput: string | Date): number => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1000;
};

export { convertDateToMonthTimestamp };
