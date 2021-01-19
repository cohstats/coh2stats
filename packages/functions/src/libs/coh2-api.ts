const baseUrl = "https://coh2-api.reliclink.com";

const getLadderUrl = (leaderboardID: number, count = 40, start = 1): string => {
    // sortBy 1 means by ranking
    return encodeURI(
        baseUrl +
            `/community/leaderboard/getLeaderBoard2?leaderboard_id=${leaderboardID}&title=coh2&platform=PC_STEAM&sortBy=1&start=${start}&count=${count}`,
    );
};

const getRecentMatchHistoryUrl = (profileName: string): string => {
    return encodeURI(
        baseUrl +
            `/community/leaderboard/getRecentMatchHistory?title=coh2&profile_names=["${profileName}"]`,
    );
};

/**
 * The names are important, can't be changed
 */
const leaderboardsID: Record<string, Record<string, number>> = {
    "1v1": {
        wehrmacht: 4,
        soviet: 5,
        wgerman: 6,
        usf: 7,
        british: 51,
    },
    "2v2": {
        wehrmacht: 8,
        soviet: 9,
        wgerman: 10,
        usf: 11,
        british: 52,
    },
    "3v3": {
        wehrmacht: 12,
        soviet: 13,
        wgerman: 14,
        usf: 15,
        british: 53,
    },
    "4v4": {
        wehrmacht: 16,
        soviet: 17,
        wgerman: 18,
        usf: 19,
        british: 54,
    },
    team2: {
        axis: 20,
        allies: 21,
    },
    team3: {
        axis: 22,
        allies: 23,
    },
    team4: {
        axis: 24,
        allies: 25,
    },
};

const raceIds: Record<number, string> = {
    0: "wermacht",
    1: "soviet",
    2: "wgerman",
    3: "usf",
    4: "british",
};

const resultType = {
    lose: 0,
    win: 1,
};

export { baseUrl, getLadderUrl, leaderboardsID, getRecentMatchHistoryUrl, raceIds, resultType };
