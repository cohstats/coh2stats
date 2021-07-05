/**
 * - To get the link to the comment - click on the twitter share button on the forum
 * - Latest patch has to have endDate as Infinity
 */
const patches = [
  {
    name: "Commander Update 2021",
    link: "https://community.companyofheroes.com/discussion/comment/288981#Comment_288981",
    humanReadableDate: "16th June 2021",
    startDateUnixTimeStamp: 1623801600, // 16th June
    endDateUnixTimeStamp: Infinity, // Infinity
  },
  {
    name: "Winter Balance Patch 2021",
    link: "https://community.companyofheroes.com/discussion/comment/288640#Comment_288640",
    humanReadableDate: "26th Feb 2021",
    startDateUnixTimeStamp: 1614297600, // 26th Feb
    endDateUnixTimeStamp: 1623801600, // 16th June
  },
];

const isTimeStampInPatches = (unixTimeStamp: number) => {
  const isInPatches = [];

  for (const patch of patches) {
    if (
      unixTimeStamp >= patch.startDateUnixTimeStamp &&
      unixTimeStamp < patch.endDateUnixTimeStamp
    ) {
      isInPatches.push(patch);
    }
  }

  return isInPatches;
};

export { isTimeStampInPatches };
