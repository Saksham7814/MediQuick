/**
 * The signed-in patient. In production this comes from Firebase Auth +
 * a `users/{uid}` document. Kept here so the mock auth service and profile
 * page share one source of truth.
 */
export const mockUser = {
  id: 'u-demo',
  fullName: 'James Whitfield',
  email: 'james.whitfield@example.com',
  phone: '+1 415 555 0142',
  country: 'United States',
  photoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
  dateOfBirth: '1979-06-14',
  gender: 'Male',
  bloodGroup: 'O+',
  city: 'San Francisco',
  memberSince: '2025-11-02',
  // References into the saved store are seeded at first load.
  savedHospitalIds: ['h-medanta', 'h-smilecraft'],
  savedDoctorIds: ['d-khanna'],
  savedTreatmentIds: ['t-knee', 't-hair-transplant'],
  settings: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    preferredCurrency: 'INR',
  },
};

export default mockUser;
