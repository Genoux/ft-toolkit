export const CONTRACTS_USER = {
  name: "Amaka Obi",
  email: "amaka@fieldtrip.agency",
  avatarUrl: "https://i.pravatar.cc/80?img=49",
};

export const CONTRACTS_ACCESS = { role: "admin", entity: "inBeat" };

export type ContractStatus = "draft" | "in_review" | "escalated" | "approved" | "signed";
export type ReviewTier = "within" | "outside";
export type Entity = "inBeat" | "Creative Milkshake" | "Content Allies" | "AAG";

export type Contract = {
  id: string;
  counterparty: string;
  template: string;
  entity: Entity;
  status: ContractStatus;
  review: ReviewTier | null;
  escalationHoursLeft?: number;
  updated: string;
};

export const CONTRACTS: Contract[] = [
  {
    id: "FT-1042",
    counterparty: "Oura Health Oy",
    template: "MSA",
    entity: "inBeat",
    status: "escalated",
    review: "outside",
    escalationHoursLeft: -9,
    updated: "2h ago",
  },
  {
    id: "FT-1041",
    counterparty: "Athletic Brewing Co.",
    template: "SOW",
    entity: "Creative Milkshake",
    status: "in_review",
    review: null,
    updated: "4h ago",
  },
  {
    id: "FT-1039",
    counterparty: "Glossier Inc.",
    template: "MSA",
    entity: "Content Allies",
    status: "approved",
    review: "within",
    updated: "Yesterday",
  },
  {
    id: "FT-1036",
    counterparty: "Huel Ltd.",
    template: "SOW",
    entity: "AAG",
    status: "escalated",
    review: "outside",
    escalationHoursLeft: 31,
    updated: "Nov 18",
  },
  {
    id: "FT-1034",
    counterparty: "Liquid Death Mountain Water",
    template: "NDA",
    entity: "inBeat",
    status: "signed",
    review: "within",
    updated: "Nov 17",
  },
];

export type AccessRole = "manager" | "head" | "people" | "finance" | "it";

export const ROLE_LABEL: Record<AccessRole, string> = {
  manager: "Manager",
  head: "Head",
  people: "People",
  finance: "Finance",
  it: "IT",
};

export type AccessMember = {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  role: AccessRole;
  joinedOn: string | null;
  lastActiveOn: string | null;
  invitedOn: string;
  invitedBy: string;
};

export const ACCESS_VIEWER_ID = "p1";

export const ACCESS_USER = {
  name: "Maya Thompson",
  email: "maya@inbeat.agency",
  avatarUrl: "https://i.pravatar.cc/80?img=45",
};

export const ACCESS_MEMBERS: AccessMember[] = [
  {
    id: "p1",
    name: "Maya Thompson",
    email: "maya@inbeat.agency",
    imageUrl: "https://i.pravatar.cc/80?img=45",
    role: "people",
    joinedOn: "Sep 2, 2026",
    lastActiveOn: "Nov 23, 2026",
    invitedOn: "Sep 1, 2026",
    invitedBy: "Jordan Lee",
  },
  {
    id: "p2",
    name: "Jordan Lee",
    email: "jordan@inbeat.agency",
    imageUrl: "https://i.pravatar.cc/80?img=13",
    role: "head",
    joinedOn: "Sep 1, 2026",
    lastActiveOn: "Nov 21, 2026",
    invitedOn: "Sep 1, 2026",
    invitedBy: "Maya Thompson",
  },
  {
    id: "p3",
    name: "Priya Shah",
    email: "priya@inbeat.agency",
    imageUrl: "https://i.pravatar.cc/80?img=32",
    role: "finance",
    joinedOn: "Sep 8, 2026",
    lastActiveOn: "Nov 19, 2026",
    invitedOn: "Sep 4, 2026",
    invitedBy: "Maya Thompson",
  },
  {
    id: "p4",
    name: "Sofia Marin",
    email: "sofia@inbeat.agency",
    imageUrl: "https://i.pravatar.cc/80?img=26",
    role: "manager",
    joinedOn: "Oct 14, 2026",
    lastActiveOn: null,
    invitedOn: "Oct 13, 2026",
    invitedBy: "Jordan Lee",
  },
  {
    id: "p5",
    name: "Marc Dubois",
    email: "marc@inbeat.agency",
    imageUrl: null,
    role: "manager",
    joinedOn: null,
    lastActiveOn: null,
    invitedOn: "Nov 20, 2026",
    invitedBy: "Maya Thompson",
  },
  {
    id: "p6",
    name: "Lea Martin",
    email: "lea@inbeat.agency",
    imageUrl: null,
    role: "it",
    joinedOn: null,
    lastActiveOn: null,
    invitedOn: "Nov 22, 2026",
    invitedBy: "Jordan Lee",
  },
];
