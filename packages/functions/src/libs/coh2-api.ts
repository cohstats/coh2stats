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

const commanderIDsToRaces: Record<number, string> = {
    186413: "usf",
    186415: "usf",
    451587: "usf",
    450483: "usf",
    450482: "usf",
    186414: "usf",
    260696: "usf",
    254449: "usf",
    261335: "usf",
    450479: "usf",
    452456: "usf",
    18369: "usf",
    450553: "british",
    450074: "british",
    450073: "british",
    450075: "british",
    452455: "british",
    450554: "british",
    450268: "british",
    450243: "british",
    450286: "british",
    6116: "wermacht",
    6118: "wermacht",
    6117: "wermacht",
    7554: "wermacht",
    5568: "wermacht",
    5570: "wermacht",
    5571: "wermacht",
    5927: "wermacht",
    7538: "wermacht",
    7541: "wermacht",
    7537: "wermacht",
    7540: "wermacht",
    6905: "wermacht",
    258891: "wermacht",
    7249: "wermacht",
    7539: "wermacht",
    5572: "wermacht",
    5573: "wermacht",
    5930: "wermacht",
    5921: "wermacht",
    5928: "wermacht",
    5929: "wermacht",
    452454: "wermacht",
    6120: "soviet",
    6121: "soviet",
    6119: "soviet",
    186229: "soviet",
    452461: "soviet",
    5926: "soviet",
    5922: "soviet",
    5575: "soviet",
    451588: "soviet",
    5576: "soviet",
    5924: "soviet",
    5578: "soviet",
    5579: "soviet",
    5580: "soviet",
    7546: "soviet",
    7246: "soviet",
    7543: "soviet",
    258974: "soviet",
    7544: "soviet",
    7542: "soviet",
    7545: "soviet",
    7247: "soviet",
    5923: "soviet",
    5925: "soviet",
    450495: "wgerman",
    186419: "wgerman",
    450496: "wgerman",
    257800: "wgerman",
    450494: "wgerman",
    259929: "wgerman",
    452452: "wgerman",
    186418: "wgerman",
    259657: "wgerman",
    451591: "wgerman",
    186417: "wgerman",
    347076: "wgerman",
};

/**
 * Commander can be only for single race.
 * @param commanderId
 */
const getCommanderRace = (commanderId: number): string => {
    if (Object.prototype.hasOwnProperty.call(commanderIDsToRaces, commanderId)) {
        return commanderIDsToRaces[commanderId];
    } else {
        console.error(`Unknown commanderID ${commanderId}`);
        return "unknown";
    }
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
