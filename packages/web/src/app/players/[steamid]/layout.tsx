import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Card",
  description: "View player statistics and rankings",
};

export default function PlayerCardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
