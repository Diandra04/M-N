import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGRT6GgaAWZNzoVF7pSOGfVtLQegvhCAs',
  // Using the site's own custom domain (rather than the default
  // *.firebaseapp.com) keeps the Google sign-in handshake same-origin.
  // Cross-origin storage partitioning in Safari (especially inside embedded
  // browsers like the one Messages/Mail open) otherwise causes
  // "missing initial state" sign-in failures.
  authDomain: 'mandn.site',
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

// Without this, Firestore keeps retrying its realtime "Listen" stream every
// few seconds while the browser has no internet, flooding the console with
// ERR_INTERNET_DISCONNECTED/transport-errored noise. Pausing the stream on
// 'offline' and resuming on 'online' stops the retry spam.
if (typeof window !== 'undefined') {
  window.addEventListener('offline', () => disableNetwork(db).catch(() => {}));
  window.addEventListener('online', () => enableNetwork(db).catch(() => {}));
}
