import React from "react";
import { getAnalyzedMatches } from "@/firebase/firebase-server";
import { getRedditPosts } from "@/utils/reddit";
import { HomeContent } from "./_components/home-content";

// Revalidate the page every hour (3600 seconds)
export const revalidate = 3600;

export default async function Home() {
  // Fetch data server-side
  const [analyzedMatches, redditPosts] = await Promise.all([
    getAnalyzedMatches(),
    getRedditPosts(),
  ]);

  return <HomeContent analyzedMatches={analyzedMatches} redditPosts={redditPosts} />;
}
