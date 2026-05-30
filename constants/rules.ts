export interface RuleItem {
  id: number;
  title: string;
  description: string;
  badge: string;
  color: string;
  textColor: string;
  shadowColor: string;
  tag: string;
}

export const RULES_DATA: RuleItem[] = [
  {
    id: 1,
    title: "Campus Movement Restrictions",
    description: "Exit from campus is strictly prohibited from the day of hostel check-in until the conclusion of AARAMBH-2025. All students must remain inside the secure campus boundaries at all times.",
    badge: "🚫",
    color: "bg-brand-pink",
    textColor: "text-brand-cloud",
    shadowColor: "shadow-solid-pink",
    tag: "CAMPUS LOCKDOWN"
  },
  {
    id: 2,
    title: "Hostel Discipline & Sign-Ins",
    description: "Hostel Discipline: All students must strictly adhere to hostel rules, including scheduled in-time and out-time. Daily attendance must be submitted as per the prescribed protocol without fail.",
    badge: "🏠",
    color: "bg-brand-orange",
    textColor: "text-brand-ink",
    shadowColor: "shadow-solid-orange",
    tag: "HOSTEL CODE"
  },
  {
    id: 3,
    title: "Zero Tolerance Policy (UGC)",
    description: "Zero Tolerance Policy: As per UGC regulations, ragging in any form, including physical, verbal, emotional harassment and/or use of foul language is strictly prohibited. Discrimination based on gender, caste, religion, region, language, or background will not be tolerated. Any violation will invite immediate disciplinary action as per university and statutory norms.",
    badge: "⚖️",
    color: "bg-brand-blue",
    textColor: "text-brand-cloud",
    shadowColor: "shadow-solid-blue",
    tag: "STRICT DISCIPLINE"
  },
  {
    id: 4,
    title: "Mandatory Identification Wear",
    description: "Wearing an official identification card is mandatory for all the students including the volunteers. Make sure your ID card is clearly visible whenever moving within university premises.",
    badge: "🪪",
    color: "bg-white",
    textColor: "text-brand-ink",
    shadowColor: "shadow-solid-ink",
    tag: "MANDATORY ID"
  },
  {
    id: 5,
    title: "Cooperation with Volunteer Teams",
    description: "Cooperation with Volunteers: All students are expected to cooperate fully with the AARAMBH volunteers and adhere to the instructions and guidelines provided by them throughout the program.",
    badge: "🤝",
    color: "bg-brand-pink",
    textColor: "text-brand-cloud",
    shadowColor: "shadow-solid-pink",
    tag: "TEAM EFFORT"
  }
];
