// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9ElHKcaYRvx1cruRaCeCfBSinGQ_fPJ8",
  authDomain: "fitnessappweb.firebaseapp.com",
  projectId: "fitnessappweb",
  storageBucket: "fitnessappweb.appspot.com",
  messagingSenderId: "637823728576",
  appId: "1:637823728576:web:288b7b318e1d45220c6625",
  measurementId: "G-GNRK0E7N5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//export const auth = getAuth(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app); //Firestore database initilisation






  