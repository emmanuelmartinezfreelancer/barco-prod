// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg_mxF7ta4OadVvcuSl-Zf7_e2v3qHIkA",
  authDomain: "bienal-barco-02.firebaseapp.com",
  projectId: "bienal-barco-02",
  storageBucket: "bienal-barco-02.appspot.com",
  messagingSenderId: "393214060566",
  appId: "1:393214060566:web:cc9e1605af4e92b3d2ad37",
  measurementId: "G-9YN22PNQDD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);