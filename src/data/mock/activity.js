/**
 * Patient activity: appointments, consultation requests, conversations and
 * notifications. Dates are generated relative to "now" so the dashboard
 * always shows a realistic mix of upcoming and past items.
 */

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const hoursAgo = (n) => {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
};

/** @type {import('../models.js').Appointment[]} */
export const appointments = [
  {
    id: 'apt-1001',
    doctorId: 'd-khanna',
    hospitalId: 'h-fortis',
    treatmentId: 't-knee',
    date: daysFromNow(4),
    time: '10:30 AM IST',
    status: 'upcoming',
    mode: 'video',
  },
  {
    id: 'apt-1002',
    doctorId: 'd-mehta',
    hospitalId: 'h-apollo',
    treatmentId: 't-angioplasty',
    date: daysFromNow(12),
    time: '02:00 PM IST',
    status: 'upcoming',
    mode: 'in-person',
  },
  {
    id: 'apt-1003',
    doctorId: 'd-nair',
    hospitalId: 'h-smilecraft',
    treatmentId: 't-implants',
    date: daysFromNow(-9),
    time: '11:00 AM IST',
    status: 'past',
    mode: 'video',
  },
  {
    id: 'apt-1004',
    doctorId: 'd-iyer',
    hospitalId: 'h-nova',
    treatmentId: 't-ivf',
    date: daysFromNow(-21),
    time: '09:30 AM IST',
    status: 'past',
    mode: 'video',
  },
  {
    id: 'apt-1005',
    doctorId: 'd-kapoor',
    hospitalId: 'h-aster',
    treatmentId: 't-hair-transplant',
    date: daysFromNow(-3),
    time: '04:00 PM IST',
    status: 'cancelled',
    mode: 'video',
  },
];

/** @type {import('../models.js').ConsultationRequest[]} */
export const consultationRequests = [
  {
    id: 'MED-8F3A21',
    fullName: 'James Whitfield',
    email: 'james.whitfield@example.com',
    phone: '+1 415 555 0142',
    country: 'United States',
    treatmentId: 't-knee',
    hospitalId: 'h-fortis',
    doctorId: 'd-khanna',
    preferredDate: daysFromNow(20),
    preferredTime: 'Morning',
    message:
      'I have advanced arthritis in my right knee and would like to explore robotic knee replacement. Please advise on evaluation and estimated total cost.',
    status: 'Confirmed',
    createdAt: hoursAgo(72),
  },
  {
    id: 'MED-2C9B04',
    fullName: 'James Whitfield',
    email: 'james.whitfield@example.com',
    phone: '+1 415 555 0142',
    country: 'United States',
    treatmentId: 't-hair-transplant',
    hospitalId: 'h-aster',
    doctorId: 'd-kapoor',
    preferredDate: daysFromNow(35),
    preferredTime: 'Afternoon',
    message:
      'Interested in an FUE hair transplant. Roughly 2,500 grafts. Would like a virtual assessment first.',
    status: 'Processing',
    createdAt: hoursAgo(28),
  },
  {
    id: 'MED-5A17E9',
    fullName: 'James Whitfield',
    email: 'james.whitfield@example.com',
    phone: '+1 415 555 0142',
    country: 'United States',
    treatmentId: 't-oncology-screening',
    hospitalId: 'h-apollo',
    doctorId: 'd-sharma',
    preferredDate: daysFromNow(14),
    preferredTime: 'Morning',
    message: 'Would like a comprehensive cancer screening package during my visit.',
    status: 'Pending',
    createdAt: hoursAgo(5),
  },
];

/**
 * Conversations between the patient and provider coordinators.
 * @type {Array<{id:string, providerType:'hospital'|'doctor', providerId:string, messages:Array}>}
 */
export const conversations = [
  {
    id: 'conv-1',
    providerType: 'doctor',
    providerId: 'd-khanna',
    subtitle: 'Fortis Memorial Research Institute',
    unread: 2,
    messages: [
      {
        id: 'm1',
        from: 'provider',
        text: 'Hello James, thank you for your interest in robotic knee replacement. I have reviewed your query.',
        at: hoursAgo(50),
      },
      {
        id: 'm2',
        from: 'provider',
        text: 'Could you share any recent X-rays or MRI reports of your knee?',
        at: hoursAgo(49),
      },
      {
        id: 'm3',
        from: 'patient',
        text: 'Thank you Dr. Khanna. Yes, I have an MRI from last month — I will upload it shortly.',
        at: hoursAgo(48),
      },
      {
        id: 'm4',
        from: 'provider',
        text: 'Perfect. Based on your reports we can plan a video consultation to discuss the procedure and total cost.',
        at: hoursAgo(3),
      },
      {
        id: 'm5',
        from: 'provider',
        text: 'Your consultation is confirmed for the selected date. Our international desk will assist with your visa letter.',
        at: hoursAgo(2),
      },
    ],
  },
  {
    id: 'conv-2',
    providerType: 'hospital',
    providerId: 'h-aster',
    subtitle: 'International Patient Desk',
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'provider',
        text: 'Welcome to Aster Aesthetics! We received your hair transplant enquiry.',
        at: hoursAgo(26),
      },
      {
        id: 'm2',
        from: 'patient',
        text: 'Thanks! What information do you need for a virtual assessment?',
        at: hoursAgo(25),
      },
      {
        id: 'm3',
        from: 'provider',
        text: 'A few clear photos of your scalp from the front, top and back would be great to estimate graft count.',
        at: hoursAgo(24),
      },
    ],
  },
  {
    id: 'conv-3',
    providerType: 'hospital',
    providerId: 'h-apollo',
    subtitle: 'Oncology Coordination',
    unread: 1,
    messages: [
      {
        id: 'm1',
        from: 'provider',
        text: 'Hello James, we have received your cancer screening request and are reviewing available slots.',
        at: hoursAgo(4),
      },
    ],
  },
];

/** @type {Array<{id:string, type:string, title:string, body:string, at:string, read:boolean, link?:string}>} */
export const notifications = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'Appointment confirmed',
    body: 'Your video consultation with Dr. Rohan Khanna is confirmed.',
    at: hoursAgo(2),
    read: false,
    link: '/appointments',
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New message from Dr. Rohan Khanna',
    body: 'Our international desk will assist with your visa letter.',
    at: hoursAgo(2),
    read: false,
    link: '/messages',
  },
  {
    id: 'n3',
    type: 'consultation',
    title: 'Consultation request update',
    body: 'Request MED-2C9B04 is now being processed by Aster Aesthetics.',
    at: hoursAgo(28),
    read: false,
    link: '/consultations',
  },
  {
    id: 'n4',
    type: 'message',
    title: 'New message from Apollo Oncology',
    body: 'We are reviewing available slots for your screening.',
    at: hoursAgo(4),
    read: true,
    link: '/messages',
  },
  {
    id: 'n5',
    type: 'update',
    title: 'Welcome to Mediquick',
    body: 'Save hospitals and doctors to compare them side by side.',
    at: hoursAgo(120),
    read: true,
  },
];
