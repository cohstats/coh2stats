import {
  convertSteamNameToID,
  getDateTimeStampsInRange,
  getLastWeekTimeStamps,
  getMonthTimeStamps,
  getYesterdayDateTimeStampInterval,
  sumValuesOfObjects,
} from "../libs/helpers";

describe("convertSteamNameToID", () => {
  test("Is correctly converted", () => {
    const steamName = "/steam/76561198131099369";
    const id = convertSteamNameToID(steamName);

    expect(id).toBe("76561198131099369");
  });
});

describe("sumValuesOfObjects", () => {
  test("Simple objects with same keys", () => {
    const a = {
      chlupata: 3,
      hruska: 8,
    };

    const b = {
      chlupata: 7,
      hruska: 14,
    };

    expect(sumValuesOfObjects(a, b)).toMatchObject({
      chlupata: 10,
      hruska: 22,
    });
  });

  test("Simple objects, b has extra key", () => {
    const a = {
      chlupata: 3,
    };

    const b = {
      chlupata: 7,
      hruska: 14,
    };

    expect(sumValuesOfObjects(a, b)).toMatchObject({
      chlupata: 10,
      hruska: 14,
    });
  });

  test("Simple objects, a has extra key", () => {
    const a = {
      chlupata: 3,
      hruska: 14,
    };

    const b = {
      chlupata: 7,
    };

    expect(sumValuesOfObjects(a, b)).toMatchObject({
      chlupata: 10,
      hruska: 14,
    });
  });

  test("Complex objects", () => {
    const a = {
      chlupata: 3,
      hruska: 14,
      zidle: {
        noha: 3,
        police: 4,
      },
    };

    const b = {
      chlupata: 7,
      zidle: {
        noha: 10,
      },
    };

    expect(sumValuesOfObjects(a, b)).toMatchObject({
      chlupata: 10,
      hruska: 14,
      zidle: {
        noha: 13,
        police: 4,
      },
    });
  });

  test("Complex objects in a", () => {
    const a = {
      chlupata: 3,
      hruska: 14,
      zidle: {
        noha: 3,
        police: 4,
      },
    };

    const b = {
      chlupata: 7,
      neco: {
        kolo: 10,
      },
    };

    expect(sumValuesOfObjects(a, b)).toMatchObject({
      chlupata: 10,
      hruska: 14,
      zidle: {
        noha: 3,
        police: 4,
      },
      neco: {
        kolo: 10,
      },
    });
  });
});

describe("getYesterdayDateTimeStampInterval", () => {
  test("Returns value", () => {
    const timestamps = getYesterdayDateTimeStampInterval();
    expect(timestamps).toHaveProperty("start");
    expect(timestamps).toHaveProperty("end");
  });
});

describe("getDateTimeStampsInRange", () => {
  test("Returns the value", () => {
    const result = getDateTimeStampsInRange(
      new Date(Date.UTC(2021, 2, 15)),
      new Date(Date.UTC(2021, 2, 21)),
    );
    expect(result.length).toBe(7);

    // we can't match object because in windows we can't set the timezone to UTC in nodejs, FU nodejs
    // expect(result).toMatchObject([
    //   1615680000,
    //   1615766400,
    //   1615852800,
    //   1615939200,
    //   1616025600,
    //   1616112000,
    //   1616198400,
    // ]);
  });
});

describe("getLastWeekTimeStamps", () => {
  test("Returns 7 values", () => {
    const result = getLastWeekTimeStamps();
    expect(result.length).toBe(7);
  });
});

describe("getMonthTimeStamps", () => {
  test("Returns correct timestamps", () => {
    const result = getMonthTimeStamps(new Date(2021, 2));
    expect(result.length).toBe(31);
  });
});
