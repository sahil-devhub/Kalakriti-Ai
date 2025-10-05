// Import the initializeApp function ONCE at the top.
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration, copied from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyCQ9PCs3kfTOG5rj3xuvQJe4RHTNU2m7AU",
  authDomain: "kalakriti-ai-15cf1.firebaseapp.com",
  projectId: "kalakriti-ai-15cf1",
  storageBucket: "kalakriti-ai-15cf1.firebasestorage.app",
  messagingSenderId: "647051217040",
  appId: "1:647051217040:web:12f073fe69f9ed17f03015",
  measurementId: "G-JF51T6F00Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized app object for use in other parts of your application.
export default app;
