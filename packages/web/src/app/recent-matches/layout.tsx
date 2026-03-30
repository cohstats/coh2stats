import { Metadata } from "next";
import { mostRecentGamesAppBase } from "../../titles";

export const metadata: Metadata = {
  title: mostRecentGamesAppBase.replace("COH2 ", ""),
  description:
    "Browse the most recent Company of Heroes 2 matches. View detailed game results, player statistics, and match outcomes.",
  openGraph: {
    title: mostRecentGamesAppBase,
    description: "Browse the most recent COH2 matches with detailed statistics",
    url: "https://coh2stats.com/recent-matches",
  },
};

export default function RecentMatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

