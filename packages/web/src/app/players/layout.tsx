import { Metadata } from "next";
import { playerCardBase } from "../../titles";

export const metadata: Metadata = {
  title: playerCardBase.replace("COH2 ", ""),
  description:
    "Search for Company of Heroes 2 players and view detailed statistics, rankings, and match history",
  openGraph: {
    title: playerCardBase,
    description: "Search for COH2 players and view their statistics",
    url: "https://coh2stats.com/players",
  },
};

export default function PlayersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
