import {
  addFactionMatrixAnalysisToStats,
  determineMatchWinner,
  generateFactionString,
} from "../../libs/analysis/composition";
import { singleMatchObjectAfterTransform } from "../assets/assets";

const playerDataBSAxisWin = [
  {
    matchhistory_id: 242508050,
    profile_id: 4067976,
    resulttype: 1,
    teamid: 0,
    race_id: 2,
    counters: "",
    profile: [Object],
  },
  {
    matchhistory_id: 242508050,
    profile_id: 3122587,
    resulttype: 0,
    teamid: 1,
    race_id: 1,
    counters: "",
    profile: [Object],
  },
  {
    matchhistory_id: 242508050,
    profile_id: 4592945,
    resulttype: 1,
    teamid: 0,
    race_id: 0,
    counters: "",
    profile: [Object],
  },
  {
    matchhistory_id: 242508050,
    profile_id: 1882602,
    resulttype: 0,
    teamid: 1,
    race_id: 4,
    counters: "",
    profile: [Object],
  },
];

describe("determineMatchWinner", () => {
  it("Allies Win 3v3", () => {
    const result = determineMatchWinner(singleMatchObjectAfterTransform);

    expect(result).toBe("allies");
  });

  it("Axis Win 3v3", () => {
    const data = {
      id: 242508050,
      creator_profile_id: 4067976,
      mapname: "6p_across_the_rhine",
      maxplayers: 6,
      matchtype_id: 3,
      description: "AUTOMATCH",
      startgametime: 1610830590,
      completiontime: 1610833065,
      matchhistoryreportresults: [
        {
          matchhistory_id: 242508050,
          profile_id: 4067976,
          resulttype: 1,
          teamid: 0,
          race_id: 2,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3122587,
          resulttype: 0,
          teamid: 1,
          race_id: 1,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 4592945,
          resulttype: 1,
          teamid: 0,
          race_id: 0,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 1882602,
          resulttype: 0,
          teamid: 1,
          race_id: 4,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3513025,
          resulttype: 1,
          teamid: 0,
          race_id: 2,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3036689,
          resulttype: 0,
          teamid: 1,
          race_id: 3,
          counters: "",
          profile: [Object],
        },
      ],
      matchhistoryitems: [],
      profile_ids: [],
      steam_ids: [],
    };
    const result = determineMatchWinner(data);

    expect(result).toBe("axis");
  });

  it("None win", () => {
    const data = {
      id: 242508050,
      creator_profile_id: 4067976,
      mapname: "6p_across_the_rhine",
      maxplayers: 6,
      matchtype_id: 3,
      description: "AUTOMATCH",
      startgametime: 1610830590,
      completiontime: 1610833065,
      matchhistoryreportresults: [
        {
          matchhistory_id: 242508050,
          profile_id: 4067976,
          resulttype: 0,
          teamid: 0,
          race_id: 2,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3122587,
          resulttype: 0,
          teamid: 1,
          race_id: 1,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 4592945,
          resulttype: 0,
          teamid: 0,
          race_id: 0,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 1882602,
          resulttype: 0,
          teamid: 1,
          race_id: 4,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3513025,
          resulttype: 0,
          teamid: 0,
          race_id: 2,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3036689,
          resulttype: 0,
          teamid: 1,
          race_id: 3,
          counters: "",
          profile: [Object],
        },
      ],
      matchhistoryitems: [],
      profile_ids: [],
      steam_ids: [],
    };
    const result = determineMatchWinner(data);

    expect(result).toBe("none");
  });

  it("Axis Win 1v1", () => {
    const data = {
      id: 242508050,
      creator_profile_id: 4067976,
      mapname: "6p_across_the_rhine",
      maxplayers: 2,
      matchtype_id: 3,
      description: "AUTOMATCH",
      startgametime: 1610830590,
      completiontime: 1610833065,
      matchhistoryreportresults: [
        {
          matchhistory_id: 242508050,
          profile_id: 4067976,
          resulttype: 1,
          teamid: 0,
          race_id: 2,
          counters: "",
          profile: [Object],
        },
        {
          matchhistory_id: 242508050,
          profile_id: 3122587,
          resulttype: 0,
          teamid: 1,
          race_id: 1,
          counters: "",
          profile: [Object],
        },
      ],
      matchhistoryitems: [],
      profile_ids: [],
      steam_ids: [],
    };
    const result = determineMatchWinner(data);

    expect(result).toBe("axis");
  });
});

