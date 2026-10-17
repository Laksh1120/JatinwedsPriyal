import type { ReactNode } from "react";

// All wording, names, events and venue details live here. The page layout, animations and styling are shared.
// Which version a deployment shows is chosen at build time with the VITE_SITE environment variable:
//   unset / "groom"  → the groom's side (jatinwedspriyal.vercel.app)
//   "bride"          → the bride's side (priyalwedsjatin.vercel.app)
//   "bride-reception"→ reception-only version at the home page (priyalandjatinwedding.vercel.app)

export type EventItem = {
  image: string;
  alt: string;
  title: string;
  date: [string, string, string];
  time: string;
  day: string;
  note?: string;
};

/** `shift` nudges the name sideways (in em) so the handwritten letters look centred, not just their boxes. */
export type Person = { name: string; shift?: number; lines: ReactNode[] };

export type SiteContent = {
  key: "groom" | "bride";
  siteUrl: string;
  /** path of this version on its site ("" for the home page) */
  path?: string;
  /** false hides the "The Events" title above the event pages */
  showEventsHeading?: boolean;
  meta: { title: string; description: string; imageAlt: string };
  /** sessionStorage key that remembers the envelope was opened */
  envelopeKey: string;
  music: string;
  hero: {
    blessing: string;
    familyTitle: string;
    familyLine: string;
    first: Person;
    connector: string;
    second: Person;
    hashtag: string;
  };
  countdown: { target: string; datesLine: ReactNode; arrivedText: string };
  events: EventItem[];
  venue: {
    name: string;
    area: string;
    directionsUrl: string;
    gettingThere: ReactNode[];
    /** leave both out to hide the Accommodation block */
    checkIn?: string;
    checkOut?: string;
  };
  footerLines: string[];
};

const events: EventItem[] = [
  { image: "/media/welcome-dinner.webp", alt: "Lakeside welcome celebration", title: "Welcome Lunch", date: ["11", "12", "26"], time: "1 PM onwards", day: "Friday" },
  { image: "/media/ring-ceremony.webp", alt: "Rings on a lavender cushion", title: "Ring Ceremony & Sangeet", date: ["11", "12", "26"], time: "5 PM onwards", day: "Friday", note: "Followed by Cocktail Party" },
  { image: "/media/haldi.webp", alt: "Flower haldi seat with marigolds", title: "Phoolon Wali Haldi", date: ["12", "12", "26"], time: "10 AM onwards", day: "Saturday" },
  { image: "/media/baraat.webp", alt: "Baraat procession with dhol", title: "Baraat", date: ["12", "12", "26"], time: "6 PM onwards", day: "Saturday" },
  { image: "/media/reception.webp", alt: "Candlelit reception by the lake", title: "Baraat Swagat & Reception", date: ["12", "12", "26"], time: "8 PM onwards", day: "Saturday" },
  { image: "/media/mandap.webp", alt: "Mandap by the lake at night", title: "Phere", date: ["12", "12", "26"], time: "11 PM onwards", day: "Saturday" },
];

const jatin: Person = {
  name: "Jatin",
  lines: [
    <>(Grand s/o Late Shri Hiranand<br />&amp; Smt. Ganeshidevi Mulchandani)</>,
    <>S/o Mr. Shyam &amp; Mrs. Aarti Mulchandani</>,
  ],
};

const priyal: Person = {
  name: "Priyal",
  shift: -0.057, // the P and the tail of the l sit slightly right of the text box
  lines: [
    <>(Grand d/o Late Shri Shankerlalji<br />&amp; Smt. Sitadevi Bang)</>,
    <>D/o of Mr. Dinesh &amp; Mrs. Meenakshi Bang</>,
  ],
};

