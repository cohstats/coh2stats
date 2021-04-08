const sortArrayOfObjectsByTheirPropertyValue = (
  mapsData: Array<Record<string, string>>,
): Array<Record<string, string>> => {
  return mapsData.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });
};

const getExportedIconPath = (name: string): string => {
  return `/resources/exportedIcons/${name}.png`;
};

const getGeneralIconPath = (name: string): string => {
  return `/resources/generalIcons/${name}.png`;
};

export { sortArrayOfObjectsByTheirPropertyValue, getExportedIconPath, getGeneralIconPath };
