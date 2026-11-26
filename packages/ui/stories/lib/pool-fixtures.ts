/** The social platforms a creator links, each drawn by its logo in the Pool screens. */
export type Platform = "Instagram" | "TikTok" | "YouTube";

export const photoUrl = (seed: number, size = 480) => `https://i.pravatar.cc/${size}?img=${seed}`;

export type StaffMember = { id: string; name: string; email: string; imageUrl: string };

export const STAFF = {
  maya: {
    id: "staff-maya",
    name: "Maya Thompson",
    email: "maya@inbeat.agency",
    imageUrl: photoUrl(45, 80),
  },
  theo: {
    id: "staff-theo",
    name: "Theo Martin",
    email: "theo@inbeat.agency",
    imageUrl: photoUrl(12, 80),
  },
  priya: {
    id: "staff-priya",
    name: "Priya Shah",
    email: "priya@inbeat.agency",
    imageUrl: photoUrl(47, 80),
  },
  lucas: {
    id: "staff-lucas",
    name: "Lucas Bernard",
    email: "lucas@inbeat.agency",
    imageUrl: photoUrl(53, 80),
  },
  camille: {
    id: "staff-camille",
    name: "Camille Roy",
    email: "camille@inbeat.agency",
    imageUrl: photoUrl(32, 80),
  },
} satisfies Record<string, StaffMember>;

export const POOL_USER = {
  name: STAFF.maya.name,
  email: STAFF.maya.email,
  avatarUrl: STAFF.maya.imageUrl,
};

export const OVERALL_RATING_TIERS = [
  "top creator",
  "standout",
  "good",
  "sufficient",
  "problematic",
  "blacklisted",
  "untested",
] as const;

export type OverallRating = (typeof OVERALL_RATING_TIERS)[number];

export type CreatorListItem = {
  id: string;
  fullName: string;
  country: string;
  overallRating: OverallRating;
  rateRange: { min: number; max: number } | null;
  photoSeed: number;
};

export const CREATORS: CreatorListItem[] = [
  {
    id: "c-01",
    fullName: "Jade Rivera",
    country: "United States",
    overallRating: "top creator",
    rateRange: { min: 250, max: 400 },
    photoSeed: 5,
  },
  {
    id: "c-02",
    fullName: "Noah Fischer",
    country: "Canada",
    overallRating: "standout",
    rateRange: { min: 180, max: 300 },
    photoSeed: 13,
  },
  {
    id: "c-03",
    fullName: "Amara Okafor",
    country: "United Kingdom",
    overallRating: "top creator",
    rateRange: { min: 300, max: 550 },
    photoSeed: 9,
  },
  {
    id: "c-04",
    fullName: "Léa Moreau",
    country: "France",
    overallRating: "good",
    rateRange: { min: 150, max: 220 },
    photoSeed: 20,
  },
  {
    id: "c-05",
    fullName: "Diego Alvarez",
    country: "Mexico",
    overallRating: "standout",
    rateRange: { min: 120, max: 200 },
    photoSeed: 15,
  },
  {
    id: "c-06",
    fullName: "Hannah Kim",
    country: "United States",
    overallRating: "good",
    rateRange: null,
    photoSeed: 25,
  },
  {
    id: "c-07",
    fullName: "Sofia Rossi",
    country: "Italy",
    overallRating: "sufficient",
    rateRange: { min: 90, max: 150 },
    photoSeed: 44,
  },
  {
    id: "c-08",
    fullName: "Marcus Bell",
    country: "United States",
    overallRating: "untested",
    rateRange: { min: 200, max: 350 },
    photoSeed: 59,
  },
  {
    id: "c-09",
    fullName: "Chloé Tremblay",
    country: "Canada",
    overallRating: "standout",
    rateRange: { min: 175, max: 260 },
    photoSeed: 29,
  },
  {
    id: "c-10",
    fullName: "Ethan Walsh",
    country: "Ireland",
    overallRating: "problematic",
    rateRange: { min: 100, max: 180 },
    photoSeed: 68,
  },
  {
    id: "c-11",
    fullName: "Yuki Tanaka",
    country: "Japan",
    overallRating: "good",
    rateRange: { min: 220, max: 320 },
    photoSeed: 23,
  },
  {
    id: "c-12",
    fullName: "Isabela Costa",
    country: "Brazil",
    overallRating: "untested",
    rateRange: null,
    photoSeed: 41,
  },
];