export const groom: SiteContent = {
  key: "groom",
  siteUrl: "https://jatinwedspriyal.vercel.app",
  meta: {
    title: "Priyal & Jatin — Wedding Invitation",
    description: "Celebrate Priyal and Jatin at Praveg Lake Resort on December 12, 2026.",
    imageAlt: "Priyal and Jatin's wedding invitation",
  },
  envelopeKey: "priyal-jatin-envelope-opened",
  music: "/media/fade-into-you.mp3",
  hero: {
    blessing: "|| Shri Ganeshay Namah ||",
    familyTitle: "Mulchandani Family",
    familyLine: "Awaits your presence for the wedding celebrations of their beloved son",
    first: jatin,
    connector: "with",
    second: priyal,
    hashtag: "#PriBookedByJatin",
  },
  countdown: {
    target: "2026-12-12T00:00:00+05:30",
    datesLine: <>11<sup className="ordinal">th</sup> &amp; 12<sup className="ordinal">th</sup> December, 2026</>,
    arrivedText: "Today is the day — the lake is waiting.",
  },
  events,
  venue: {
    name: "Praveg Lake Resort",
    area: "Daman",
    directionsUrl: "https://share.google/wXPgCUtC4Ho5l4KOc",
    gettingThere: [
      "6 km from Vapi Railway Station",
      <>127 km from Surat International Airport via NH&nbsp;48</>,
      "164 km from Mumbai International Airport",
    ],
    checkIn: "11/12/2026, 1 PM",
    checkOut: "13/12/2026, 10 AM",
  },
  footerLines: [
    "With hearts full of joy, we invite you to join us in celebrating love, laughter, and the start of a beautiful new chapter.",
    "Your presence and blessings will make this celebration truly memorable.",
  ],
};

// DRAFT: the bride's side starts as a mirror of the groom's (Bang family hosts, Priyal first). Replace the text below
// with the real wording; anything not listed here is inherited from `groom`.
export const bride: SiteContent = {
  ...groom,
  key: "bride",
  siteUrl: "https://priyalwedsjatin.vercel.app",
  meta: {
    title: "Priyal Weds Jatin — Wedding Invitation",
    description: "Celebrate Priyal and Jatin at Praveg Lake Resort on December 12, 2026.",
    imageAlt: "Priyal and Jatin's wedding invitation",
  },
  envelopeKey: "priyal-jatin-envelope-opened-bride",
  hero: {
    ...groom.hero,
    familyTitle: "Bang Family",
    familyLine: "Awaits your presence for the wedding celebrations of their beloved daughter",
    first: priyal,
    connector: "weds",
    // The J's hook starts further right than Priyal's P; nudge Jatin left so both names start at the same margin.
    second: { ...jatin, shift: -0.18 },
  },
  // No separate Baraat page on the bride's side ("Baraat Swagat & Reception" stays).
  events: events.filter((event) => event.title !== "Baraat"),
};

// Reception-only guests (bride's side): just "Baraat Swagat & Reception", no "The Events" title. Served at /wedding.
export const brideReception: SiteContent = {
  ...bride,
  siteUrl: "https://priyalandjatinwedding.vercel.app", // this version is shared as priyalandjatinwedding.vercel.app
  path: "/wedding",
  showEventsHeading: false,
  envelopeKey: "priyal-jatin-envelope-opened-bride-reception",
  events: bride.events.filter((event) => event.title === "Baraat Swagat & Reception"),
  // Reception-only guests do not need accommodation, and the only date that matters is the 12th.
  venue: { ...bride.venue, checkIn: undefined, checkOut: undefined },
  countdown: {
    ...bride.countdown,
    target: "2026-12-12T00:00:00+05:30",
    datesLine: <>12<sup className="ordinal">th</sup> December, 2026</>,
  },
};

const variant = (import.meta as unknown as { env?: { VITE_SITE?: string } }).env?.VITE_SITE;

/** true on both bride deployments (they also serve the /wedding page) */
export const isBrideSite = variant === "bride" || variant === "bride-reception";

// VITE_SITE=bride-reception: the whole site is the reception-only version, shown at the home page ("/").
const brideReceptionHome: SiteContent = { ...brideReception, path: "" };

export const site: SiteContent = variant === "bride-reception" ? brideReceptionHome : variant === "bride" ? bride : groom;
