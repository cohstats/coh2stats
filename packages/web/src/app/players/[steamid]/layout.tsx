import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ steamid: string }>;
}): Promise<Metadata> {
  const { steamid: steamidFull } = await params;
  const steamid = steamidFull?.split("-")[0] || "";

  // Fetch player data to get the name
  try {
    const response = await fetch(
      `https://coh2stats.com/api/getPlayerCard?steamid=${steamid}`,
      { next: { revalidate: 3600 } },
    );
    const data = await response.json();
    const playerName = data?.steamProfile?.[steamid]?.name || "Unknown Player";

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

