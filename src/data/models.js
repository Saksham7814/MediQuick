/**
 * Domain models for Mediquick.
 *
 * These JSDoc typedefs document the shape of every entity in the app so that
 * the mock data, the service layer and the UI all agree on one contract.
 * When we move from mock data to Firebase, the collection documents should
 * match these shapes 1:1 — nothing in the UI needs to change.
 *
 * Firestore collection map (planned):
 *   hospitals/{hospitalId}
 *   doctors/{doctorId}
 *   treatments/{treatmentId}
 *   users/{userId}
 *   users/{userId}/saved/{itemId}
 *   consultations/{consultationId}
 *   appointments/{appointmentId}
 *   conversations/{conversationId}
 *   conversations/{conversationId}/messages/{messageId}
 *   users/{userId}/notifications/{notificationId}
 */

/**
 * @typedef {Object} Money
 * @property {number} min   Lower estimate in the given currency.
 * @property {number} max   Upper estimate in the given currency.
 * @property {string} currency  ISO currency code, e.g. "INR".
 */

/**
 * @typedef {Object} Hospital
 * @property {string} id
 * @property {string} name
 * @property {'hospital'|'clinic'} type
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} tagline
 * @property {string} about
 * @property {string[]} images
 * @property {string} thumbnail
 * @property {number} rating
 * @property {number} reviewCount
 * @property {number} establishedYear
 * @property {number} beds
 * @property {string[]} specialties
 * @property {string[]} facilities
 * @property {string[]} accreditations
 * @property {string[]} treatmentIds
 * @property {string[]} doctorIds
 * @property {boolean} internationalSupport
 * @property {string[]} internationalServices
 * @property {Money} priceRange
 * @property {string[]} languages
 */

/**
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} name
 * @property {string} specialty
 * @property {string} image
 * @property {string} hospitalId
 * @property {string} city
 * @property {number} experienceYears
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string[]} qualifications
 * @property {string[]} languages
 * @property {string[]} expertise
 * @property {string[]} treatmentIds
 * @property {string} about
 * @property {'available'|'limited'|'waitlist'} availability
 * @property {string} nextAvailable   Human readable, e.g. "In 2 days".
 * @property {Money} consultationFee
 */

/**
 * @typedef {Object} Treatment
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} image
 * @property {string} shortDescription
 * @property {string} overview
 * @property {string} procedure
 * @property {Money} cost
 * @property {string} duration       Time in India, e.g. "5–7 days".
 * @property {string} hospitalStay
 * @property {string} recovery
 * @property {string[]} includes
 * @property {string[]} hospitalIds
 * @property {string[]} doctorIds
 * @property {number} popularity
 */

/**
 * @typedef {Object} ConsultationRequest
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} country
 * @property {string} treatmentId
 * @property {string} [hospitalId]
 * @property {string} [doctorId]
 * @property {string} preferredDate
 * @property {string} preferredTime
 * @property {string} message
 * @property {'Pending'|'Processing'|'Confirmed'|'Cancelled'} status
 * @property {string} createdAt   ISO timestamp.
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} doctorId
 * @property {string} hospitalId
 * @property {string} treatmentId
 * @property {string} date        ISO date.
 * @property {string} time
 * @property {'upcoming'|'past'|'cancelled'} status
 * @property {'video'|'in-person'} mode
 */

// Category taxonomy shared by treatments and specialty filters.
export const TREATMENT_CATEGORIES = [
  'Cardiology',
  'Orthopedics',
  'Dental',
  'Fertility',
  'Cosmetic',
  'Hair Restoration',
  'Oncology',
  'Neurology',
];

export const CONSULTATION_STATUSES = [
  'Pending',
  'Processing',
  'Confirmed',
  'Cancelled',
];
