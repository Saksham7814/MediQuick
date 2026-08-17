/**
 * Curated remote imagery (all URLs verified to resolve).
 *
 * Hospitals / treatments use Unsplash; doctors use real portraits of Indian
 * medical professionals sourced from Unsplash. Centralised here so mock data
 * files stay readable and a single place controls sizing / quality params.
 * When real data arrives these are replaced by uploaded image URLs.
 */

const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Square-cropped portrait for doctor avatars.
const face = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&h=500&q=80`;

export const hospitalImages = {
  apollo: [
    unsplash('photo-1587351021759-3e566b6af7cc'),
    unsplash('photo-1519494026892-80bbd2d6fd0d'),
    unsplash('photo-1516549655169-df83a0774514'),
    unsplash('photo-1538108149393-fbbd81895907'),
  ],
  fortis: [
    unsplash('photo-1519494026892-80bbd2d6fd0d'),
    unsplash('photo-1504439468489-c8920d796a29'),
    unsplash('photo-1512678080530-7760d81faba6'),
    unsplash('photo-1580281658626-ee379f3cce93'),
  ],
  medanta: [
    unsplash('photo-1586773860418-d37222d8fce3'),
    unsplash('photo-1631217868264-e5b90bb7e133'),
    unsplash('photo-1519494026892-80bbd2d6fd0d'),
    unsplash('photo-1516574187841-cb9cc2ca948b'),
  ],
  maxHealth: [
    unsplash('photo-1512678080530-7760d81faba6'),
    unsplash('photo-1551076805-e1869033e561'),
    unsplash('photo-1579154204601-01588f351e67'),
    unsplash('photo-1504439468489-c8920d796a29'),
  ],
  manipal: [
    unsplash('photo-1504439468489-c8920d796a29'),
    unsplash('photo-1586773860418-d37222d8fce3'),
    unsplash('photo-1538108149393-fbbd81895907'),
    unsplash('photo-1519494026892-80bbd2d6fd0d'),
  ],
  aster: [
    unsplash('photo-1551601651-09492b5468b6'),
    unsplash('photo-1580281658626-ee379f3cce93'),
    unsplash('photo-1504439468489-c8920d796a29'),
    unsplash('photo-1512678080530-7760d81faba6'),
  ],
  smileCraft: [
    unsplash('photo-1629909613654-28e377c37b09'),
    unsplash('photo-1588776814546-1ffcf47267a5'),
    unsplash('photo-1606811971618-4486d14f3f99'),
    unsplash('photo-1609840114035-3c981b782dfe'),
  ],
  novaFertility: [
    unsplash('photo-1584515933487-779824d29309'),
    unsplash('photo-1666214280391-8ff5bd3c0bf0'),
    unsplash('photo-1504439468489-c8920d796a29'),
    unsplash('photo-1584982751601-97dcc096659c'),
  ],
};

export const treatmentImages = {
  cardiology: unsplash('photo-1628348068343-c6a848d2b6dd'),
  cardiacBypass: unsplash('photo-1579684385127-1ef15d508118'),
  kneeReplacement: unsplash('photo-1571019613454-1cb2f99b2d8b'),
  spineSurgery: unsplash('photo-1579684453423-f84349ef60b0'),
  dentalImplants: unsplash('photo-1606811841689-23dfddce3e95'),
  dentalVeneers: unsplash('photo-1588776814546-1ffcf47267a5'),
  ivf: unsplash('photo-1584515933487-779824d29309'),
  eggFreezing: unsplash('photo-1666214280391-8ff5bd3c0bf0'),
  rhinoplasty: unsplash('photo-1551601651-124575cf5969'),
  liposuction: unsplash('photo-1512290923902-8a9f81dc236c'),
  hairTransplant: unsplash('photo-1617257485487-da9a7a6d95e3'),
  prpHair: unsplash('photo-1553981474-3df84eab7103'),
  oncology: unsplash('photo-1579165466741-7f35e4755660'),
  breastCancer: unsplash('photo-1631217868264-e5b90bb7e133'),
  neurology: unsplash('photo-1559757148-5c350d0d3c56'),
  brainTumor: unsplash('photo-1583911860205-72f8ac8ddcbe'),
};

export const categoryImages = {
  Cardiology: unsplash('photo-1628348068343-c6a848d2b6dd', 600),
  Orthopedics: unsplash('photo-1571019613454-1cb2f99b2d8b', 600),
  Dental: unsplash('photo-1606811841689-23dfddce3e95', 600),
  Fertility: unsplash('photo-1584515933487-779824d29309', 600),
  Cosmetic: unsplash('photo-1551601651-09492b5468b6', 600),
  'Hair Restoration': unsplash('photo-1643837833100-8b2ebd7127bc', 600),
  Oncology: unsplash('photo-1579165466741-7f35e4755660', 600),
  Neurology: unsplash('photo-1559757148-5c350d0d3c56', 600),
};

/**
 * Real portraits of Indian medical professionals, keyed by doctor id.
 * (Sourced from Unsplash; all verified to resolve.)
 */
export const doctorImages = {
  'd-mehta': face('photo-1612349317150-e413f6a5b16d'),
  'd-rao': face('photo-1659353888906-adb3e0041693'),
  'd-khanna': face('photo-1582750433449-648ed127bb54'),
  'd-reddy': face('photo-1673865641073-4479f93a7776'),
  'd-nair': face('photo-1623854767648-e7bb8009f0db'),
  'd-iyer': face('photo-1757125736482-328a3cdd9743'),
  'd-kapoor': face('photo-1637059824899-a441006a6875'),
  'd-sharma': face('photo-1571772996211-2f02c9727629'),
  'd-verma': face('photo-1659353888633-bc0db91345df'),
  'd-menon': face('photo-1642975967602-653d378f3b5b'),
  'd-bose': face('photo-1585928642599-31f15a88c002'),
  'd-gupta': face('photo-1612531386530-97286d97c2d2'),
};

export const heroImage = unsplash('photo-1519494026892-80bbd2d6fd0d', 1600);

export { unsplash };
