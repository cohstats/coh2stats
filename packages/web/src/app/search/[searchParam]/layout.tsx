import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ searchParam: string }>;
}): Promise<Metadata> {
  const { searchParam } = await params;
  const searchTerm = decodeURIComponent(searchParam || "");

  return {
    title: `Search: ${searchTerm}`,
    description: `Search results for "${searchTerm}" - Find Company of Heroes 2 players and statistics`,
    openGraph: {
      title: `Search: ${searchTerm} | COH2 Stats`,
      description: `Search results for "${searchTerm}"`,
      url: `https://coh2stats.com/search/${searchParam}`,
    },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

