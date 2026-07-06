/**
 *
 * @param name Should be the name we ge from server, for example
 * @param version
 */
const getMapIconPath = (name: string, version: "x64" | "x300" = "x300"): string => {
  return `/resources/map-images/${name}_${version}.webp`;
};

interface MapInfo {
  type: ("1v1" | "2v2" | "3v3" | "4v4")[];
  displayName: string;
}

const mapNames: Record<string, MapInfo> = {
  // 4v4 Maps
  "8p_redball_express": {
    type: ["4v4"],
    displayName: "Red Ball Express",
  },
  "8p_west_wall": {
    type: ["4v4"],
    displayName: "The West Wall",
  },
  "8p_general_mud": {
    type: ["4v4"],
    displayName: "General Mud",
  },
  "8p_lorch_assault": {
    type: ["4v4"],
    displayName: "Lorch Assault",
  },
  "8p_la_gleize": {
    type: ["4v4"],
    displayName: "La Gleize Breakout",
  },
  "8p_coh2_city_17_spring_frontline": {
    type: ["4v4"],
    displayName: "City 17",
  },
  "8p_coh2_thesteppes_frontline": {
    type: ["4v4"],
    displayName: "Steppes",
  },
  "8p_hill_400": {
    type: ["4v4"],
    displayName: "Hill 400",
  },
  "8p_lazenrath_ambush": {
    type: ["4v4"],
    displayName: "Lanzerath Ambush",
  },
  "8p_nordwind": {
    type: ["4v4"],
    displayName: "Nordwind",
  },
  "8p_essen_steelworks": {
    type: ["4v4"],
    displayName: "Essen Steelworks",
  },
  "8p_lienne_forest": {
    type: ["4v4"],
    displayName: "Lienne Forest",
  },
  roadtoarnhem: {
    type: ["4v4"],
    displayName: "Road to Arnhem",
  },
  "8p_port_of_hamburg": {
    type: ["4v4"],
    displayName: "Port of Hamburg",
  },
  "8p_whiteball_express": {
    type: ["4v4", "3v3"],
    displayName: "Whiteball Express",
  },
  // 3v3 Maps
  "6p_across_the_rhine": {
    type: ["3v3"],
    displayName: "Across the Rhine",
  },
  "6p_fields_of_winnekendonk": {
    type: ["3v3"],
    displayName: "Fields of Winnekendonk",
  },
  "6p_port_of_hamburg": {
    type: ["3v3"],
    displayName: "Port of Hamburg",
  },
  "6p_rzhev_frontline": {
    type: ["3v3"],
    displayName: "Rzhev Frontline",
  },
  "4p_coh2_okariver_frontline": {
    type: ["3v3"],
    displayName: "Oka River",
  },
  "6p_angermuende": {
    type: ["3v3"],
    displayName: "Angermünde",
  },
  "6p_ettelbruck_station": {
    type: ["3v3"],
    displayName: "Ettelbruck Station",
  },
  "6p_hill_400": {
    type: ["3v3"],
    displayName: "Hill 400",
  },
  // 2v2 Maps
  "4p_vaux_farmlands": {
    type: ["2v2"],
    displayName: "Vaux Farmlands",
  },
  "4p_fields_of_winnekendonk": {
    type: ["2v2"],
    displayName: "Fields of Winnekendonk",
  },
  "4p_minsk_pocket_frontline": {
    type: ["2v2"],
    displayName: "Minsk Pocket",
  },
  "4p_moscow_outskirts_fall_frontline": {
    type: ["2v2"],
    displayName: "Moscow Outskirts",
  },
  "4p_dreux_scout": {
    type: ["2v2"],
    displayName: "Dreux Scout",
  },
  "4p_elst_outskirts": {
    type: ["2v2"],
    displayName: "Elst Outskirts",
  },
  "4p_road_to_kharkov": {
    type: ["2v2"],
    displayName: "Road to Kharkov",
  },
  wolfheze: {
    type: ["2v2"],
    displayName: "Wolfheze",
  },
  "4p_rails_and_metal": {
    type: ["2v2"],
    displayName: "Rails and Metal",
  },
  "4p_belgorod": {
    type: ["2v2"],
    displayName: "Belgorod",
  },
  "4p_crossing_in_the_woods": {
    type: ["2v2"],
    displayName: "Crossing in the Woods",
  },
  aod: {
    type: ["2v2"],
    displayName: "Arnhem Outskirts",
  },
  "4p_einhoven_country": {
    type: ["2v2"],
    displayName: "Eindhoven Country",
  },
  highwaybaku: {
    type: ["2v2"],
    displayName: "Highway to Baku",
  },
  // 1v1 Maps
  ploiesti: {
    type: ["1v1"],
    displayName: "Ploiesti Outskirts",
  },
  "2p_crossing_in_the_woods": {
    type: ["1v1"],
    displayName: "Crossing in the Woods",
  },
  bocage: {
    type: ["1v1"],
    displayName: "Bocage",
  },
  langres: {
    type: ["1v1"],
    displayName: "Langreskaya",
  },
  nexus: {
    type: ["1v1"],
    displayName: "Nexus",
  },
  vilshanka: {
    type: ["1v1"],
    displayName: "Vilshanka",
  },
  "2p_bayeux": {
    type: ["1v1"],
    displayName: "Bayeux",
  },
  "2p_faymonville_approach": {
    type: ["1v1"],
    displayName: "Faymonville Approach",
  },
  "2p_kholodnaya_ferma_spring_frontline": {
    type: ["1v1"],
    displayName: "Kholodny Ferma",
  },
  amilly_fields: {
    type: ["1v1"],
    displayName: "Amilly Fields",
  },
  crossroadswx: {
    type: ["1v1"],
    displayName: "Crossroads Winter",
  },
  mill_road: {
    type: ["1v1"],
    displayName: "Mill Road",
  },
  crossroads: {
    type: ["1v1"],
    displayName: "Crossroads",
  },
}


export { getMapIconPath };
