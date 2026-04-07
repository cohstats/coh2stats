import { Metadata } from "next";
import { aboutBase } from "../../titles";

export const metadata: Metadata = {
  title: aboutBase.replace("COH2 ", ""),
  description:
    "Learn about COH2 Stats data collection, crawler process, top 200 analysis, and how we track Company of Heroes 2 matches. Open source project information and contribution guidelines.",
  openGraph: {
    title: aboutBase,
    description: "Learn about COH2 Stats data collection and analysis",
    url: "https://coh2stats.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
