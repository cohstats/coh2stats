import { config as firebaseConfig } from "firebase-functions";

export const isTestEnv = (): boolean => process.env.FUNCTIONS_EMULATOR === "true";

const config = firebaseConfig().env;

export const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;

export const hostingUrl =
  (config && (config["hosting_url"] || config["HOSTING_URL"])) || `https://${projectId}.web.app`;
