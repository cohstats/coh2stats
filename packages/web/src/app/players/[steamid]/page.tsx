import React from "react";
import { Row } from "antd";
import { getPlayerCard } from "@/coh/coh2stats-api";
import { AlertBox } from "@/components/alert-box";
import { PlayerCardContent } from "./_components/player-card-content";

// Force SSR
export const dynamic = "force-dynamic";

interface PlayerCardPageProps {
  params: Promise<{ steamid: string }>;
  searchParams: Promise<{ view?: string }>;
}

const PlayerCardPage = async ({ params, searchParams }: PlayerCardPageProps) => {
  // Await params and searchParams (Next.js 15 pattern)
  const { steamid } = await params;
  const { view } = await searchParams;

  const steamidParsed = steamid?.split("-")[0] || "";

  // Fetch player card data server-side
  let data;
  let error: string | null = null;

  try {
    data = await getPlayerCard(steamidParsed);
  } catch (e) {
    let errorMessage = "Failed to load player card data";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error fetching player card:", e);
    error = errorMessage;
  }

  // Error state
  if (error || !data) {
    return (
      <Row justify="center" style={{ paddingTop: "10px" }}>
        <AlertBox
          type={"error"}
          message={"There was an error loading the player card. Try refreshing the page."}
          description={error || "Unknown error"}
        />
      </Row>
    );
  }

  // Render the client component with SSR data (no Suspense needed - data is already fetched)
  return (
    <PlayerCardContent
      initialData={data}
      steamidParsed={steamidParsed}
      initialTabView={view || "stats"}
    />
  );
};

export default PlayerCardPage;
