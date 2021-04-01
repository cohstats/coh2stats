import { config as firebaseConfig } from "firebase-functions";
const config = firebaseConfig().env;

export const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;

export const isTestEnv = (): boolean => process.env.FUNCTIONS_EMULATOR === "true";
export const steam_api_key = config["steam_api_key"] || "";
