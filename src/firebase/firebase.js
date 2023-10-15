import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlGCDFdiE-cxjQqvVWwfCjB7_VkgWVVQc",
  authDomain: "eshoppy-4d51a.firebaseapp.com",
  projectId: "eshoppy-4d51a",
  storageBucket: "eshoppy-4d51a.appspot.com",
  messagingSenderId: "179941487275",
  appId: "1:179941487275:web:c5f530f31fcc43b38d3dee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth();

export default db;
export {app, auth};

