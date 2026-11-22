export const APP_NAME = "RentRig";
export const APP_TAGLINE = "Rent the right rig, right on time.";

export const CATEGORIES = [
  {
    name: "Construction Equipment",
    short: "Construction",
    icon: "construction",
    blurb: "Excavators, mixers, scaffolding & more for any site.",
  },
  {
    name: "Photography Equipment",
    short: "Photography",
    icon: "camera",
    blurb: "Cinema cameras, lenses, lights and gimbals.",
  },
  {
    name: "Vehicles & Transportation",
    short: "Vehicles",
    icon: "vehicle",
    blurb: "Microbuses, pickups and cargo trucks on demand.",
  },
  {
    name: "Agriculture Equipment",
    short: "Agriculture",
    icon: "agriculture",
    blurb: "Tractors, tillers and harvest tools by the season.",
  },
  {
    name: "Electronics",
    short: "Electronics",
    icon: "electronics",
    blurb: "Laptops, projectors and pro audio for any project.",
  },
  {
    name: "Event Equipment",
    short: "Events",
    icon: "event",
    blurb: "Stage lights, PA systems and tents for big days.",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const RENTAL_TYPES = [
  { value: "daily", label: "Daily", unit: "day" },
  { value: "weekly", label: "Weekly", unit: "week" },
  { value: "monthly", label: "Monthly", unit: "month" },
];

export const CONDITIONS = ["Brand New", "Like New", "Excellent", "Good", "Fair"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Recently Added" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
];

export const BOOKING_STATUS_STYLES = {
  confirmed: "badge-info",
  active: "badge-warning",
  completed: "badge-success",
  cancelled: "badge-error",
};

export const PAYMENT_STATUS_STYLES = {
  paid: "badge-success",
  "refund pending": "badge-warning",
  unpaid: "badge-ghost",
};

export const EQUIPMENT_STATUS_STYLES = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

export const ROLE_STYLES = {
  admin: "badge-secondary",
  owner: "badge-accent",
  customer: "badge-primary",
};
