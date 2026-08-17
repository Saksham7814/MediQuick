/**
 * Authentication service — backed by Firebase Auth + Firestore.
 *
 * The public surface (signInWithEmail, signUpWithEmail, signInWithGoogle,
 * signOut, updateProfile, observe) is intentionally small so `AuthContext`
 * never talks to Firebase directly. Each signed-in user has a profile document
 * at `users/{uid}` that holds the fields the UI reads (name, phone, country,
 * settings, …).
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase.js';

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200&q=80';

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  preferredCurrency: 'INR',
};

/** Minimal user object derived purely from the Firebase Auth record. */
function fallbackUser(fbUser) {
  return {
    id: fbUser.uid,
    fullName: fbUser.displayName || 'Patient',
    email: fbUser.email || '',
    phone: '',
    country: '',
    photoURL: fbUser.photoURL || DEFAULT_PHOTO,
    memberSince: new Date().toISOString().slice(0, 10),
    settings: DEFAULT_SETTINGS,
  };
}

/**
 * Read-or-create the profile. Used by the explicit sign-in / sign-up / Google
 * flows, which are the only places allowed to create the `users/{uid}` doc.
 */
async function resolveUser(fbUser, extra = {}) {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { id: fbUser.uid, ...snap.data() };
  }

  const profile = {
    fullName: extra.fullName || fbUser.displayName || 'Patient',
    email: fbUser.email || '',
    phone: extra.phone || fbUser.phoneNumber || '',
    country: extra.country || '',
    photoURL: fbUser.photoURL || DEFAULT_PHOTO,
    city: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    memberSince: new Date().toISOString().slice(0, 10),
    settings: DEFAULT_SETTINGS,
    provider: extra.provider || 'password',
  };
  await setDoc(ref, profile);
  return { id: fbUser.uid, ...profile };
}

/**
 * Subscribe to auth state. Calls `callback(user | null)` immediately with the
 * current state and on every change. Returns an unsubscribe function.
 *
 * This listener only READS the profile — the explicit auth flows are
 * responsible for creating it, so the listener can never race and overwrite
 * freshly-entered sign-up data.
 */
export function observe(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    try {
      const ref = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(ref);
      callback(snap.exists() ? { id: fbUser.uid, ...snap.data() } : fallbackUser(fbUser));
    } catch (err) {
      // If Firestore is unreachable (e.g. rules), fall back so the app still works.
      console.warn('Could not load user profile:', err);
      callback(fallbackUser(fbUser));
    }
  });
}

export async function signInWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return await resolveUser(cred.user);
  } catch (err) {
    throw new AuthError(friendlyMessage(err.code), err.code);
  }
}

export async function signUpWithEmail({ fullName, email, password, country }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await fbUpdateProfile(cred.user, { displayName: fullName });
    }
    return await resolveUser(cred.user, { fullName, country, provider: 'password' });
  } catch (err) {
    throw new AuthError(friendlyMessage(err.code), err.code);
  }
}

export async function signInWithGoogle() {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return await resolveUser(cred.user, { provider: 'google' });
  } catch (err) {
    throw new AuthError(friendlyMessage(err.code), err.code);
  }
}

export async function signOut() {
  await fbSignOut(auth);
}

export async function updateProfile(patch) {
  const current = auth.currentUser;
  if (!current) throw new AuthError('You are not signed in.', 'auth/no-user');

  const ref = doc(db, 'users', current.uid);
  await updateDoc(ref, patch);

  // Keep the Firebase Auth display name / photo in sync when relevant.
  const authPatch = {};
  if (patch.fullName) authPatch.displayName = patch.fullName;
  if (patch.photoURL) authPatch.photoURL = patch.photoURL;
  if (Object.keys(authPatch).length) await fbUpdateProfile(current, authPatch);

  const snap = await getDoc(ref);
  return { id: current.uid, ...snap.data() };
}

export class AuthError extends Error {
  constructor(message, code = 'auth/error') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/** Turns Firebase error codes into friendly, user-facing messages. */
function friendlyMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Try logging in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups and retry.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method isn’t enabled yet. Enable it in the Firebase console.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
