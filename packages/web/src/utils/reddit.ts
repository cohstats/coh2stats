export interface RedditPost {
  data: {
    title: string;
    ups: number;
    author: string;
    url_overridden_by_dest: string;
    created: number;
    permalink: string;
  };
}

export async function getRedditPosts(): Promise<RedditPost[]> {
  console.log("[Reddit] Fetching Reddit posts");
  try {
    // "https://www.reddit.com/r/CompanyOfHeroes/top.json?limit=100&t=month"
    const res = await fetch("https://coh2stats.com/api/redditCF", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Failed to fetch Reddit posts:", res.status);
      throw new Error(`Reddit API failed: ${res.status}`);
    }

    const resData = await res.json();
    const requiredData = resData?.data?.children
      .filter((e: any) => `${e?.data?.link_flair_text}`.includes("CoH2"))
      .slice(0, 15);

    return requiredData || [];
  } catch (error) {
    console.error("Failed to fetch Reddit posts:", error);
    return [];
  }
}
