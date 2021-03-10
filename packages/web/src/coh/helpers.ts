
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

export {sortArrayOfObjectsByTheirPropertyValue };
