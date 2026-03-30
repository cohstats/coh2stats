import { Metadata } from "next";
import { leaderBoardsBase } from "../../titles";

export const metadata: Metadata = {
  title: leaderBoardsBase.replace("COH2 ", ""),
  description: "View Company of Heroes 2 leaderboards and rankings for all game modes and factions",
  openGraph: {
    title: leaderBoardsBase,
    description: "COH2 leaderboards and rankings for all game modes",
    url: "https://coh2stats.com/leaderboards",
  },
};

export default function LeaderboardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

