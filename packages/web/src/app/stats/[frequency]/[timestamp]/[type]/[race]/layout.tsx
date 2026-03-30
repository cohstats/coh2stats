import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats & Charts",
  description:
    "Company of Heroes 2 game statistics, win rates, faction analysis, and commander usage",
  openGraph: {
    title: "COH2 Stats & Charts",
    description: "Detailed statistics and analysis of Company of Heroes 2 matches",
    url: "https://coh2stats.com/stats",
  },
};

export default function OldStatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

