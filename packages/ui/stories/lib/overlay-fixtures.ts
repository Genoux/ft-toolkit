// Copy and options from the apps' real overlays, so the overlay stories show OUR content.
// Pool: ugc-hub/src (shared/config/constants.ts, features/clients, features/projects).
// I&R: impact-and-recognition/src (features/requests, features/access, app/design/_fixtures.ts).
// Proof: proof-agent/src (features/clients, features/sessions).

export const POOL_BRAND_INTERESTS = [
  "Alcohol",
  "Automotive",
  "Baby & Kids",
  "Beauty",
  "Cannabis",
  "Crypto",
  "Dating",
  "Education",
  "Electronics",
  "Entertainment",
  "Fashion",
  "Finance",
  "Fitness",
  "Food & Beverage",
  "Gambling",
  "Gaming",
  "Home Improvement",
  "Insurance",
  "Jewelry",
  "Legal",
  "Luxury",
  "Medical",
  "Mental Health",
  "Music",
  "Nonprofit",
  "Outdoors",
  "Parenting",
  "Personal Care",
  "Pets",
  "Real Estate",
  "Restaurants",
  "Sports",
  "Supplements",
  "Sustainability",
  "Tech",
  "Telecom",
  "Toys",
  "Travel",
  "Wellness",
  "Other",
].map((label) => ({ value: label, label }));

export const POOL_BRAND_TYPES = [
  "DTC",
  "Retail / CPG",
  "App",
  "Subscription",
  "B2B / SaaS",
  "Marketplace",
  "Service",
  "Other",
].map((label) => ({ value: label, label }));

export const POOL_SORT_OPTIONS = [
  "Best performers",
  "Newest",
  "Most collabs",
  "Rate: Low to High",
  "Rate: High to Low",
];

export const IR_ROLES = ["Manager", "Head", "People", "Finance", "IT"];

export const PROOF_SCOPE_LANGUAGES = ["English (US)", "French (Canada)", "German"];
