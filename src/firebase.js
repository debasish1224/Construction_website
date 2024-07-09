import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCys_FpW-MjaUXAjSMzzSsDS_d4TBy4HXI",
    authDomain: "constructionwebsite-1c07e.firebaseapp.com",
    projectId: "constructionwebsite-1c07e",
    storageBucket: "constructionwebsite-1c07e.appspot.com",
    messagingSenderId: "969729617496",
    appId: "1:969729617496:web:0ed094186a0658ed82242d",
    measurementId: "G-64NXSK0J1F"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export const auth = getAuth(app);

export { db, storage,app };