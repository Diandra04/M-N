import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGRT6GgaAWZNzoVF7pSOGfVtLQegvhCAs',
  authDomain: 'manzi-nikita-wedding.firebaseapp.com',
  projectId: 'manzi-nikita-wedding',
  storageBucket: 'manzi-nikita-wedding.firebasestorage.app',
  messagingSenderId: '656095374052',
  appId: '1:656095374052:web:232ea8e07028027ec2daf1',
  measurementId: 'G-J17BQFTYWS',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
