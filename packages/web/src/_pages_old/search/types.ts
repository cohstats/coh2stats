type RelicProfileType = {
  id: number;
  members: Array<{
    alias: string;
    country: string;
    leaderboardregion_id: number;
    level: number;
    name: string;
    personal_statgroup_id: number;
    profile_id: number;
    xp: number;
  }>;
  name: string;
  type: number;
};

type SteamProfileType = {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  communityvisibilitystate: number;
  personaname: string;
  personastate: number;
  personastateflags: number;
  primaryclanid: string;
  profilestate: number;
  profileurl: string;
  steamid: string;
  timecreated: number;
};

type userAPIObject = {
  steamProfile: SteamProfileType;
  relicProfile: RelicProfileType;
};

export type { userAPIObject, RelicProfileType, SteamProfileType };
