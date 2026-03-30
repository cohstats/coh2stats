import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchID: string }>;
}): Promise<Metadata> {
  const { matchID } = await params;
  return {
    title: `Match ${matchID}`,
    description: `View detailed match statistics and analysis for match ${matchID}`,
    openGraph: {
      title: `Match ${matchID} | COH2 Stats`,
      description: "Detailed match statistics and player performance analysis",
      url: `https://coh2stats.com/matches/${matchID}`,
    },
  };
}

export default function MatchDetailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

