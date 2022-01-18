export interface LeaderboardStat {
  statgroup_id: number;
  leaderboard_id: number;
  wins: number;
  losses: number;
  streak: number;
  disputes: number;
  drops: number;
  rank: number;
  ranktotal: number;
  ranklevel: number;
  regionrank: number;
  regionranktotal: number;
  lastmatchdate: number;
}

export interface StatGroupMember {
  profile_id: number;
  name: string;
  alias: string;
  personal_statgroup_id: number;
  xp: number;
  level: number;
  leaderboardregion_id: number;
  country: string;
}

export interface StatGroup {
  id: number;
  name: string;
  members: StatGroupMember[];
}

export interface PersonalStatResponse {
  result: { code: number, message: string};
  statGroups: StatGroup[];
  leaderboardStats: LeaderboardStat[];
}