export const CREATOR_TOTAL = 248;

export const SORT_OPTIONS = [
  { key: "rating", label: "Best performers" },
  { key: "newest", label: "Newest" },
  { key: "collaborations", label: "Most collabs" },
  { key: "rate_low", label: "Rate: Low to High" },
  { key: "rate_high", label: "Rate: High to Low" },
] as const;

export const DATABASE_FILTER_SECTIONS: { title: string; options: string[] }[] = [
  { title: "Rating", options: [...OVERALL_RATING_TIERS] },
  { title: "Channels", options: ["Instagram", "TikTok", "YouTube"] },
  {
    title: "UGC Categories",
    options: [
      "Sports & Outdoors",
      "Lifestyle",
      "Beauty",
      "Selfcare & Wellness",
      "Makeup",
      "Tech",
      "Food & Cooking",
      "Fashion",
    ],
  },
  {
    title: "Content Formats",
    options: [
      "Aesthetic",
      "ASMR",
      "Humor & Skits",
      "Product Demo",
      "Unboxing",
      "Testimonial / Review",
      "Voiceover",
      "Tutorial / How-to",
    ],
  },
  { title: "Brand Interests", options: ["Skincare", "Supplements", "Fitness", "Beverages"] },
  { title: "Brand Types", options: ["DTC", "Retail", "App", "Agency"] },
  { title: "Worked on", options: ["Paid social", "Organic", "Whitelisting"] },
  { title: "Gender", options: ["Woman", "Man", "Non-binary"] },
  { title: "Age", options: ["18-24", "25-34", "35-44", "45+"] },
  {
    title: "Ethnicity",
    options: ["Asian", "Black", "Hispanic / Latino", "White", "Middle Eastern"],
  },
  { title: "Languages", options: ["English", "French", "Spanish", "Portuguese"] },
  { title: "Country", options: ["United States", "Canada", "United Kingdom", "France"] },
];

export type ClosedCollaboration = {
  id: string;
  projectName: string;
  clientName: string;
  totalPaid: number | null;
  piecesOfContent: number | null;
  closedAt: string;
  closedBy: StaffMember | null;
  reviewNotes: string | null;
  reviewNotesBy: StaffMember | null;
  ratings: { visual: OverallRating; acting: OverallRating; reliability: OverallRating } | null;
};

export const CREATOR_PROFILE = {
  id: "c-01",
  fullName: "Jade Rivera",
  email: "jade.rivera@gmail.com",
  photoSeed: 5,
  overallRating: "top creator" as OverallRating,
  country: "United States",
  languages: ["English", "Spanish"],
  age: 27,
  dateOfBirth: "March 14, 1999",
  genderIdentity: "Woman",
  ethnicity: ["Hispanic / Latino"],
  ugcCategories: ["Beauty", "Selfcare & Wellness", "Lifestyle"],
  contentFormats: ["Testimonial / Review", "Product Demo", "Voiceover"],
  brandInterests: ["Skincare", "Supplements"],
  brandTypes: ["DTC"],
  workedOn: ["Paid social", "Whitelisting"],
  socialChannels: ["Instagram", "TikTok"] as Platform[],
  portfolioUrl: "https://jaderivera.studio",
  rateRange: { min: 250, max: 400 },
  rateEstimated: false,
  internalRange: { min: 260, max: 375 },
  portfolio: [
    { id: "v-1", filename: "Glossier - Balm Dotcom hook.mp4", seed: 1 },
    { id: "v-2", filename: "Oura - morning routine.mp4", seed: 16 },
    { id: "v-3", filename: "Nutramax - unboxing raw.mp4", seed: 26 },
    { id: "v-4", filename: "Liquid Death - taste test.mp4", seed: 36 },
    { id: "v-5", filename: "Athletic Brewing - beach day.mp4", seed: 49 },
  ],
  blacklistReason:
    "Missed two delivery deadlines on the Oura Q3 campaign and stopped answering emails.",
  closedCollaborations: [
    {
      id: "cc-1",
      projectName: "Glossier - Holiday gifting UGC",
      clientName: "Glossier",
      totalPaid: 1500,
      piecesOfContent: 4,
      closedAt: "November 12, 2026",
      closedBy: STAFF.theo,
      reviewNotes: "Fast turnaround, natural delivery. Hooks needed one round of revisions.",
      reviewNotesBy: STAFF.theo,
      ratings: { visual: "top creator", acting: "standout", reliability: "top creator" },
    },
    {
      id: "cc-2",
      projectName: "Oura - Sleep score launch",
      clientName: "Oura",
      totalPaid: 900,
      piecesOfContent: 3,
      closedAt: "September 28, 2026",
      closedBy: STAFF.priya,
      reviewNotes: null,
      reviewNotesBy: null,
      ratings: { visual: "standout", acting: "good", reliability: "standout" },
    },
    {
      id: "cc-3",
      projectName: "NMAX - Nutramax BAU UGC Ads - Concept 3",
      clientName: "Nutramax",
      totalPaid: 640,
      piecesOfContent: 2,
      closedAt: "July 3, 2026",
      closedBy: STAFF.maya,
      reviewNotes: null,
      reviewNotesBy: null,
      ratings: null,
    },
  ] satisfies ClosedCollaboration[],
};

