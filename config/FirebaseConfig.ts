// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "tails-of-hope.firebaseapp.com",
    projectId: "tails-of-hope",
    storageBucket: "tails-of-hope.firebasestorage.app",
    messagingSenderId: "283042294573",
    appId: "1:283042294573:web:886250eb8abbbf7d21c1a4",
    measurementId: "G-EMBR0PR4B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);