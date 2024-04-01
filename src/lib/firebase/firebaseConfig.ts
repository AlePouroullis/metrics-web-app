// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr7OW8lMAUjCjnFKqb6wR9ZVAlitUzLSc",
  authDomain: "grit-ai.firebaseapp.com",
  projectId: "grit-ai",
  storageBucket: "grit-ai.appspot.com",
  messagingSenderId: "385755140237",
  appId: "1:385755140237:web:57fdc36dd676da79e7d2c4",
  measurementId: "G-F2CMLWB1R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { auth, provider };