export type CreatorProfile = typeof CREATOR_PROFILE;

export type CollaborationListItem = {
  id: string;
  creator: { id: string; fullName: string; photoSeed: number | null; profileCompleted: boolean };
  clientName: string;
  projectName: string;
  overallRating: OverallRating;
  totalPaid: number | null;
  piecesOfContent: number | null;
  closedAt: string | null;
  closedBy: StaffMember | null;
};

export const COLLABORATIONS: CollaborationListItem[] = [
  {
    id: "col-01",
    creator: { id: "c-01", fullName: "Jade Rivera", photoSeed: 5, profileCompleted: true },
    clientName: "Glossier",
    projectName: "Holiday gifting UGC",
    overallRating: "top creator",
    totalPaid: 1500,
    piecesOfContent: 4,
    closedAt: "November 12, 2026",
    closedBy: STAFF.theo,
  },
  {
    id: "col-02",
    creator: { id: "c-03", fullName: "Amara Okafor", photoSeed: 9, profileCompleted: true },
    clientName: "Oura",
    projectName: "Sleep score launch",
    overallRating: "standout",
    totalPaid: 2200,
    piecesOfContent: 5,
    closedAt: "November 10, 2026",
    closedBy: STAFF.priya,
  },
  {
    id: "col-03",
    creator: { id: "c-05", fullName: "Diego Alvarez", photoSeed: 15, profileCompleted: true },
    clientName: "Athletic Brewing",
    projectName: "Summer non-alc hooks",
    overallRating: "good",
    totalPaid: 600,
    piecesOfContent: 3,
    closedAt: "November 6, 2026",
    closedBy: STAFF.maya,
  },
  {
    id: "col-04",
    creator: { id: "c-09", fullName: "Chloé Tremblay", photoSeed: 29, profileCompleted: true },
    clientName: "Nutramax",
    projectName: "Nutramax BAU UGC Ads - Concept 3",
    overallRating: "standout",
    totalPaid: 875,
    piecesOfContent: 3,
    closedAt: "November 4, 2026",
    closedBy: STAFF.lucas,
  },
  {
    id: "col-05",
    creator: { id: "c-07", fullName: "Sofia Rossi", photoSeed: 44, profileCompleted: true },
    clientName: "Liquid Death",
    projectName: "Murder your thirst - Q4",
    overallRating: "sufficient",
    totalPaid: 300,
    piecesOfContent: 2,
    closedAt: "October 30, 2026",
    closedBy: STAFF.camille,
  },
  {
    id: "col-06",
    creator: { id: "c-10", fullName: "Ethan Walsh", photoSeed: 68, profileCompleted: true },
    clientName: "Oura",
    projectName: "Ring Gen4 unboxing",
    overallRating: "problematic",
    totalPaid: 450,
    piecesOfContent: 1,
    closedAt: "October 24, 2026",
    closedBy: STAFF.priya,
  },
  {
    id: "col-07",
    creator: { id: "c-02", fullName: "Noah Fischer", photoSeed: 13, profileCompleted: true },
    clientName: "Glossier",
    projectName: "Futuredew always-on",
    overallRating: "good",
    totalPaid: 1100,
    piecesOfContent: 4,
    closedAt: "October 19, 2026",
    closedBy: STAFF.theo,
  },
  {
    id: "col-08",
    creator: { id: "c-12", fullName: "Isabela Costa", photoSeed: null, profileCompleted: false },
    clientName: "Athletic Brewing",
    projectName: "Summer non-alc hooks",
    overallRating: "untested",
    totalPaid: null,
    piecesOfContent: null,
    closedAt: "October 15, 2026",
    closedBy: null,
  },
  {
    id: "col-09",
    creator: { id: "c-11", fullName: "Yuki Tanaka", photoSeed: 23, profileCompleted: true },
    clientName: "Nutramax",
    projectName: "Cosequin senior dogs",
    overallRating: "standout",
    totalPaid: 1320,
    piecesOfContent: 4,
    closedAt: "October 8, 2026",
    closedBy: STAFF.lucas,
  },
  {
    id: "col-10",
    creator: { id: "c-04", fullName: "Léa Moreau", photoSeed: 20, profileCompleted: true },
    clientName: "Liquid Death",
    projectName: "Murder your thirst - Q4",
    overallRating: "good",
    totalPaid: 520,
    piecesOfContent: 2,
    closedAt: "October 2, 2026",
    closedBy: STAFF.camille,
  },
];

