/**
 * ZUGZWANG — CENTRAL CONFIGURATION
 * ---------------------------------------------------------------
 * Everything you are likely to change lives in this one file:
 * brand, coach profile, contact links, awards, coaching content,
 * timezone and call duration. Search for "TODO(owner)" to find
 * every placeholder you still need to fill in.
 */

export type SocialKey = "instagram" | "linkedin" | "chesscom" | "lichess" | "youtube";

export type AwardType =
  | "tournament"
  | "rating"
  | "coaching"
  | "certificate"
  | "other";

export interface Award {
  /** Short title, e.g. "District Under-15 Champion" */
  title: string;
  type: AwardType;
  /** Year or date string, e.g. "2024" */
  year?: string;
  /** Optional detail line */
  description?: string;
  /** Optional verification / proof link (certificate, rating profile …) */
  link?: string;
}

export interface Pathway {
  id: "fundamentals" | "tactics" | "positional" | "analysis";
  title: string;
  description: string;
  topics: string[];
}

const whatsappNumber = "918667219230"; // international format, digits only

export const siteConfig = {
  /* ------------------------------ Brand ------------------------------ */
  brand: {
    name: "ZUGZWANG",
    tagline: "Think deeper. Play smarter. Make your next move count.",
    heroHeadlineAlt: "Every great player started with a move.",
    seoTitle: "Zugzwang | Personal Chess Coaching & Free Introductory Call",
    seoDescription:
      "Discover Zugzwang, an interactive personal chess coaching experience. Try the chessboard, explore learning pathways and book your free introductory chess call.",
    /** Public URL — set NEXT_PUBLIC_SITE_URL in your environment for production. */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },

  /* ------------------------------ Coach ------------------------------ */
  coach: {
    // TODO(owner): replace with your real name.
    name: "Your Name",
    role: "Personal Chess Coach",
    location: "India",
    // TODO(owner): put a photo at /public/coach.jpg then set the path below.
    // While null, an elegant placeholder is shown.
    profileImage: null as string | null,
    profileImageAlt: "Portrait of the Zugzwang chess coach",
    // TODO(owner): write your own introduction. Keep it truthful — no titles/ratings unless verified.
    intro:
      "This is where your story goes. Tell visitors who you are, how you came to love chess and what it feels like to learn with you.",
    philosophy:
      "Chess is a conversation between two minds. The goal is not to memorise moves but to understand ideas, so every decision on the board feels earned.",
    teachingApproach: [
      "Start where you are: no jargon, no pressure.",
      "Learn from your own games and mistakes.",
      "Build habits and thinking routines you can use in every game.",
    ],
  },

  /* ------------------------------ Contact ---------------------------- */
  contact: {
    whatsappNumber,
    whatsappDisplay: "+91 8667219230",
    whatsappBase: `https://wa.me/${whatsappNumber}`,
    defaultMessage:
      "Hi! I just visited Zugzwang and tried the interactive chessboard. I'd love to know more about your coaching sessions and book a free introductory call.",
  },

  /* ------------------------------ Booking ---------------------------- */
  booking: {
    // TODO(owner): replace YOUR_CAL_USERNAME with your Cal.com username.
    calUrl: "https://cal.com/YOUR_CAL_USERNAME/free-chess-call",
    /** Informational: set the real duration on the Cal.com event type itself. */
    callDurationMinutes: 15,
  },

  /* ------------------------------ Support ---------------------------- */
  buyMeACoffeeUrl: "https://buymeacoffee.com/YOUR_HANDLE", // TODO(owner)

  /* ------------------------------ Social ----------------------------- */
  // TODO(owner): replace each URL with your real profile. Entries still
  // containing "YOUR_" are hidden from the footer/About section automatically.
  social: {
    instagram: "https://instagram.com/YOUR_HANDLE",
    linkedin: "https://linkedin.com/in/YOUR_HANDLE",
    chesscom: "https://www.chess.com/member/YOUR_HANDLE",
    lichess: "https://lichess.org/@/YOUR_HANDLE",
    youtube: "https://youtube.com/@YOUR_HANDLE",
  } satisfies Record<SocialKey, string>,

  /* ------------------------------ Time ------------------------------- */
  time: {
    timezone: "Asia/Kolkata",
    label: "INDIA STANDARD TIME",
    offsetLabel: "IST · UTC +05:30",
    /**
     * Approximate coach location. When set, real sunrise/sunset is calculated
     * with SunCalc. While null, a 06:00–18:00 day/night convention is used.
     * TODO(owner): e.g. { latitude: 13.0827, longitude: 80.2707 }
     */
    coordinates: null as { latitude: number; longitude: number } | null,
    fallbackSunrise: 6,
    fallbackSunset: 18,
  },

  /* ------------------------------ Awards ----------------------------- */
  // Add ONLY verified achievements. Leave empty to show the minimal intro.
  // Example:
  // { title: "Club Championship — Runner-up", type: "tournament", year: "2024" }
  awards: [] as Award[],

  /* ------------------------------ Coaching --------------------------- */
  pathways: [
    {
      id: "fundamentals",
      title: "Chess Fundamentals",
      description:
        "Build a rock-solid base: how every piece moves and works together, and how to start a game with confidence.",
      topics: ["Understanding the pieces", "Board control", "Opening principles", "Basic checkmates"],
    },
    {
      id: "tactics",
      title: "Tactical Thinking",
      description:
        "Sharpen your eye for combinations and learn to calculate clearly, so you spot opportunities before your opponent does.",
      topics: ["Forks", "Pins", "Skewers", "Discovered attacks", "Calculation"],
    },
    {
      id: "positional",
      title: "Positional Understanding",
      description:
        "Learn to read a quiet position, find the right plan and play moves that quietly win games.",
      topics: ["Pawn structures", "Piece activity", "Weak squares", "Long-term planning"],
    },
    {
      id: "analysis",
      title: "Game Analysis",
      description:
        "Turn your own games into your best textbook. Find the turning points and build better decision-making.",
      topics: [
        "Reviewing personal games",
        "Understanding mistakes",
        "Finding improvements",
        "Developing better decision-making",
      ],
    },
  ] satisfies Pathway[],

  /* ------------------------------ Navigation ------------------------- */
  nav: [
    { id: "home", label: "Home", href: "#home" },
    { id: "awards", label: "Awards", href: "#awards" },
    { id: "about", label: "About Me", href: "#about" },
    { id: "india-time", label: "India Time", href: "#india-time" },
    { id: "feedback", label: "Feedback", href: "#feedback" },
  ],
} as const;

/* ------------------------------ Helpers ------------------------------ */

export function whatsappLink(message: string = siteConfig.contact.defaultMessage): string {
  return `${siteConfig.contact.whatsappBase}?text=${encodeURIComponent(message)}`;
}

/** Social links that have been filled in with real values. */
export function activeSocialLinks(): { key: SocialKey; url: string }[] {
  return (Object.entries(siteConfig.social) as [SocialKey, string][])
    .filter(([, url]) => !url.includes("YOUR_"))
    .map(([key, url]) => ({ key, url }));
}

export const socialLabels: Record<SocialKey, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  chesscom: "Chess.com",
  lichess: "Lichess",
  youtube: "YouTube",
};

export function isBookingConfigured(): boolean {
  return !siteConfig.booking.calUrl.includes("YOUR_CAL_USERNAME");
}
