// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2xotAhRGnQISFM48YHb79UjgifPEyWfY",
  authDomain: "ai-coding-interviewer.firebaseapp.com",
  projectId: "ai-coding-interviewer",
  storageBucket: "ai-coding-interviewer.firebasestorage.app",
  messagingSenderId: "852060828702",
  appId: "1:852060828702:web:b3c46dae4e12d598cf2a0f",
  measurementId: "G-R8Z1ET42FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {app, auth}
