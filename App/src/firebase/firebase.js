import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2xotAhRGnQISFM48YHb79UjgifPEyWfY",
  authDomain: "ai-coding-interviewer.firebaseapp.com",
  projectId: "ai-coding-interviewer",
  storageBucket: "ai-coding-interviewer.firebasestorage.app",
  messagingSenderId: "852060828702",
  appId: "1:852060828702:web:b3c46dae4e12d598cf2a0f",
  measurementId: "G-R8Z1ET42FB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }
