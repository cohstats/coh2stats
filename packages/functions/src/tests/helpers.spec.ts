import {
  convertSteamNameToID,
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
