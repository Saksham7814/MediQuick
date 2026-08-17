/**
 * Single switch that decides where data comes from.
 * Keep this `false` until Firebase is fully configured in `lib/firebase.js`.
 */
export const USE_FIREBASE = false;

// Simulated network latency (ms) for the mock service, so the UI exercises
// its real loading states. Set to 0 for instant responses during development.
export const MOCK_LATENCY = 450;
