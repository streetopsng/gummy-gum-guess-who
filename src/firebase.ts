// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };
