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

const matchItemsLocation = {
    commanders: 3,
    intelBulletins: 4,
};

const wermachCommandersIDs = [
    6116,
    6118,
    6117,
    7554,
    5568,
    5570,
    5571,
    5927,
    7538,
    7541,
    7537,
    7540,
    6905,
    258891,
    7249,
    7539,
    5572,
    5573,
    5930,
    5921,
    5928,
    5929,
    452454,
];
const sovietCommandersIDs = [
    6120,
    6121,
    6119,
    186229,
    452461,
    5926,
    5922,
    5575,
    451588,
    5576,
    5924,
    5578,
    5579,
    5580,
    7546,
    7246,
    7543,
    258974,
    7544,
    7542,
    7545,
    7247,
    5923,
    5925,
];
const wgermanCommandersIDs = [
    450495,
    186419,
    450496,
    257800,
    450494,
    259929,
    452452,
    186418,
    259657,
    451591,
    186417,
    347076,
];
const usfCommandersIDs = [
    186413,
    186415,
    451587,
    450483,
    450482,
    186414,
    260696,
    254449,
    261335,
    450479,
    452456,
    18369,
];
const britishCommandersIDs = [
    450553,
    450074,
    450073,
    450075,
    452455,
    450554,
    450268,
    450243,
    450286,
];

/**
 * Commander can be only for single race.
 * @param commanderId
 */
const getCommanderRace = (commanderId: number): string => {
    if (wermachCommandersIDs.includes(commanderId)) {
        return "wermacht";
    }
    if (sovietCommandersIDs.includes(commanderId)) {
        return "soviet";
    }

    if (wgermanCommandersIDs.includes(commanderId)) {
        return "wgerman";
    }

    if (usfCommandersIDs.includes(commanderId)) {
        return "usf";
    }

    if (britishCommandersIDs.includes(commanderId)) {
        return "british";
    }

    console.error(`Found commander id which is not assigned to any faction ${commanderId}`);
    return "unknown";
};

export {
    baseUrl,
    getLadderUrl,
    leaderboardsID,
    getRecentMatchHistoryUrl,
    raceIds,
    getCommanderRace,
    resultType,
    matchItemsLocation,
};
