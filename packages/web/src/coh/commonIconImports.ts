/**
 * Helper file for importing common icons as static assets.
 * This allows Next.js to optimize and hash the images automatically.
 */

import { StaticImageData } from "next/image";

// Import common icons
import steamIcon from "../../public/resources/steam_icon.png";
import coh2Icon from "../../public/resources/coh2-icon-32.png";
import infoIcon from "../../public/resources/icons/info_i.webp";
import githubIcon from "../../public/resources/github-dark.png";
import discordIcon from "../../public/resources/discord-icon.svg";
import kofiLogo from "../../public/resources/kofi_s_logo_nolabel.webp";
import faviconIcon from "../../public/logo/favicon-32x32.png";

// Export individual icons for direct imports
export {
  steamIcon,
  coh2Icon,
  infoIcon,
  githubIcon,
  discordIcon,
  kofiLogo,
  faviconIcon,
};

// Create mapping for common icons
const commonIconMap: Record<string, StaticImageData> = {
  steam_icon: steamIcon,
  "coh2-icon-32": coh2Icon,
  info_i: infoIcon,
  "github-dark": githubIcon,
  "discord-icon": discordIcon,
  kofi_s_logo_nolabel: kofiLogo,
  "favicon-32x32": faviconIcon,
};

/**
 * Get the imported common icon for use with Next.js Image component.
 * This provides automatic image optimization and hashing.
 *
 * @param name - The icon name (e.g., "steam_icon", "coh2-icon-32")
 * @returns StaticImageData object for Next.js Image component
 */
export const getCommonIconImport = (name: string): StaticImageData | string => {
  const icon = commonIconMap[name];
  if (icon) return icon;
  // Return empty string as fallback - caller should handle
  return "";
};

export { commonIconMap };
