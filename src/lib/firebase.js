/**
 * Firebase initialisation.
 *
 * Note: a Firebase *web* config is not a secret — it is shipped to every
 * browser that loads the app, and access is controlled by Firebase Security
 * Rules, not by hiding these values. It is therefore safe to keep here so the
 * repository runs anywhere without extra setup. (You can still move these into
 * a `.env.local` file using the VITE_FIREBASE_* names if you prefer.)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyDA7Yi-PDci-LQcbe7rn1rC1UAfv8SHkTc',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'medi-quickk.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'medi-quickk',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'medi-quickk.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '323286209523',
  appId: env.VITE_FIREBASE_APP_ID || '1:323286209523:web:3ac0822e8eb5e790b0f886',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-R7GVRM76QP',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics only runs in supported browser environments — guard it so it never
// throws during development or in unsupported contexts.
export let analytics = null;
isSupported()
  .then((ok) => {
    if (ok) analytics = getAnalytics(app);
  })
  .catch(() => {
    /* analytics unavailable — safe to ignore */
  });
