const getYesterdayDateTimestamp = (): number => {
  const date = new Date();
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1) / 1000;
};

const convertDateToDayTimestamp = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
};

const convertDateToMonthTimestamp = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1000;
};

const getStartOfTheWeek = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  const diff = date.getUTCDate() - date.getUTCDay() + (date.getUTCDay() === 0 ? -6 : 1);
  return new Date(date.setUTCDate(diff));
};

export {
  getYesterdayDateTimestamp,
  convertDateToDayTimestamp,
  convertDateToMonthTimestamp,
  getStartOfTheWeek,
};
