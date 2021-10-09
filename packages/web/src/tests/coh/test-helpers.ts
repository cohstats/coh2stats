const getRandomElement = (data: any) => {
  const keys = Object.keys(data);
  return (data as any)[keys[Math.floor(Math.random() * keys.length)]];
};

const getDataCount = (data: any) => {
  return Object.values(data).length - 1;
};

export { getRandomElement, getDataCount };
