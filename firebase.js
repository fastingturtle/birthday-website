// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtinuv4EElWwJbsoht9kMEvrGh_Pb4O3g",
  authDomain: "birthday-website-330b2.firebaseapp.com",
  projectId: "birthday-website-330b2",
  storageBucket: "birthday-website-330b2.firebasestorage.app",
  messagingSenderId: "965865195565",
  appId: "1:965865195565:web:f966b83072f720df4b50a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };