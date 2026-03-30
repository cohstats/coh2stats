import { Metadata } from "next";
import { mapStatsBase } from "../../titles";

export const metadata: Metadata = {
  title: mapStatsBase.replace("COH2 ", ""),
  description: "View Company of Heroes 2 map statistics and win rates for all maps and factions",
  openGraph: {
    title: mapStatsBase,
    description: "COH2 map statistics and win rates",
    url: "https://coh2stats.com/map-stats",
  },
};

export default function MapStatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

