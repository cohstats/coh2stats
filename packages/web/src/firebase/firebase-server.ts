import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import config from "../config";

// Initialize Firebase for server-side operations
// We use the client SDK as it works on both client and server in Next.js
let firebaseApp: any = undefined;

function initializeFirebaseServer() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const apps = getApps();
  if (apps.length > 0) {
    firebaseApp = apps[0];
    return firebaseApp;
  }

  try {
    const firebaseConfig = config.firebase();
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } catch (error) {
    console.error("Failed to initialize Firebase on server:", error);
    throw error;
  }
}

export async function getAnalyzedMatches(): Promise<string> {
  try {
    const app = initializeFirebaseServer();
    const db = getFirestore(app);
    const docRef = doc(db, "stats", "global");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.analyzedMatches?.toLocaleString() || "12,106,009";
    }
    return "12,106,009";
  } catch (error) {
    console.error("Failed to get analyzed matches:", error);
    return "12,106,009";
  }
}
