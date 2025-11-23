// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_Me5dMd1sho5HPiFsw4jfJ8SRhUYBHio",
  authDomain: "event-schedule-9d614.firebaseapp.com",
  projectId: "event-schedule-9d614",
  storageBucket: "event-schedule-9d614.firebasestorage.app",
  messagingSenderId: "1012811002500",
  appId: "1:1012811002500:web:8e8d773e955a41ec4288d1",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
