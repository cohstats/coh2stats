I want to add COH2 relic APIs into packages/web/src/coh/coh2-api.ts

First I want to add function to fetch the leaderbaords.

Instead of axios, use fetch
Here are pieces of the code ho we do it in our BE

const leaderBoardID = `${req.query[leaderBoardIDQuery]}`;
const start = `${req.query[startQuery]}`;
const count = `${req.query[countQuery]}`;

const laddersData = await fetchLadderStats(
parseInt(leaderBoardID) || 1,
parseInt(start) || 1,
parseInt(count) || 200,
);

const fetchLadderStats = async (
leaderboardID: number,
start = 1,
count = AMOUNT_OF_QUERIED_PLAYERS,
): Promise<RawLaddersObject> => {
const response = await axios.get(getLadderUrl(leaderboardID, count, start), { httpsAgent });

if (response.status == 200) {
return response.data;
} else {
throw Error(`Failed to received the ladder stats, response: ${response}`);
}
};

const getLadderUrl = (leaderboardID: number, count = 40, start = 1): string => {
// sortBy 1 means by ranking
return encodeURI(
baseRelicAPIUrl +
`/community/leaderboard/getLeaderBoard2?leaderboard_id=${leaderboardID}&title=coh2&platform=PC_STEAM&sortBy=1&start=${start}&count=${count}`,
);
};

export const baseRelicAPIUrl = "https://coh2-api.reliclink.com";
