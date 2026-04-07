import { Metadata } from "next";
import { liveMatchesAppBase } from "../../titles";

export const metadata: Metadata = {
  title: liveMatchesAppBase.replace("COH2 ", ""),
  description:
    "View live Company of Heroes 2 games in progress. See current matches with player ranks, factions, and game modes in real-time.",
  openGraph: {
    title: liveMatchesAppBase,
    description: "View live COH2 games in progress with player ranks",
    url: "https://coh2stats.com/live-matches",
  },
};

export default function LiveMatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
