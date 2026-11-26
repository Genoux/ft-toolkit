type BatchStatus = "none" | "processing" | "complete" | "error";

type SidebarSession = {
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
type AssetType = "video" | "image" | "text";
type RunStatus = "processing" | "complete" | "error" | "cancelled";
type FindingTier = "issue" | "unsure";
type ResultTier = FindingTier | "pass";

type FindingField = { label: string; value: string; href?: string };

type Finding = {
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

type CheckTab = { id: string; label: string; findings: Finding[]; checkRows: CheckRow[] };

type ReviewRun = {
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
