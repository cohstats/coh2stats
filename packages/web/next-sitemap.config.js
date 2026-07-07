/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://coh2stats.com",
  generateRobotsTxt: false, // We already have robots.txt
  sitemapSize: 10000,
  generateIndexSitemap: false, // Single sitemap file
  exclude: [],
  changefreq: "weekly",
  priority: 0.7,
  additionalPaths: async (config) => {
    const result = [];

    // Add some famous players for SEO (these are dynamic routes)
    const famousPlayers = [
      "/players/76561197984317656-HelpingHans",
      "/players/76561198018614046-Isildur",
      "/players/76561197982704567-Luvnest",
    ];

    for (const path of famousPlayers) {
      result.push(await config.transform(config, path));
    }

    return result;
  },
};
