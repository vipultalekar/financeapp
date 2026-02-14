import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAXv9mvaYOaozqpqBaR-fW8h-4TkhuSzD4",
    authDomain: "coach-finance-app.firebaseapp.com",
    projectId: "coach-finance-app",
    storageBucket: "coach-finance-app.firebasestorage.app",
    messagingSenderId: "654868034341",
    appId: "1:654868034341:web:d85b93ccc1b640ed10e0cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
