// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVZeouqQgCQH2DF4GHirgDQHc0UuO8PNM",
    authDomain: "dyipspot.firebaseapp.com",
    projectId: "dyipspot",
    storageBucket: "dyipspot.appspot.com",
    messagingSenderId: "620708014388",
    appId: "1:620708014388:web:aed291404a74bdbde21d61"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


