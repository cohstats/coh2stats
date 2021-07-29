const convertTeamNames = (mode: string) => {
  if (mode.startsWith("team")) {
    return `Team of ${mode[4]}`;
  } else {
    return mode;
  }
};

export { convertTeamNames };
