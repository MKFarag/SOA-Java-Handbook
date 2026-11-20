import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration for Firebase project: mkf-soa-java
const firebaseConfig = {
  apiKey: "AIzaSyAneaicVmJ5xfXfTb-_YXOnX0bKlNzst3U",
  authDomain: "mkf-soa-java.firebaseapp.com",
  projectId: "mkf-soa-java",
  storageBucket: "mkf-soa-java.firebasestorage.app",
  messagingSenderId: "701467708110",
  appId: "1:701467708110:web:cf0012e1604fae45461e9f",
  measurementId: "G-4ZWJ56M6C5"
};

// Initialize Firebase app safely (prevents duplicate app initialization in Vite HMR)
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
