import { Metadata } from "next";
import { commanderBase } from "../../../titles";

// Simple capitalize function for server component
function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ race: string }>;
}): Promise<Metadata> {
  const { race } = await params;
  const raceName = capitalize(race || "");
  const title = `${raceName} Commanders`;

  return {
    title: title,
    description: `Browse all ${raceName} commanders in Company of Heroes 2 with abilities and statistics`,
    openGraph: {
      title: `${commanderBase} - ${raceName}`,
      description: `Complete list of ${raceName} commanders`,
      url: `https://coh2stats.com/commanders/${race}`,
    },
  };
}

export default function CommandersRaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

