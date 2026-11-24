/** Pool's discovery request platforms (ugc-hub src/features/discovery/schemas.ts). */
export const PLATFORMS = [
  "TikTok",
  "Instagram",
  "YouTube",
  "Facebook",
  "X",
  "LinkedIn",
  "Substack",
  "Twitch",
];

/** Pool's creator content formats (ugc-hub creator profile Tags). */
export const CONTENT_FORMATS = [
  "Aesthetic",
  "ASMR",
  "Humor & Skits",
  "Mobile Apps",
  "Podcasts",
  "Professional Camera",
  "Street Interviews",
  "Product Demo",
  "Unboxing",
  "Testimonial / Review",
  "Voiceover",
  "Tutorial / How-to",
  "UGC-style Ad Read",
];

/** Pool's discovery request priority select. */
export const DISCOVERY_PRIORITIES = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

/** Pool's discovery request status pill select, on toolkit tones. */
export const DISCOVERY_STATUSES = [
  { value: "backlog", label: "Backlog", tone: "neutral" },
  { value: "todo", label: "To-do", tone: "warning" },
  { value: "in_progress", label: "In progress", tone: "info" },
  { value: "done", label: "Done", tone: "success" },
] as const;

/** Pool's collaboration ratings: one toggle-pill group per quality. */
export const COLLABORATION_RATINGS = ["standout", "good", "sufficient", "problematic", "untested"];

/** Pool's collaboration wizard steps (close mode). */
export const COLLABORATION_STEPS = [
  { label: "Details" },
  { label: "Rates" },
  { label: "Ratings" },
  { label: "Portfolio" },
  { label: "Confirm" },
];

/** I&R's request type choice. */
export const REQUEST_KINDS = [
  { value: "increase", label: "Increase", hint: "Same role, higher pay" },
  { value: "promotion", label: "Promotion", hint: "New level and title" },
] as const;

/** I&R's Windmill rating select. */
export const WINDMILL_RATINGS = [
  "Off Track (1)",
  "Room for Improvement (2)",
  "Delivering Impact (3)",
  "Raising the Bar (4)",
];

/** I&R's cycle steps and time zones (impact-and-recognition src/features/settings/components/cycle-date-fields.tsx). */
export const CYCLE_STEPS = [
  { key: "opens", label: "Requests open", date: "2027-04-01", time: "09:00" },
  { key: "submit_by", label: "Requests close", date: "2027-04-30", time: "17:00" },
  { key: "edit_by", label: "Edits close", date: "2027-05-07", time: "17:00" },
  { key: "decision_lock", label: "Decisions lock", date: "2027-05-21", time: "17:00" },
  { key: "release", label: "Released to share", date: "2027-05-28", time: "09:00" },
  { key: "effective", label: "New pay effective", date: "2027-06-01" },
] as const;

export const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern Time (New York)" },
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
  { value: "Europe/London", label: "UK Time (London)" },
  { value: "Europe/Paris", label: "Central European Time (Paris)" },
];

/** Proof's disclaimer placement. */
export const DISCLAIMER_PLACEMENTS = ["On screen", "Caption", "Spoken"];
