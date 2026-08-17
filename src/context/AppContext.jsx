import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext(null);

const SAVED_KEY = 'mediquick.saved';
const COMPARE_KEY = 'mediquick.compare';

const emptySaved = { hospital: [], doctor: [], treatment: [] };
const emptyCompare = { hospital: [], doctor: [], treatment: [] };

const MAX_COMPARE = 4;

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

/**
 * App-wide client state: saved (wishlist) items and the compare selection.
 * Persisted to localStorage so it survives reloads. When a user logs in we
 * merge in the ids stored on their profile.
 */
export function AppProvider({ children }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(() => readStore(SAVED_KEY, emptySaved));
  const [compare, setCompare] = useState(() =>
    readStore(COMPARE_KEY, emptyCompare)
  );

  // Seed saved items from the user's profile the first time they appear.
  useEffect(() => {
    if (!user) return;
    setSaved((prev) => ({
      hospital: unique([...(prev.hospital || []), ...(user.savedHospitalIds || [])]),
      doctor: unique([...(prev.doctor || []), ...(user.savedDoctorIds || [])]),
      treatment: unique([
        ...(prev.treatment || []),
        ...(user.savedTreatmentIds || []),
      ]),
    }));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare]);

  const isSaved = useCallback(
    (type, id) => (saved[type] || []).includes(id),
    [saved]
  );

  const toggleSaved = useCallback((type, id) => {
    let added = false;
    setSaved((prev) => {
      const list = prev[type] || [];
      const exists = list.includes(id);
      added = !exists;
      return {
        ...prev,
        [type]: exists ? list.filter((x) => x !== id) : [...list, id],
      };
    });
    return added; // caller uses this to show the right toast
  }, []);

  const inCompare = useCallback(
    (type, id) => (compare[type] || []).includes(id),
    [compare]
  );

  const toggleCompare = useCallback((type, id) => {
    let result = { added: false, full: false };
    setCompare((prev) => {
      const list = prev[type] || [];
      if (list.includes(id)) {
        return { ...prev, [type]: list.filter((x) => x !== id) };
      }
      if (list.length >= MAX_COMPARE) {
        result.full = true;
        return prev;
      }
      result.added = true;
      return { ...prev, [type]: [...list, id] };
    });
    return result;
  }, []);

  const clearCompare = useCallback((type) => {
    setCompare((prev) => ({ ...prev, [type]: [] }));
  }, []);

  const savedCount = useMemo(
    () =>
      (saved.hospital?.length || 0) +
      (saved.doctor?.length || 0) +
      (saved.treatment?.length || 0),
    [saved]
  );

  const compareCount = useMemo(
    () =>
      (compare.hospital?.length || 0) +
      (compare.doctor?.length || 0) +
      (compare.treatment?.length || 0),
    [compare]
  );

  const value = useMemo(
    () => ({
      saved,
      compare,
      isSaved,
      toggleSaved,
      inCompare,
      toggleCompare,
      clearCompare,
      savedCount,
      compareCount,
      MAX_COMPARE,
    }),
    [
      saved,
      compare,
      isSaved,
      toggleSaved,
      inCompare,
      toggleCompare,
      clearCompare,
      savedCount,
      compareCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
