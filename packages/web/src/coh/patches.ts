/**
 * - To get the link to the comment - click on the twitter share button on the forum // old forum not works anymore
 * - Latest patch has to have endDate as Infinity
 *
 * When adding new patch / make sure too change the current key.
 *
 */
const currentPatch = "sbp2021";

const patches = {
  sbp2021: {
    name: "Summer Balance Patch 2021",
    link: "https://www.coh2.org/topic/4307/coh2-changelog/post/876828",
    linkRelic:
      "https://community.companyofheroes.com/coh-franchise/company-of-heroes-legacy/forums/5-company-of-heroes-2-general/threads/1652-company-of-heroes-2-september-2021-patch-notes",
    humanReadableDate: "9th September 2021",
    startDateUnixTimeStamp: 1631145600, //  9th Sep
    endDateUnixTimeStamp: Infinity, // Infinity
    patchFolder: "cu2021", // There was no update
  },
  cu2021: {
    name: "Commander Update 2021",
    link: "https://www.coh2.org/topic/4307/company-of-heroes-2-changelog/post/872416",
    linkRelic: "https://community.companyofheroes.com/discussion/comment/288981#Comment_288981",
    humanReadableDate: "16th June 2021",
    startDateUnixTimeStamp: 1623801600, // 16th June
    endDateUnixTimeStamp: 1631145600, // 9th Sep
    patchFolder: "cu2021",
  },
  wbp2021: {
    name: "Winter Balance Patch 2021",
    link: "https://www.coh2.org/topic/4307/company-of-heroes-2-changelog/post/852771",
    linkRelic: "https://community.companyofheroes.com/discussion/comment/288640#Comment_288640",
    humanReadableDate: "26th Feb 2021",
    startDateUnixTimeStamp: 1614297600, // 26th Feb
    endDateUnixTimeStamp: 1623801600, // 16th June
    patchFolder: "wbp2021",
  },
};

const isTimeStampInPatches = (unixTimeStamp: number) => {
  const isInPatches = [];

  for (const patch of Object.values(patches)) {
    if (
      unixTimeStamp >= patch.startDateUnixTimeStamp &&
      unixTimeStamp < patch.endDateUnixTimeStamp
    ) {
      isInPatches.push(patch);
    }
  }

  return isInPatches;
};

const getCurrentPatch = () => {
  return patches[currentPatch];
};

const getAllPatchDates = () => {
  const patchDates = [];
  for (const patch of Object.values(patches)) {
    let date = new Date(patch.startDateUnixTimeStamp * 1000);
    patchDates.push(date);
  }
  return patchDates;
};

export { isTimeStampInPatches, getCurrentPatch, getAllPatchDates, patches };
