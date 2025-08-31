// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "medimind-ai-7nctq",
  "appId": "1:2916352478:web:b10250e228ba9e787f5d4f",
  "storageBucket": "medimind-ai-7nctq.firebasestorage.app",
  "apiKey": "AIzaSyCwGLHWUaqR6N4oMPlya6ZP0kmHZUh4FII",
  "authDomain": "medimind-ai-7nctq.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "2916352478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
