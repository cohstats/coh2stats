import { Metadata } from "next";
import { bulletinsBase } from "../../titles";

export const metadata: Metadata = {
  title: bulletinsBase.replace("COH2 ", ""),
  description:
    "Browse all Intel Bulletins in Company of Heroes 2. Search and filter by faction to find bulletin descriptions, effects, and availability.",
  openGraph: {
    title: bulletinsBase,
    description: "Browse all Intel Bulletins in Company of Heroes 2",
    url: "https://coh2stats.com/bulletins",
  },
};

export default function BulletinsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
