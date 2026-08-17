import { treatmentImages } from '../images.js';

// Amounts are authored in USD for readability, then converted to INR (≈₹83/$),
// rounded to the nearest ₹1,000 so displayed ranges stay tidy.
const inr = (minUsd, maxUsd) => ({
  min: Math.round((minUsd * 83) / 1000) * 1000,
  max: Math.round((maxUsd * 83) / 1000) * 1000,
  currency: 'INR',
});

/** @type {import('../models.js').Treatment[]} */
export const treatments = [
  // ---- Cardiology ----
  {
    id: 't-cabg',
    name: 'Coronary Artery Bypass (CABG)',
    category: 'Cardiology',
    image: treatmentImages.cardiacBypass,
    shortDescription:
      'Restores blood flow to the heart by bypassing blocked coronary arteries.',
    overview:
      'Coronary artery bypass grafting is one of the most established heart surgeries performed in India, with outcomes comparable to leading Western centres at a fraction of the cost. It is recommended for patients with significant blockages in multiple coronary arteries.',
    procedure:
      'A healthy blood vessel is taken from the leg, arm or chest and grafted to bypass the narrowed artery. Depending on the case, surgeons perform it on-pump or as a beating-heart (off-pump) procedure.',
    cost: inr(6500, 9500),
    duration: '10–14 days in India',
    hospitalStay: '5–7 days',
    recovery: '6–12 weeks for full recovery',
    includes: [
      'Pre-operative evaluation',
      'Surgery & surgeon fees',
      'ICU and hospital stay',
      'Post-op medication',
      'Follow-up consultation',
    ],
    hospitalIds: ['h-apollo', 'h-medanta', 'h-fortis'],
    doctorIds: ['d-mehta', 'd-rao'],
    popularity: 94,
  },
  {
    id: 't-angioplasty',
    name: 'Coronary Angioplasty & Stenting',
    category: 'Cardiology',
    image: treatmentImages.cardiology,
    shortDescription:
      'Minimally invasive procedure to open narrowed arteries with a stent.',
    overview:
      'Angioplasty is a non-surgical, catheter-based procedure to widen blocked or narrowed coronary arteries. Drug-eluting stents keep the vessel open and reduce the chance of re-narrowing.',
    procedure:
      'A thin catheter with a balloon tip is guided to the blockage. The balloon inflates to widen the artery and a stent is placed to hold it open. Most patients are awake throughout.',
    cost: inr(3500, 6000),
    duration: '5–7 days in India',
    hospitalStay: '2–3 days',
    recovery: '1–2 weeks',
    includes: [
      'Cardiac catheterisation',
      'Drug-eluting stent',
      'Cath-lab & specialist fees',
      'Hospital stay',
      'Follow-up review',
    ],
    hospitalIds: ['h-apollo', 'h-medanta', 'h-max'],
    doctorIds: ['d-mehta', 'd-rao'],
    popularity: 88,
  },

  // ---- Orthopedics ----
  {
    id: 't-knee',
    name: 'Total Knee Replacement',
    category: 'Orthopedics',
    image: treatmentImages.kneeReplacement,
    shortDescription:
      'Replaces a damaged knee joint with a durable prosthetic implant.',
    overview:
      'Total knee replacement relieves pain and restores mobility for patients with advanced arthritis. India is a leading destination for joint replacement, offering imported implants and robotic-assisted precision.',
    procedure:
      'The damaged cartilage and bone are removed and replaced with metal and medical-grade plastic components. Robotic-assisted alignment is available at select centres.',
    cost: inr(4500, 7500),
    duration: '10–12 days in India',
    hospitalStay: '4–5 days',
    recovery: '6–8 weeks with physiotherapy',
    includes: [
      'Imported implant',
      'Surgery & anaesthesia',
      'Hospital stay',
      'Physiotherapy sessions',
      'Follow-up consultation',
    ],
    hospitalIds: ['h-fortis', 'h-max', 'h-manipal'],
    doctorIds: ['d-khanna', 'd-reddy'],
    popularity: 90,
  },
  {
    id: 't-spine',
    name: 'Spinal Fusion Surgery',
    category: 'Orthopedics',
    image: treatmentImages.spineSurgery,
    shortDescription:
      'Stabilises the spine by permanently joining two or more vertebrae.',
    overview:
      'Spinal fusion treats conditions such as degenerative disc disease, scoliosis and spinal instability. Minimally invasive techniques reduce blood loss and shorten recovery.',
    procedure:
      'Bone graft material is placed between affected vertebrae, which are held together with rods and screws until they fuse into a single solid bone.',
    cost: inr(6000, 10000),
    duration: '12–16 days in India',
    hospitalStay: '5–6 days',
    recovery: '3–6 months',
    includes: [
      'Implants & instrumentation',
      'Surgery & anaesthesia',
      'ICU / hospital stay',
      'Physiotherapy plan',
      'Follow-up imaging review',
    ],
    hospitalIds: ['h-fortis', 'h-manipal', 'h-medanta'],
    doctorIds: ['d-khanna', 'd-reddy'],
    popularity: 76,
  },

  // ---- Dental ----
  {
    id: 't-implants',
    name: 'Dental Implants',
    category: 'Dental',
    image: treatmentImages.dentalImplants,
    shortDescription:
      'Permanent titanium-rooted replacements for missing teeth.',
    overview:
      'Dental implants are the gold standard for replacing missing teeth, offering a natural look and long-term durability. India offers premium implant brands at a significant saving.',
    procedure:
      'A titanium post is placed into the jawbone to act as a root, and after healing a custom crown is fixed on top. Single-visit and all-on-four options are available.',
    cost: inr(600, 1500),
    duration: '5–10 days in India',
    hospitalStay: 'Day-care (no admission)',
    recovery: '2–4 weeks; final crown after osseointegration',
    includes: [
      'Implant & abutment',
      'Ceramic crown',
      'Dental imaging',
      'Specialist fees',
      'Post-op review',
    ],
    hospitalIds: ['h-smilecraft', 'h-apollo'],
    doctorIds: ['d-nair'],
    popularity: 85,
  },
  {
    id: 't-veneers',
    name: 'Porcelain Veneers',
    category: 'Dental',
    image: treatmentImages.dentalVeneers,
    shortDescription:
      'Thin custom shells that transform the shape and colour of teeth.',
    overview:
      'Porcelain veneers deliver a natural, durable smile makeover. Ideal for correcting discolouration, chips, gaps and minor misalignment.',
    procedure:
      'A minimal layer of enamel is prepared, impressions are taken, and custom veneers are bonded to the front of the teeth for a seamless finish.',
    cost: inr(250, 600),
    duration: '5–7 days in India',
    hospitalStay: 'Day-care (no admission)',
    recovery: 'Immediate; minor sensitivity for a few days',
    includes: [
      'Smile design consultation',
      'Custom porcelain veneers',
      'Bonding & finishing',
      'Follow-up polish',
    ],
    hospitalIds: ['h-smilecraft'],
    doctorIds: ['d-nair'],
    popularity: 72,
  },

  // ---- Fertility ----
  {
    id: 't-ivf',
    name: 'IVF (In-Vitro Fertilisation)',
    category: 'Fertility',
    image: treatmentImages.ivf,
    shortDescription:
      'Assisted reproduction combining egg and sperm in the laboratory.',
    overview:
      'India is a trusted destination for IVF, with world-class embryology labs and high success rates at accessible prices. Personalised protocols are designed for each couple.',
    procedure:
      'Ovaries are stimulated to produce eggs, which are retrieved and fertilised in the lab. The resulting embryo is transferred to the uterus after monitoring.',
    cost: inr(2500, 4500),
    duration: '3–4 weeks in India (one cycle)',
    hospitalStay: 'Day-care procedures',
    recovery: 'Minimal; normal activity within days',
    includes: [
      'Ovarian stimulation monitoring',
      'Egg retrieval & fertilisation',
      'Embryo transfer',
      'Consultations',
    ],
    hospitalIds: ['h-nova', 'h-apollo'],
    doctorIds: ['d-iyer'],
    popularity: 82,
  },
  {
    id: 't-egg-freezing',
    name: 'Egg Freezing',
    category: 'Fertility',
    image: treatmentImages.eggFreezing,
    shortDescription:
      'Preserve fertility by cryopreserving healthy eggs for the future.',
    overview:
      'Egg freezing gives women the option to preserve fertility for medical or personal reasons, using vitrification for high survival rates on thawing.',
    procedure:
      'After ovarian stimulation, mature eggs are retrieved and frozen using rapid vitrification, then stored securely until needed.',
    cost: inr(1800, 3200),
    duration: '2–3 weeks in India',
    hospitalStay: 'Day-care procedure',
    recovery: 'Minimal',
    includes: [
      'Stimulation & monitoring',
      'Egg retrieval',
      'Vitrification & first-year storage',
      'Consultations',
    ],
    hospitalIds: ['h-nova'],
    doctorIds: ['d-iyer'],
    popularity: 58,
  },

  // ---- Cosmetic ----
  {
    id: 't-rhinoplasty',
    name: 'Rhinoplasty',
    category: 'Cosmetic',
    image: treatmentImages.rhinoplasty,
    shortDescription:
      'Reshapes the nose for improved balance, profile or breathing.',
    overview:
      'Rhinoplasty refines the shape and proportion of the nose and can also correct breathing issues. Indian plastic surgeons combine aesthetic finesse with functional precision.',
    procedure:
      'Through closed or open techniques, cartilage and bone are reshaped to achieve the desired profile, tailored to facial harmony.',
    cost: inr(2200, 4000),
    duration: '10–12 days in India',
    hospitalStay: 'Day-care or 1 night',
    recovery: '2–3 weeks for swelling to settle',
    includes: [
      'Surgeon & anaesthesia',
      'Facility fees',
      'Post-op splint & care',
      'Follow-up review',
    ],
    hospitalIds: ['h-aster', 'h-max'],
    doctorIds: ['d-kapoor'],
    popularity: 68,
  },
  {
    id: 't-liposuction',
    name: 'Liposuction & Body Contouring',
    category: 'Cosmetic',
    image: treatmentImages.liposuction,
    shortDescription:
      'Removes stubborn fat deposits to sculpt and define the body.',
    overview:
      'Modern liposuction techniques such as VASER and laser-assisted lipo offer precise contouring with reduced downtime, performed by board-certified surgeons.',
    procedure:
      'Targeted fat is loosened and gently suctioned through small incisions. Combined procedures can address multiple areas in one session.',
    cost: inr(2000, 4500),
    duration: '8–10 days in India',
    hospitalStay: 'Day-care or 1 night',
    recovery: '2–4 weeks; compression garment advised',
    includes: [
      'Surgeon & anaesthesia',
      'Facility fees',
      'Compression garment',
      'Follow-up review',
    ],
    hospitalIds: ['h-aster'],
    doctorIds: ['d-kapoor'],
    popularity: 61,
  },

  // ---- Hair Restoration ----
  {
    id: 't-hair-transplant',
    name: 'FUE Hair Transplant',
    category: 'Hair Restoration',
    image: treatmentImages.hairTransplant,
    shortDescription:
      'Follicular unit extraction for natural, permanent hair restoration.',
    overview:
      'India is among the most popular destinations for hair transplantation, offering large graft counts with natural hairlines at highly competitive prices.',
    procedure:
      'Individual follicular units are extracted from the donor area and precisely implanted into thinning or bald regions for a natural density.',
    cost: inr(800, 2500),
    duration: '3–5 days in India',
    hospitalStay: 'Day-care procedure',
    recovery: '7–10 days; new growth over 6–9 months',
    includes: [
      'Graft extraction & implantation',
      'Local anaesthesia',
      'Post-procedure kit',
      'Follow-up review',
    ],
    hospitalIds: ['h-aster', 'h-max'],
    doctorIds: ['d-kapoor'],
    popularity: 79,
  },
  {
    id: 't-prp-hair',
    name: 'PRP Hair Therapy',
    category: 'Hair Restoration',
    image: treatmentImages.prpHair,
    shortDescription:
      'Uses your own platelet-rich plasma to stimulate hair growth.',
    overview:
      'PRP therapy is a non-surgical treatment that harnesses growth factors from your own blood to reduce hair fall and improve density, often paired with transplantation.',
    procedure:
      'A small blood sample is processed to concentrate platelets, which are then injected into the scalp across multiple sessions.',
    cost: inr(120, 400),
    duration: 'Per session (course of 3–6)',
    hospitalStay: 'Day-care procedure',
    recovery: 'Immediate',
    includes: [
      'Blood draw & PRP preparation',
      'Scalp injections',
      'Specialist fees',
    ],
    hospitalIds: ['h-aster'],
    doctorIds: ['d-kapoor'],
    popularity: 49,
  },

  // ---- Oncology ----
  {
    id: 't-breast-cancer',
    name: 'Breast Cancer Treatment',
    category: 'Oncology',
    image: treatmentImages.breastCancer,
    shortDescription:
      'Comprehensive care including surgery, chemo and radiation.',
    overview:
      'Leading Indian cancer centres offer multidisciplinary breast cancer care with advanced diagnostics, breast-conserving surgery and targeted therapies.',
    procedure:
      'A personalised plan may combine surgery (lumpectomy or mastectomy), chemotherapy, radiation and targeted or hormone therapy based on staging.',
    cost: inr(5000, 12000),
    duration: '3–6 weeks in India (varies by plan)',
    hospitalStay: 'Varies by phase',
    recovery: 'Ongoing; individualised follow-up',
    includes: [
      'Diagnostics & staging',
      'Surgery',
      'Oncology consultations',
      'Care coordination',
    ],
    hospitalIds: ['h-apollo', 'h-medanta'],
    doctorIds: ['d-sharma'],
    popularity: 74,
  },
  {
    id: 't-oncology-screening',
    name: 'Advanced Cancer Screening',
    category: 'Oncology',
    image: treatmentImages.oncology,
    shortDescription:
      'Comprehensive PET-CT and molecular diagnostics package.',
    overview:
      'Early detection saves lives. Comprehensive screening packages combine imaging, tumour markers and specialist review for a clear picture of your health.',
    procedure:
      'Includes PET-CT or MRI as indicated, blood-based tumour markers and a detailed consultation with an oncologist.',
    cost: inr(600, 1800),
    duration: '2–4 days in India',
    hospitalStay: 'Out-patient',
    recovery: 'None',
    includes: [
      'Imaging (PET-CT / MRI)',
      'Tumour marker panel',
      'Oncologist consultation',
      'Detailed report',
    ],
    hospitalIds: ['h-apollo', 'h-medanta'],
    doctorIds: ['d-sharma'],
    popularity: 55,
  },

  // ---- Neurology ----
  {
    id: 't-brain-tumor',
    name: 'Brain Tumour Surgery',
    category: 'Neurology',
    image: treatmentImages.brainTumor,
    shortDescription:
      'Precision neurosurgery using intra-operative imaging and navigation.',
    overview:
      'Indian neurosurgical centres offer advanced technology such as neuro-navigation, intra-operative MRI and awake craniotomy for safe tumour removal.',
    procedure:
      'The tumour is removed using image-guided microsurgery to maximise removal while preserving healthy brain tissue. Awake surgery is used near critical areas.',
    cost: inr(7000, 13000),
    duration: '14–21 days in India',
    hospitalStay: '7–10 days',
    recovery: '4–8 weeks; individualised rehab',
    includes: [
      'Surgery & neuro-monitoring',
      'ICU / hospital stay',
      'Imaging',
      'Follow-up review',
    ],
    hospitalIds: ['h-medanta', 'h-manipal'],
    doctorIds: ['d-verma'],
    popularity: 63,
  },
  {
    id: 't-dbs',
    name: 'Deep Brain Stimulation',
    category: 'Neurology',
    image: treatmentImages.neurology,
    shortDescription:
      'Implanted device that eases Parkinson’s and movement disorders.',
    overview:
      'Deep brain stimulation delivers targeted electrical pulses to specific brain regions, dramatically improving symptoms of Parkinson’s disease, tremor and dystonia.',
    procedure:
      'Electrodes are precisely implanted and connected to a pulse generator placed under the skin, then programmed to the patient’s needs.',
    cost: inr(17000, 24000),
    duration: '18–24 days in India',
    hospitalStay: '6–8 days',
    recovery: '4–6 weeks; ongoing programming',
    includes: [
      'DBS device & implantation',
      'Surgery & neuro-monitoring',
      'Hospital stay',
      'Programming sessions',
    ],
    hospitalIds: ['h-medanta', 'h-manipal'],
    doctorIds: ['d-verma'],
    popularity: 41,
  },
];

export default treatments;