describe("generateFactionString", () => {
  it("Generate string allies BSU", () => {
    let data = [
      {
        matchhistory_id: 242508050,
        profile_id: 4067976,
        resulttype: 1,
        teamid: 0,
        race_id: 2,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3122587,
        resulttype: 0,
        teamid: 1,
        race_id: 1,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 4592945,
        resulttype: 1,
        teamid: 0,
        race_id: 0,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 1882602,
        resulttype: 0,
        teamid: 1,
        race_id: 4,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3513025,
        resulttype: 1,
        teamid: 0,
        race_id: 2,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3036689,
        resulttype: 0,
        teamid: 1,
        race_id: 3,
        counters: "",
        profile: [Object],
      },
    ];
    data = data.filter((playerReport) => playerReport.teamid === 1);

    const factionString = generateFactionString(data);

    expect(factionString).toBe("BSU");
  });

  it("Generate string allies OOW", () => {
    let data = [
      {
        matchhistory_id: 242508050,
        profile_id: 4067976,
        resulttype: 1,
        teamid: 0,
        race_id: 2,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3122587,
        resulttype: 0,
        teamid: 1,
        race_id: 1,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 4592945,
        resulttype: 1,
        teamid: 0,
        race_id: 0,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 1882602,
        resulttype: 0,
        teamid: 1,
        race_id: 4,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3513025,
        resulttype: 1,
        teamid: 0,
        race_id: 2,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3036689,
        resulttype: 0,
        teamid: 1,
        race_id: 3,
        counters: "",
        profile: [Object],
      },
    ];
    data = data.filter((playerReport) => playerReport.teamid === 0);

    const factionString = generateFactionString(data);

    expect(factionString).toBe("OOW");
  });

  it("Generate string allies OW", () => {
    let data = [
      {
        matchhistory_id: 242508050,
        profile_id: 4067976,
        resulttype: 1,
        teamid: 0,
        race_id: 2,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 3122587,
        resulttype: 0,
        teamid: 1,
        race_id: 1,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 4592945,
        resulttype: 1,
        teamid: 0,
        race_id: 0,
        counters: "",
        profile: [Object],
      },
      {
        matchhistory_id: 242508050,
        profile_id: 1882602,
        resulttype: 0,
        teamid: 1,
        race_id: 4,
        counters: "",
        profile: [Object],
      },
    ];
    data = data.filter((playerReport) => playerReport.teamid === 0);

    const factionString = generateFactionString(data);

    expect(factionString).toBe("OW");
  });

  it("Generate string allies BS", () => {
    const data = playerDataBSAxisWin.filter((playerReport) => playerReport.teamid === 1);

    const factionString = generateFactionString(data);

    expect(factionString).toBe("BS");
  });
});

describe("addFactionMatrixAnalysisToStats", () => {
  it("Makes correct analysis", () => {
    let stats: any = {};

    stats = addFactionMatrixAnalysisToStats(singleMatchObjectAfterTransform, stats);

    expect(stats["factionMatrix"]).toMatchObject({ OOWxBSU: { losses: 1 } });

    stats = addFactionMatrixAnalysisToStats(singleMatchObjectAfterTransform, stats);

    expect(stats["factionMatrix"]).toMatchObject({ OOWxBSU: { losses: 2 } });

    const copiedMatch = JSON.parse(JSON.stringify(singleMatchObjectAfterTransform));

    copiedMatch.matchhistoryreportresults = playerDataBSAxisWin;
    stats = addFactionMatrixAnalysisToStats(copiedMatch, stats);

    expect(stats["factionMatrix"]).toMatchObject({ OOWxBSU: { losses: 2 }, OWxBS: { wins: 1 } });
  });
});
