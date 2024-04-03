// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ebde6.firebaseapp.com",
  projectId: "mern-blog-ebde6",
  storageBucket: "mern-blog-ebde6.appspot.com",
  messagingSenderId: "776279654490",
  appId: "1:776279654490:web:6bd50695c026908cc89863",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