export const COLLABORATION_TOTAL = 128;

export const COLLABORATION_FILTER_OPTIONS = {
  clients: ["Glossier", "Oura", "Athletic Brewing", "Nutramax", "Liquid Death"].map((name) => ({
    value: name,
    label: name,
  })),
  campaigns: [
    "Holiday gifting UGC",
    "Sleep score launch",
    "Summer non-alc hooks",
    "Nutramax BAU UGC Ads - Concept 3",
    "Murder your thirst - Q4",
  ].map((name) => ({ value: name, label: name })),
  closedBy: Object.values(STAFF).map((member) => ({
    value: member.id,
    label: member.name,
    imageUrl: member.imageUrl,
  })),
};

export const DISCOVERY_STATUSES = ["backlog", "todo", "in_progress", "done"] as const;
export type DiscoveryStatus = (typeof DISCOVERY_STATUSES)[number];

export const DISCOVERY_STATUS_LABELS: Record<DiscoveryStatus, string> = {
  backlog: "Backlog",
  todo: "To-do",
  in_progress: "In progress",
  done: "Done",
};

export type DiscoveryPriority = "urgent" | "high" | "medium" | "low";

export const DISCOVERY_PRIORITY_LABELS: Record<DiscoveryPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export type DiscoveryRequest = {
  id: string;
  clientName: string | null;
  status: DiscoveryStatus;
  priority: DiscoveryPriority | null;
  deadline: string | null;
  overdue: boolean;
  assignees: StaffMember[];
  profilesFound: number;
  profilesToSource: number;
};

export const DISCOVERY_REQUESTS: DiscoveryRequest[] = [
  {
    id: "dr-01",
    clientName: "Liquid Death",
    status: "backlog",
    priority: "low",
    deadline: "Dec 18, 2026",
    overdue: false,
    assignees: [],
    profilesFound: 0,
    profilesToSource: 30,
  },
  {
    id: "dr-02",
    clientName: null,
    status: "backlog",
    priority: null,
    deadline: null,
    overdue: false,
    assignees: [STAFF.camille],
    profilesFound: 0,
    profilesToSource: 15,
  },
  {
    id: "dr-03",
    clientName: "Glossier",
    status: "todo",
    priority: "high",
    deadline: "Dec 4, 2026",
    overdue: false,
    assignees: [STAFF.priya, STAFF.lucas],
    profilesFound: 6,
    profilesToSource: 40,
  },
  {
    id: "dr-04",
    clientName: "Oura",
    status: "todo",
    priority: "medium",
    deadline: "Dec 10, 2026",
    overdue: false,
    assignees: [STAFF.theo],
    profilesFound: 0,
    profilesToSource: 25,
  },
  {
    id: "dr-05",
    clientName: "Nutramax",
    status: "in_progress",
    priority: "urgent",
    deadline: "Nov 26, 2026",
    overdue: false,
    assignees: [STAFF.maya, STAFF.priya, STAFF.theo, STAFF.camille],
    profilesFound: 18,
    profilesToSource: 40,
  },
  {
    id: "dr-06",
    clientName: "Athletic Brewing",
    status: "in_progress",
    priority: "high",
    deadline: "Dec 1, 2026",
    overdue: false,
    assignees: [STAFF.lucas],
    profilesFound: 31,
    profilesToSource: 50,
  },
  {
    id: "dr-07",
    clientName: "Oura",
    status: "done",
    priority: "medium",
    deadline: "Nov 14, 2026",
    overdue: false,
    assignees: [STAFF.theo, STAFF.maya],
    profilesFound: 25,
    profilesToSource: 25,
  },
  {
    id: "dr-08",
    clientName: "Glossier",
    status: "done",
    priority: "low",
    deadline: "Nov 7, 2026",
    overdue: false,
    assignees: [STAFF.priya],
    profilesFound: 22,
    profilesToSource: 20,
  },
];

