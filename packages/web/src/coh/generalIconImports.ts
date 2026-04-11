/**
 * Helper file for importing general icons as static assets.
 * This allows Next.js to optimize and hash the images automatically.
 */

import { StaticImageData } from "next/image";

// Import all general icons
import wermachtIcon from "../../public/resources/generalIcons/wermacht.png";
import wermachtSmallIcon from "../../public/resources/generalIcons/wermacht_small.png";
import wgermanIcon from "../../public/resources/generalIcons/wgerman.png";
import wgermanSmallIcon from "../../public/resources/generalIcons/wgerman_small.png";
import sovietIcon from "../../public/resources/generalIcons/soviet.png";
import sovietSmallIcon from "../../public/resources/generalIcons/soviet_small.png";
import britishIcon from "../../public/resources/generalIcons/british.png";
import britishSmallIcon from "../../public/resources/generalIcons/british_small.png";
import usfIcon from "../../public/resources/generalIcons/usf.png";
import usfSmallIcon from "../../public/resources/generalIcons/usf_small.png";
import relicIcon from "../../public/resources/generalIcons/relic_icon.png";
import multiplayerAICalloutIcon from "../../public/resources/generalIcons/Multiplayer_AICallout.png";
import multiplayerGearsIcon from "../../public/resources/generalIcons/Multiplayer_Gears.png";
import fuelIcon from "../../public/resources/generalIcons/fuel.png";
import mpIcon from "../../public/resources/generalIcons/mp.png";
import munIcon from "../../public/resources/generalIcons/mun.png";
import aefAIIcon from "../../public/resources/generalIcons/Icons_factions_faction_aef_ai_32.png";
import britishAIIcon from "../../public/resources/generalIcons/Icons_factions_faction_british_ai_32.png";
import germanAIIcon from "../../public/resources/generalIcons/Icons_factions_faction_german_ai_32.png";
import sovietAIIcon from "../../public/resources/generalIcons/Icons_factions_faction_soviet_ai_32.png";
import westGermanAIIcon from "../../public/resources/generalIcons/Icons_factions_faction_west_german_ai_32.png";

// Create mapping for normal size icons
const generalIconMap: Record<string, StaticImageData> = {
  wermacht: wermachtIcon,
  wehrmacht: wermachtIcon, // Handle the typo variant
  wgerman: wgermanIcon,
  soviet: sovietIcon,
  british: britishIcon,
  usf: usfIcon,
  relic_icon: relicIcon,
  Multiplayer_AICallout: multiplayerAICalloutIcon,
  Multiplayer_Gears: multiplayerGearsIcon,
  fuel: fuelIcon,
  mp: mpIcon,
  mun: munIcon,
  Icons_factions_faction_aef_ai_32: aefAIIcon,
  Icons_factions_faction_british_ai_32: britishAIIcon,
  Icons_factions_faction_german_ai_32: germanAIIcon,
  Icons_factions_faction_soviet_ai_32: sovietAIIcon,
  Icons_factions_faction_west_german_ai_32: westGermanAIIcon,
};

// Create mapping for small size icons
const generalIconSmallMap: Record<string, StaticImageData> = {
  wermacht: wermachtSmallIcon,
  wehrmacht: wermachtSmallIcon, // Handle the typo variant
  wgerman: wgermanSmallIcon,
  soviet: sovietSmallIcon,
  british: britishSmallIcon,
  usf: usfSmallIcon,
};

/**
 * Get the imported general icon for use with Next.js Image component.
 * This provides automatic image optimization and hashing.
 *
 * @param name - The icon name (e.g., "wgerman", "soviet")
 * @param size - "normal" for regular size, "small" for 32px version
 * @returns StaticImageData object for Next.js Image component, or string path as fallback
 */
export const getGeneralIconImport = (
  name: string,
  size: "normal" | "small" = "normal",
): StaticImageData | string => {
  // We have typo in the system and DB, sometimes it's wermacht and sometimes wehrmacht
  if (name === "wehrmacht") {
    name = "wermacht";
  }

  if (size === "small") {
    const icon = generalIconSmallMap[name];
    if (icon) return icon;
    // Fallback to path-based approach if icon not found
    return `/resources/generalIcons/${name}_small.png`;
  } else {
    const icon = generalIconMap[name];
    if (icon) return icon;
    // Fallback to path-based approach if icon not found
    return `/resources/generalIcons/${name}.png`;
  }
};

// Export the icon maps for direct use if needed
export { generalIconMap, generalIconSmallMap };

// Export individual icons for direct imports
export {
  wermachtIcon,
  wermachtSmallIcon,
  wgermanIcon,
  wgermanSmallIcon,
  sovietIcon,
  sovietSmallIcon,
  britishIcon,
  britishSmallIcon,
  usfIcon,
  usfSmallIcon,
  relicIcon,
  multiplayerAICalloutIcon,
  multiplayerGearsIcon,
  fuelIcon,
  mpIcon,
  munIcon,
};
