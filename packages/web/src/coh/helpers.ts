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
  // We have typo in the system and DB, sometimes it's wermacht and sometimes wehrmacht
  if (name === "wehrmacht") {
    name = "wermacht";
  }

  return `/resources/generalIcons/${name}.png`;
};

export { sortArrayOfObjectsByTheirPropertyValue, getExportedIconPath, getGeneralIconPath };
