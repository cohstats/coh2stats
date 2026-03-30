import { Metadata } from "next";
import { regionsBase } from "../../../titles";

export const metadata: Metadata = {
  title: regionsBase.replace("COH2 ", ""),
  description:
    "Configure region settings for COH2 Stats. Access the site from China, Russia, and other regions with alternative data sources and endpoints.",
  openGraph: {
    title: regionsBase,
    description: "Configure region settings for accessing COH2 Stats",
    url: "https://coh2stats.com/about/regions",
  },
};

export default function RegionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
