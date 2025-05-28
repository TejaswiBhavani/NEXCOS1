import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBqXQ677Zgb7OVXdRHeRGqlwY7AJWVZdg4",
  authDomain: "nexcos-8513d.firebaseapp.com",
  projectId: "nexcos-8513d",
  storageBucket: "nexcos-8513d.firebasestorage.app",
  messagingSenderId: "209476458424",
  appId: "1:209476458424:web:85a87ee90b914da385e14d",
  measurementId: "G-Q8DWZNWHXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;