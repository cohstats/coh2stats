import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Data",
  description:
    "Access open COH2 match data. Download daily JSON files with complete match statistics for analysis, research, and third-party applications.",
  openGraph: {
    title: "COH2 Stats - Open Data",
    description: "Download open COH2 match data for analysis and research",
    url: "https://coh2stats.com/other/open-data",
  },
};

export default function OpenDataLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

