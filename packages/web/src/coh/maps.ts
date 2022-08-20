/**
 *
 * @param name Should be the name we ge from server, for example
 * @param version
 */
const getMapIconPath = (name: string, version: "x64" | "x300" = "x300"): string => {
  return `/resources/map-images/${name}_${name}_${version}.webp`;
};

export { getMapIconPath };
