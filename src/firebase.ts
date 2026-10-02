import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3kVdN-uXwvvR8pKHbsr_lfCZfvKFEfDs",
  authDomain: "guess-who-69904.firebaseapp.com",
  databaseURL: "https://guess-who-69904-default-rtdb.firebaseio.com",
  projectId: "guess-who-69904",
  storageBucket: "guess-who-69904.firebasestorage.app",
  messagingSenderId: "152783054522",
  appId: "1:152783054522:web:90e25ea5d3f1b496a58483",
  measurementId: "G-QKCYVVTXX8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const auth = getAuth(app);

// Settles once signed in, or after a failure/timeout so the app still runs while rules are open.
export const authReady = Promise.race([
  auth.authStateReady().then(async () => {
    if (!auth.currentUser) await signInAnonymously(auth);
  }),
  new Promise((resolve) => setTimeout(resolve, 8000)),
]).catch((err) => console.warn('Firebase anonymous sign-in failed', err));

export { app, analytics, database };
