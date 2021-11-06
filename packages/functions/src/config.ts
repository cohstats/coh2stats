import { config as firebaseConfig } from "firebase-functions";
const config = firebaseConfig().env;

export const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;

export const isTestEnv = (): boolean => process.env.FUNCTIONS_EMULATOR === "true";
export const steam_api_key = config["steam_api_key"] || "";

export const allowedCrossOrigins = [
  "http://localhost:3000",
  "https://coh2stats.com",
  "https://coh2-ladders-dev.web.app",
];
