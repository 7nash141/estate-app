// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBXvWVB18vHD0fgTKAROA6TQ1ely75yWY",
    authDomain: "mern-app-36d42.firebaseapp.com",
    projectId: "mern-app-36d42",
    storageBucket: "mern-app-36d42.appspot.com",
    messagingSenderId: "217742311520",
    appId: "1:217742311520:web:ce9f2552855a99f99e0305"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);