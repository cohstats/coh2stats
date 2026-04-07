import { Metadata } from "next";
import { fetchPlayerCardMetadata } from "./actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ steamid: string }>;
}): Promise<Metadata> {
  const { steamid: steamidFull } = await params;
  const steamid = steamidFull?.split("-")[0] || "";

  // Fetch player data to get the name
  try {
    const data = await fetchPlayerCardMetadata(steamid);
    const playerName = data?.playerName || "Unknown Player";

    return {
      title: `${playerName} - Player Card`,
      description: `View ${playerName}'s Company of Heroes 2 player statistics, rankings, and match history`,
      openGraph: {
        title: `${playerName} - Player Card | COH2 Stats`,
        description: `View ${playerName}'s statistics and rankings`,
        url: `https://coh2stats.com/players/${steamidFull}`,
      },
    };
  } catch (error) {
    return {
      title: "Player Card",
      description: "View player statistics and rankings",
    };
  }
}

export default function PlayerCardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
