import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBqXQ677Zgb7OVXdRHeRGqlwY7AJWVZdg4",
  authDomain: "nexcos-8513d.firebaseapp.com",
  projectId: "nexcos-8513d",
  storageBucket: "nexcos-8513d.firebasestorage.app",
  messagingSenderId: "209476458424",
  appId: "1:209476458424:web:7c64f19bd9b806c385e14d",
  measurementId: "G-CC236GEV18"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;