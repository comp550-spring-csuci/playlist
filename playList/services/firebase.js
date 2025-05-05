// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLEt4L86XH_1OiZ4Xo9xXQ-zvrw-GeHbc",
  authDomain: "playlist-bb15e.firebaseapp.com",
  projectId: "playlist-bb15e",
  storageBucket: "playlist-bb15e.firebasestorage.app",
  messagingSenderId: "262236138318",
  appId: "1:262236138318:web:820431dc15a35fd7730c1f",
  measurementId: "G-YSCLZPQ50W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);