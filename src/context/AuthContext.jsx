import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/auth.js';

const AuthContext = createContext(null);

/**
 * Holds the current user and exposes auth actions. Mirrors the shape we'll
 * get from Firebase's onAuthStateChanged so components don't need to change
 * when we switch over.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  // Subscribe to Firebase auth state. Fires immediately with the current
  // user (or null) and again on every sign-in / sign-out.
  useEffect(() => {
    const unsubscribe = authService.observe((u) => {
      setUser(u);
      setInitialising(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initialising,
      isAuthenticated: Boolean(user),
      async login(email, password) {
        const u = await authService.signInWithEmail(email, password);
        setUser(u);
        return u;
      },
      async signup(payload) {
        const u = await authService.signUpWithEmail(payload);
        setUser(u);
        return u;
      },
      async loginWithGoogle() {
        const u = await authService.signInWithGoogle();
        setUser(u);
        return u;
      },
      async logout() {
        await authService.signOut();
        setUser(null);
      },
      async updateProfile(patch) {
        const u = await authService.updateProfile(patch);
        setUser(u);
        return u;
      },
    }),
    [user, initialising]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
