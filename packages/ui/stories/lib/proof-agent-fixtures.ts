export const PROOF_USER = {
  name: "Camille Roy",
  email: "camille@inbeat.agency",
  avatarUrl: "https://i.pravatar.cc/80?img=44",
};

export type BatchStatus = "none" | "processing" | "complete" | "error";

export type SidebarSession = {
  id: string;
  title: string;
  clientCode: string;
  batchStatus: BatchStatus;
};

export const MY_SESSIONS: SidebarSession[] = [
  { id: "s1", title: "Holiday UGC round 2", clientCode: "OURA", batchStatus: "processing" },
  { id: "s2", title: "Gen3 statics for Meta", clientCode: "OURA", batchStatus: "complete" },
  { id: "s3", title: "Spring launch captions", clientCode: "ATHB", batchStatus: "none" },
  { id: "s4", title: "Founders cut review", clientCode: "LQDT", batchStatus: "error" },
];

export const TEAM_SESSIONS: SidebarSession[] = [
  { id: "s5", title: "Glow serum whitelisting", clientCode: "GLSR", batchStatus: "none" },
  { id: "s6", title: "Q1 TikTok scripts", clientCode: "NTMX", batchStatus: "none" },
  { id: "s7", title: "Retargeting cutdowns", clientCode: "OURA", batchStatus: "none" },
];

export const ACTIVE_SESSION = {
  clientName: "Oura",
  clientCode: "OURA",
  title: "Holiday UGC round 2",
  createdBy: { name: "Camille Roy", imageUrl: "https://i.pravatar.cc/80?img=44" },
  instruction: "Focus on the sleep claims; the client flagged medical wording last round.",
  language: "en-us",
};

export const SESSION_LANGUAGES = [
  { value: "en-us", label: "English (US)" },
  { value: "fr-ca", label: "French (Canada)" },
  { value: "de", label: "German" },
];

export type AssetType = "video" | "image" | "text";
export type RunStatus = "processing" | "complete" | "error" | "cancelled";
export type FindingTier = "issue" | "unsure";
export type ResultTier = FindingTier | "pass";

export type FindingField = { label: string; value: string; href?: string };

export type Finding = {
  id: string;
  title: string;
  tier: FindingTier;
  issueType?: string;
  narrative: string;
  fields: FindingField[];
};

export type CheckRow = {
  id: string;
  title: string;
  description?: string;
  verdict: "pass" | "unsure";
};

export type CheckTab = { id: string; label: string; findings: Finding[]; checkRows: CheckRow[] };

export type ReviewRun = {
  id: string;
  assetLabel: string;
  assetType: AssetType;
  integration?: "Google Drive";
  status: RunStatus;
  resultTier?: ResultTier;
  language: string;
  lastRun: string;
  rulesChanged?: boolean;
  errorMessage?: string;
  progress?: { label: string; elapsed: string; attempt?: number };
  tabs?: CheckTab[];
};

const passRow = (id: string, title: string, description?: string): CheckRow => ({
  id,
  title,
  description,
  verdict: "pass",
});

export const HOLIDAY_VIDEO_RUN: ReviewRun = {
  id: "r1",
  assetLabel: "OURA_Holiday_UGC_v3.mp4",
  assetType: "video",
  integration: "Google Drive",
  status: "complete",
  resultTier: "issue",
  language: "English (US)",
  lastRun: "4 min ago",
  tabs: [
    {
      id: "neverSay",
      label: "Never say",
      findings: [
        {
          id: "f1",
          title: "Banned claim: “cures insomnia”",
          tier: "issue",
          issueType: "Medical claim",
          narrative:
            "The creator says the ring cures insomnia. Oura bans any wording that presents the ring as a treatment.",
          fields: [
            { label: "Timestamp", value: "00:00:17", href: "#t=17" },
            { label: "Banned term", value: "cures insomnia" },
            { label: "Detected text", value: "honestly this ring basically cures insomnia" },
          ],
        },
      ],
      checkRows: [],
    },
    {
      id: "typos",
      label: "Typos",
      findings: [
        {
          id: "f2",
          title: "Typo in on-screen caption",
          tier: "issue",
          narrative: "“you’re” should be the possessive “your”.",
          fields: [
            { label: "Timestamp", value: "00:00:04", href: "#t=4" },
            { label: "Found in", value: "Track you’re sleep, not just your steps" },
            { label: "Suggested", value: "Track your sleep, not just your steps" },
          ],
        },
      ],
      checkRows: [],
    },
    {
      id: "mustAppear",
      label: "Disclaimers",
      findings: [
        {
          id: "f3",
          title: "Required disclaimer not confirmed",
          tier: "unsure",
          narrative:
            "The disclaimer was not found on screen or in captions. It may be spoken under the music; listen to the last five seconds.",
          fields: [{ label: "Required text", value: "Oura Ring is not a medical device." }],
        },
      ],
      checkRows: [],
    },
    {
      id: "customRule",
      label: "Custom rules",
      findings: [
        {
          id: "f4",
          title: "Wordmark on screen for under 2 seconds",
          tier: "unsure",
          narrative: "The end card shows the wordmark for about 1.5 seconds before the cut.",
          fields: [
            { label: "Timestamp", value: "00:00:28", href: "#t=28" },
            {
              label: "Custom rule",
              value:
                "The Oura wordmark must stay on screen for at least 2 seconds in the final frame, centred, on a plain background.",
            },
          ],
        },
      ],
      checkRows: [],
    },
    {
      id: "video_quality",
      label: "Video quality",
      findings: [],
      checkRows: [passRow("vq", "Video quality", "1080×1920, steady exposure, no dropped frames.")],
    },
    {
      id: "audio_quality",
      label: "Audio quality",
      findings: [],
      checkRows: [passRow("aq", "Audio quality", "Voice is clear over the music bed.")],
    },
  ],
};