const OVERDUE_IDS: Record<string, string> = {
  "dr-03": "Nov 18, 2026",
  "dr-05": "Nov 20, 2026",
  "dr-04": "Nov 21, 2026",
};

export const DISCOVERY_REQUESTS_OVERDUE: DiscoveryRequest[] = DISCOVERY_REQUESTS.map((request) => {
  const overdueDeadline = OVERDUE_IDS[request.id];
  return overdueDeadline ? { ...request, deadline: overdueDeadline, overdue: true } : request;
});

export type DiscoveryApprovalStatus = "pending" | "approved" | "rejected";

export const DISCOVERY_APPROVAL_STATUS_LABELS: Record<DiscoveryApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export type SourcedProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  channels: Platform[];
  portfolioUrl: string | null;
  sampleContentUrl: string | null;
  location: string | null;
  source: string | null;
  discoveredBy: StaffMember | null;
  createdAt: string;
  approvalStatus: DiscoveryApprovalStatus;
};

export const SOURCED_PROFILES: SourcedProfile[] = [
  {
    id: "sp-01",
    fullName: "Ava Bennett",
    email: "ava.bennett@gmail.com",
    channels: ["TikTok", "Instagram"],
    portfolioUrl: "https://avabennett.co",
    sampleContentUrl: "https://tiktok.com/@avabennett/video/7312",
    location: "Austin, TX",
    source: "Modash",
    discoveredBy: STAFF.priya,
    createdAt: "Nov 19, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-02",
    fullName: "Kofi Mensah",
    email: "kofi@mensahmedia.com",
    channels: ["YouTube"],
    portfolioUrl: null,
    sampleContentUrl: "https://youtube.com/watch?v=Kq3x",
    location: "Toronto, ON",
    source: "UGC Hub/Pool",
    discoveredBy: STAFF.lucas,
    createdAt: "Nov 19, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-03",
    fullName: "Mia Laurent",
    email: null,
    channels: ["Instagram"],
    portfolioUrl: "https://mialaurent.fr",
    sampleContentUrl: null,
    location: "Montréal, QC",
    source: "Instagram",
    discoveredBy: STAFF.priya,
    createdAt: "Nov 18, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-04",
    fullName: "Jordan Price",
    email: "jordan.price@outlook.com",
    channels: ["TikTok"],
    portfolioUrl: null,
    sampleContentUrl: "https://tiktok.com/@jprice/video/7290",
    location: "Denver, CO",
    source: "Collabstr",
    discoveredBy: STAFF.lucas,
    createdAt: "Nov 18, 2026",
    approvalStatus: "rejected",
  },
  {
    id: "sp-05",
    fullName: "Elena Petrova",
    email: "elena.p@gmail.com",
    channels: ["Instagram", "TikTok", "YouTube"],
    portfolioUrl: "https://elenapetrova.com",
    sampleContentUrl: "https://instagram.com/reel/C9x",
    location: "Miami, FL",
    source: "Modash",
    discoveredBy: STAFF.maya,
    createdAt: "Nov 17, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-06",
    fullName: null,
    email: "hello@sunnysideugc.com",
    channels: ["TikTok"],
    portfolioUrl: null,
    sampleContentUrl: null,
    location: null,
    source: "Backstage",
    discoveredBy: null,
    createdAt: "Nov 17, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-07",
    fullName: "Rafael Nunes",
    email: "rafa.nunes@gmail.com",
    channels: ["Instagram"],
    portfolioUrl: "https://rafanunes.studio",
    sampleContentUrl: "https://instagram.com/reel/D1k",
    location: "Lisbon, PT",
    source: "Joinbrands",
    discoveredBy: STAFF.theo,
    createdAt: "Nov 16, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-08",
    fullName: "Grace Liu",
    email: "grace@graceliu.tv",
    channels: ["YouTube", "TikTok"],
    portfolioUrl: null,
    sampleContentUrl: "https://youtube.com/watch?v=Gl9",
    location: "Vancouver, BC",
    source: "Fiverr",
    discoveredBy: STAFF.priya,
    createdAt: "Nov 15, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-09",
    fullName: "Noah Whitfield",
    email: "noah@whitfieldcreates.com",
    channels: ["Instagram"],
    portfolioUrl: null,
    sampleContentUrl: "https://instagram.com/reel/E2m",
    location: "Austin, TX",
    source: "Modash",
    discoveredBy: STAFF.camille,
    createdAt: "Nov 14, 2026",
    approvalStatus: "rejected",
  },
  {
    id: "sp-10",
    fullName: "Sofia Marchetti",
    email: "sofia.marchetti@gmail.com",
    channels: ["TikTok", "Instagram"],
    portfolioUrl: "https://sofiamarchetti.it",
    sampleContentUrl: "https://tiktok.com/@sofiam/video/7301",
    location: "Toronto, ON",
    source: "Modash",
    discoveredBy: STAFF.camille,
    createdAt: "Nov 14, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-11",
    fullName: "Priscilla Owusu",
    email: "hello@priscillaowusu.com",
    channels: ["YouTube"],
    portfolioUrl: "https://priscillaowusu.com",
    sampleContentUrl: "https://youtube.com/watch?v=Po4",
    location: "Atlanta, GA",
    source: "Collabstr",
    discoveredBy: STAFF.lucas,
    createdAt: "Nov 13, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-12",
    fullName: "Liam Carter",
    email: null,
    channels: ["TikTok"],
    portfolioUrl: null,
    sampleContentUrl: "https://tiktok.com/@liamcarter/video/7288",
    location: "Portland, OR",
    source: "Backstage",
    discoveredBy: STAFF.priya,
    createdAt: "Nov 13, 2026",
    approvalStatus: "rejected",
  },
  {
    id: "sp-13",
    fullName: "Hana Sato",
    email: "hana.sato@outlook.com",
    channels: ["Instagram", "YouTube"],
    portfolioUrl: null,
    sampleContentUrl: "https://instagram.com/reel/C7s",
    location: "Seattle, WA",
    source: "Modash",
    discoveredBy: STAFF.theo,
    createdAt: "Nov 12, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-14",
    fullName: "Marcus Reid",
    email: "marcus@reidfilms.co",
    channels: ["YouTube", "Instagram"],
    portfolioUrl: "https://reidfilms.co",
    sampleContentUrl: "https://youtube.com/watch?v=Mr2",
    location: "Chicago, IL",
    source: "UGC Hub/Pool",
    discoveredBy: STAFF.maya,
    createdAt: "Nov 12, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-15",
    fullName: "Chloé Dubois",
    email: "chloe.dubois@gmail.com",
    channels: ["Instagram"],
    portfolioUrl: null,
    sampleContentUrl: "https://instagram.com/reel/B8d",
    location: "Montréal, QC",
    source: "Instagram",
    discoveredBy: STAFF.camille,
    createdAt: "Nov 11, 2026",
    approvalStatus: "rejected",
  },
  {
    id: "sp-16",
    fullName: "Daniel Okafor",
    email: "daniel.okafor@gmail.com",
    channels: ["TikTok"],
    portfolioUrl: "https://danielokafor.me",
    sampleContentUrl: "https://tiktok.com/@dokafor/video/7276",
    location: "Houston, TX",
    source: "Joinbrands",
    discoveredBy: STAFF.lucas,
    createdAt: "Nov 11, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-17",
    fullName: "Isabel Romero",
    email: "isabel@romerougc.com",
    channels: ["Instagram", "TikTok"],
    portfolioUrl: "https://romerougc.com",
    sampleContentUrl: "https://instagram.com/reel/A3r",
    location: "San Diego, CA",
    source: "Modash",
    discoveredBy: STAFF.priya,
    createdAt: "Nov 10, 2026",
    approvalStatus: "approved",
  },
  {
    id: "sp-18",
    fullName: null,
    email: "team@pawsandpixels.co",
    channels: ["Instagram"],
    portfolioUrl: null,
    sampleContentUrl: null,
    location: null,
    source: "Fiverr",
    discoveredBy: null,
    createdAt: "Nov 10, 2026",
    approvalStatus: "pending",
  },
  {
    id: "sp-19",
    fullName: "Ethan Brooks",
    email: "ethan.brooks@gmail.com",
    channels: ["YouTube"],
    portfolioUrl: null,
    sampleContentUrl: "https://youtube.com/watch?v=Eb7",
    location: "Nashville, TN",
    source: "Collabstr",
    discoveredBy: STAFF.theo,
    createdAt: "Nov 9, 2026",
    approvalStatus: "rejected",
  },
  {
    id: "sp-20",
    fullName: "Zoe Kim",
    email: "zoe@zoekimcreative.com",
    channels: ["TikTok", "YouTube"],
    portfolioUrl: "https://zoekimcreative.com",
    sampleContentUrl: "https://tiktok.com/@zoekim/video/7265",
    location: "Vancouver, BC",
    source: "Modash",
    discoveredBy: STAFF.maya,
    createdAt: "Nov 9, 2026",
    approvalStatus: "approved",
  },
];

