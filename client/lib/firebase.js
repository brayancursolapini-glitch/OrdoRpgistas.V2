
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = { 
  apiKey : "AIzaSyDXImLaFAlPE3xKRK1NkF6PV1Qh-XGvnME" , 
  authDomain : "ordo-rpgistas.firebaseapp.com" , 
  projectId : "ordo-rpgistas" , 
  storageBucket : "ordo-rpgistas.firebasestorage.app" , 
  messagingSenderId : "907369481012" , 
  appId : "1:907369481012:web:bb7258afa1bc45dcad1b61" 
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