export const STATIC_IMAGE_RUN: ReviewRun = {
  id: "r2",
  assetLabel: "Gen3_Static_1080x1350.png",
  assetType: "image",
  status: "complete",
  resultTier: "pass",
  language: "English (US)",
  lastRun: "12 min ago",
  tabs: [
    {
      id: "typos",
      label: "Typos",
      findings: [],
      checkRows: [passRow("t", "Typos", "Headline and legal line read correctly.")],
    },
    {
      id: "sayThis",
      label: "Say this (instead of)",
      findings: [],
      checkRows: [passRow("st", "Say this (instead of)")],
    },
  ],
};

export const CAPTION_RUN: ReviewRun = {
  id: "r3",
  assetLabel: "Your sleep grade just got a glow-up. Here’s how I…",
  assetType: "text",
  status: "complete",
  resultTier: "unsure",
  language: "English (US)",
  lastRun: "18 min ago",
  tabs: [
    {
      id: "sayThis",
      label: "Say this (instead of)",
      findings: [
        {
          id: "f5",
          title: "Use “sleep score”, not “sleep grade”",
          tier: "unsure",
          narrative: "Oura’s naming is “sleep score”. The caption may be quoting the creator.",
          fields: [
            { label: "Preferred phrasing", value: "Say “sleep score” instead of “sleep grade”." },
            { label: "Detected text", value: "Your sleep grade just got a glow-up" },
            { label: "Suggested", value: "Your sleep score just got a glow-up" },
          ],
        },
      ],
      checkRows: [],
    },
  ],
};

export const STALE_RULES_RUN: ReviewRun = {
  id: "r4",
  assetLabel: "OURA_Holiday_Cutdown_15s.mp4",
  assetType: "video",
  integration: "Google Drive",
  status: "complete",
  resultTier: "pass",
  language: "English (US)",
  lastRun: "Yesterday",
  rulesChanged: true,
  tabs: STATIC_IMAGE_RUN.tabs,
};

export const PROCESSING_RUN: ReviewRun = {
  id: "r5",
  assetLabel: "OURA_Holiday_UGC_v4.mp4",
  assetType: "video",
  integration: "Google Drive",
  status: "processing",
  language: "English (US)",
  lastRun: "Just now",
  progress: { label: "Double-checking visual findings (3 of 5)", elapsed: "1:42" },
};

export const RETRYING_RUN: ReviewRun = {
  id: "r6",
  assetLabel: "OURA_Unboxing_Raw.mov",
  assetType: "video",
  status: "processing",
  language: "English (US)",
  lastRun: "Just now",
  progress: {
    label: "Listing brands, captions and spoken words",
    elapsed: "3:05",
    attempt: 2,
  },
};

export const ERROR_RUN: ReviewRun = {
  id: "r7",
  assetLabel: "Founders_Cut_FINAL.mov",
  assetType: "video",
  status: "error",
  language: "English (US)",
  lastRun: "6 min ago",
  errorMessage:
    "This file couldn't be read. It may be corrupted or in an unsupported format — try re-uploading it.",
};

export const CANCELLED_RUN: ReviewRun = {
  id: "r8",
  assetLabel: "Gen3_Static_Alt_1080x1080.png",
  assetType: "image",
  status: "cancelled",
  language: "English (US)",
  lastRun: "20 min ago",
};

export type StagedAsset = { id: string; name: string; kind: "Google Drive" | "Video" | "Image" };

export const STAGED_ASSETS: StagedAsset[] = [
  { id: "a1", name: "OURA_Holiday_UGC_v5.mp4", kind: "Google Drive" },
  { id: "a2", name: "Gen3_Story_1080x1920.png", kind: "Image" },
  { id: "a3", name: "Gen3_Story_Alt.png", kind: "Image" },
];

export const CLIENT = {
  name: "Oura",
  code: "OURA",
  updated: "3 min ago",
};

export const CLIENT_LANGUAGES = [
  { id: "en-us", label: "English (US)", isDefault: true },
  { id: "fr-ca", label: "French (Canada)", isDefault: false },
  { id: "de", label: "German", isDefault: false },
];

export const PRODUCTS = ["Oura Ring 4", "Oura Ring Gen3", "Oura Membership"];

export type CustomRule = {
  id: string;
  title: string;
  kind: "file" | "text" | "url";
  description: string;
};

export const CUSTOM_RULES: CustomRule[] = [
  {
    id: "cr1",
    title: "Brand guidelines 2026.pdf",
    kind: "file",
    description: "Document",
  },
  {
    id: "cr2",
    title: "Wordmark end card",
    kind: "text",
    description:
      "The Oura wordmark must stay on screen for at least 2 seconds in the final frame, centred, on a plain background.",
  },
  {
    id: "cr3",
    title: "No before/after sleep charts",
    kind: "text",
    description:
      "Never show a sleep chart next to a “before Oura” chart; it reads as a clinical result.",
  },
  {
    id: "cr4",
    title: "Holiday campaign brief",
    kind: "url",
    description: "External link — not read during review. Replace with text or a PDF.",
  },
];

export const NEVER_SAY_RULES = [
  { id: "ns1", term: "cures insomnia", note: "Medical claim" },
  { id: "ns2", term: "medical-grade", note: "Regulatory: the ring is not a medical device" },
  { id: "ns3", term: "diagnoses", note: "Medical claim" },
  { id: "ns4", term: "guaranteed better sleep", note: "Outcome promise" },
  { id: "ns5", term: "Oura band", note: "Product is always “Oura Ring”" },
];
