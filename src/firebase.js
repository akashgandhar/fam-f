import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// envs
const firebaseConfig = {
  apiKey: "AIzaSyDcFHNFS19O3OSfC-NxA-ubf_2ka2mEVVw",
  authDomain: "mixtiles-4339d.firebaseapp.com",
  projectId: "mixtiles-4339d",
  storageBucket: "mixtiles-4339d.appspot.com",
  messagingSenderId: "323393184550",
  appId: "1:323393184550:web:48e3efabd549884a5797e7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

// connectAuthEmulator(auth, "http://89.116.34.234:9099");

// // Point to the Storage emulator running on localhost.
// connectStorageEmulator(storage, "127.0.0.1", 9199);

// connectFirestoreEmulator(db, "127.0.0.1", 8080);