import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Search",
    description: "Search for Company of Heroes 2 players, commanders, and intel bulletins",
    openGraph: {
      title: "Search | COH2 Stats",
      description: "Search for COH2 players, commanders, and intel bulletins",
      url: "https://coh2stats.com/search",
    },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
