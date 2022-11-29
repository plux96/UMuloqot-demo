// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSKA4ibuJDtAZeaAs8Ig1Cf_s9GTXGONw",
  authDomain: "umuloqot.firebaseapp.com",
  projectId: "umuloqot",
  storageBucket: "umuloqot.appspot.com",
  messagingSenderId: "536760994088",
  appId: "1:536760994088:web:a275a305a7145fe957a81d",
  measurementId: "G-J7R65MH1LE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
