/**
 * Data service — the single boundary between the UI and the data source.
 *
 * Every page/component fetches through these functions and never imports mock
 * data directly. Today they resolve from in-memory mock arrays with a small
 * simulated latency; tomorrow the same functions will query Firestore. Because
 * the function signatures and return shapes are fixed, swapping the source is
 * invisible to the rest of the app.
 */

import { hospitals } from '../data/mock/hospitals.js';
import { doctors } from '../data/mock/doctors.js';
import { treatments } from '../data/mock/treatments.js';
import {
  appointments,
  consultationRequests,
  conversations,
  notifications,
} from '../data/mock/activity.js';
import { MOCK_LATENCY, USE_FIREBASE } from './config.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms = MOCK_LATENCY) => new Promise((r) => setTimeout(r, ms));

/** Deep-clone so callers can't mutate the mock "database". */
const clone = (value) => JSON.parse(JSON.stringify(value));

const byId = (list, id) => list.find((item) => item.id === id) || null;

// In-memory store for records created during a session (consultations).
// Seeded from the mock data; new submissions are prepended.
const store = {
  consultations: clone(consultationRequests),
};

// ---------------------------------------------------------------------------
// Hospitals
// ---------------------------------------------------------------------------

export async function getHospitals() {
  if (USE_FIREBASE) throw new Error('Firebase source not wired yet.');
  await delay();
  return clone(hospitals);
}

export async function getHospitalById(id) {
  await delay(300);
  const hospital = byId(hospitals, id);
  if (!hospital) throw new NotFoundError(`Hospital "${id}" not found.`);
  return clone(hospital);
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

export async function getDoctors() {
  await delay();
  return clone(doctors);
}

export async function getDoctorById(id) {
  await delay(300);
  const doctor = byId(doctors, id);
  if (!doctor) throw new NotFoundError(`Doctor "${id}" not found.`);
  return clone(doctor);
}

// ---------------------------------------------------------------------------
// Treatments
// ---------------------------------------------------------------------------

export async function getTreatments() {
  await delay();
  return clone(treatments);
}

export async function getTreatmentById(id) {
  await delay(300);
  const treatment = byId(treatments, id);
  if (!treatment) throw new NotFoundError(`Treatment "${id}" not found.`);
  return clone(treatment);
}

// ---------------------------------------------------------------------------
// Cross-entity lookups (used by detail pages)
// ---------------------------------------------------------------------------

export async function getHospitalsByIds(ids = []) {
  await delay(200);
  return clone(ids.map((id) => byId(hospitals, id)).filter(Boolean));
}

export async function getDoctorsByIds(ids = []) {
  await delay(200);
  return clone(ids.map((id) => byId(doctors, id)).filter(Boolean));
}

export async function getTreatmentsByIds(ids = []) {
  await delay(200);
  return clone(ids.map((id) => byId(treatments, id)).filter(Boolean));
}

// ---------------------------------------------------------------------------
// Appointments / consultations / messages / notifications
// ---------------------------------------------------------------------------

export async function getAppointments() {
  await delay();
  return clone(appointments);
}

export async function getConsultationRequests() {
  await delay();
  return clone(store.consultations);
}

export async function createConsultationRequest(payload) {
  await delay(700);
  const record = {
    ...payload,
    id: generateRequestId(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  store.consultations = [record, ...store.consultations];
  return clone(record);
}

export async function getConversations() {
  await delay();
  return clone(conversations);
}

export async function sendMessage(conversationId, text) {
  await delay(250);
  const conversation = byId(conversations, conversationId);
  if (!conversation) throw new NotFoundError('Conversation not found.');
  const message = {
    id: `m${conversation.messages.length + 1}-${Date.now()}`,
    from: 'patient',
    text,
    at: new Date().toISOString(),
  };
  conversation.messages.push(message);
  return clone(message);
}

export async function getNotifications() {
  await delay(350);
  return clone(notifications);
}

// ---------------------------------------------------------------------------
// Errors & id generation
// ---------------------------------------------------------------------------

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.code = 'not-found';
  }
}

function generateRequestId() {
  const hex = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `MED-${hex}`;
}
