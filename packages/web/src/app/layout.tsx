import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import { AppLayout } from "./app-layout";

export const metadata: Metadata = {
  title: {
    template: "%s | COH2 Stats",
    default: "COH2 Game Statistics",
  },
  description:
    "Company of Heroes 2 Match Statistics, Player Cards, Recent Matches, Leaderboards and Charts about most used Win rates, Commanders, Intel Bulletins and maps based on the real-time data from the recent games.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coh2stats.com",
    siteName: "COH2 Stats",
    title: "COH2 Game Statistics",
    description:
      "Company of Heroes 2 Match Statistics, Player Cards, Recent Matches, Leaderboards and Charts about most used Win rates, Commanders, Intel Bulletins and maps based on the real-time data from the recent games.",
    images: [
      {
        url: "https://coh2stats.com/logo/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "COH2 Stats Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "COH2 Game Statistics",
    description:
      "Company of Heroes 2 Match Statistics, Player Cards, Recent Matches, Leaderboards and Charts about most used Win rates, Commanders, Intel Bulletins and maps based on the real-time data from the recent games.",
    images: ["https://coh2stats.com/logo/android-icon-192x192.png"],
  },
  icons: {
    icon: [
      { url: "/logo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    apple: [
      { url: "/logo/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/logo/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/logo/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/logo/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/logo/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/logo/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/logo/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/logo/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/logo/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [{ url: "/logo/android-icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#001529",
    "msapplication-TileImage": "/logo/ms-icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#001529" />
        <link type="application/opensearchdescription+xml" rel="search" href="/opensearch.xml" />
      </head>
      <body>
        <AntdRegistry>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
