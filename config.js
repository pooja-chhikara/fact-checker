// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBd_KFJj5NI88_W6A867Z0wvQetHS7AI_U",
  authDomain: "fact-checker-58295.firebaseapp.com",
  databaseURL: "https://fact-checker-58295-default-rtdb.firebaseio.com",
  projectId: "fact-checker-58295",
  storageBucket: "fact-checker-58295.firebasestorage.app",
  messagingSenderId: "581140152279",
  appId: "1:581140152279:web:b2e60d961d64775de99592"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);