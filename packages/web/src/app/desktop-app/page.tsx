// @ts-nocheck
import React from "react";
import { DesktopAppContent } from "./_components/desktop-app-content";

// Cache for 60 minutes (3600 seconds)
export const revalidate = 3600;

async function getDownloadCount(): Promise<number | undefined> {
  try {
    const url = "https://api.github.com/repositories/326416762/releases?page=1&per_page=100";
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // 60 minutes cache
    });

    if (!response.ok) {
      console.error("Failed to fetch releases:", response.status);
      return undefined;
    }

    const data = await response.json();
    let sum = 0;

    data.forEach((item: any) => {
      if (item.assets.length > 0 && item.assets[0].download_count > 0) {
        sum += item.assets[0].download_count;
      }
    });

    return sum;
  } catch (e) {
    console.error("Error fetching download count:", e);
    return undefined;
  }
}

export default async function DesktopApp() {
  const downloadCount = await getDownloadCount();

  return <DesktopAppContent downloadCount={downloadCount} />;
}
