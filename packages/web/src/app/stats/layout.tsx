import { Metadata } from "next";
import { statsBase } from "../../titles";

export const metadata: Metadata = {
  title: statsBase.replace("COH2 ", ""),
  description: "Detailed statistics and charts for Company of Heroes 2 matches",
  openGraph: {
    title: statsBase,
    description: "Win rates, faction statistics, and game analysis",
    url: "https://coh2stats.com/stats",
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
