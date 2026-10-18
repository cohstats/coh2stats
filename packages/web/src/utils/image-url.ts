/**
 * Routes an image from /public through the Next.js image optimizer (/_next/image).
 *
 * Files served straight from /public get `Cache-Control: public, max-age=0`, so Cloudflare
 * revalidates every single request against the origin. The optimizer responds with a long
 * cacheable max-age (images.minimumCacheTTL), so Cloudflare and the browser keep it.
 *
 * @param src Absolute path to a file in /public, e.g. /resources/map-images/foo_x64.webp
 * @param width Must be one of Next's images.imageSizes / deviceSizes. The image is never upscaled.
 */
const getOptimizedImageUrl = (src: string, width: 64 | 128 | 256 | 384): string => {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=85`;
};

export { getOptimizedImageUrl };