export const DISCOVERY_REQUEST_DETAIL = {
  ...DISCOVERY_REQUESTS[4],
  createdAt: "Nov 12, 2026",
  platforms: ["TikTok", "Instagram", "YouTube"],
  tiers: ["Micro (10K-50K)", "Mid (50K-250K)"],
  contactDetails: ["Email only"],
  personasTopics: "Dog owners 30-55, senior pets, joint health, vet-recommended routines",
  deliverables: "3 x 30s testimonial videos per creator, raw footage included",
  briefUrl: "https://docs.google.com/document/d/nutramax-discovery-brief",
  notes:
    "Client wants creators who already show their own dog on camera.\nAvoid anyone who promoted a competing supplement in the last 6 months.",
  blacklist:
    "No creators who posted about raw-food diets. No Cosequin competitors (Dasuquin, Zesty Paws).",
  references: "@thegoldenbrothers, @tuckerbudzyn",
  author: STAFF.camille,
  completedAt: null as string | null,
  canManage: true,
};

export type ClientProject = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  totalCreators: number;
  totalSubmissions: number;
  members: StaffMember[];
};

export const CLIENT = {
  id: "cl-glossier",
  name: "Glossier",
  description: "Skincare and beauty DTC brand. Always-on UGC for paid social and gifting moments.",
};

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: "p-1",
    name: "Holiday gifting UGC",
    description: "Gift-guide hooks for Balm Dotcom and Boy Brow bundles.",
    createdAt: "November 3, 2026",
    totalCreators: 12,
    totalSubmissions: 41,
    members: [STAFF.theo, STAFF.maya],
  },
  {
    id: "p-2",
    name: "Futuredew always-on",
    description: "Monthly testimonial batches for Meta and TikTok ads.",
    createdAt: "September 15, 2026",
    totalCreators: 8,
    totalSubmissions: 63,
    members: [STAFF.priya, STAFF.theo, STAFF.camille],
  },
  {
    id: "p-3",
    name: "You perfume - Q3 seeding",
    description: null,
    createdAt: "July 22, 2026",
    totalCreators: 15,
    totalSubmissions: 38,
    members: [STAFF.lucas],
  },
  {
    id: "p-4",
    name: "Cloud Paint spring launch",
    description: "Unboxing and swatch videos, 9:16 and 4:5.",
    createdAt: "March 9, 2026",
    totalCreators: 6,
    totalSubmissions: 22,
    members: [],
  },
];

export const formatMoney = (amount: number) =>
  `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const campaignCount = (count: number) =>
  `${count} ${count === 1 ? "campaign" : "campaigns"}`;
