export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES = [
  { id: 'all', name: 'All Questions', emoji: '✨', color: 'bg-brand-pink border-brand-pink hover:shadow-solid-pink' },
  { id: 'orientation', name: 'Orientation Week', emoji: '🎯', color: 'bg-brand-pink border-brand-pink hover:shadow-solid-pink' },
  { id: 'campus', name: 'Campus Life & Facilities', emoji: '🏠', color: 'bg-brand-orange border-brand-orange hover:shadow-solid-orange' },
  { id: 'registration', name: 'Fees & Registration', emoji: '💳', color: 'bg-brand-blue border-brand-blue hover:shadow-solid-blue text-brand-cloud' },
  { id: 'rules', name: 'Rules & Discipline', emoji: '📜', color: 'bg-brand-ink border-brand-ink text-brand-cloud shadow-solid-cloud' }
];

export const FAQS_DATA: FAQItem[] = [
  // Orientation Week
  {
    category: 'orientation',
    question: "What happens during Aarambh 2025 orientation week?",
    answer: "Aarambh is JKLU's annual orientation and induction program that welcomes new students, offers campus tours, interactive workshops, guest talks, sports events, cultural nights, and ice-breaking activities to help students settle into university life."
  },
  {
    category: 'orientation',
    question: "Is attendance mandatory for all orientation activities?",
    answer: "Yes, attendance is mandatory for all sessions. Aarambh is designed to set the foundation for your academic and social journey at JKLU. It is a residential program, and students must stay on campus and participate fully."
  },
  {
    category: 'orientation',
    question: "How long does Aarambh run?",
    answer: "Typically a 3‑day residential event packed with ice-breaking sessions, skill-building workshops, expert talks, and cultural events held in the first week of the academic semester."
  },
  // Campus Life & Facilities
  {
    category: 'campus',
    question: "What facilities are available on campus?",
    answer: "JKLU offers state-of-the-art facilities, including modern classrooms, fully-equipped labs, a rich library resource center, separate hostels for boys and girls, sports grounds (football, basketball, cricket, volleyball), a gym, a cafeteria, and 24/7 medical assistance."
  },
  {
    category: 'campus',
    question: "What if I have special dietary or accessibility needs?",
    answer: "Please contact the Office of Student Affairs in advance. The student dining hall supports varied menus, and the student council/office will coordinate accessibility support and dietary accommodations."
  },
  // Fees & Registration
  {
    category: 'registration',
    question: "Is there an entry fee for the orientation?",
    answer: "The program is free for registered students; a nominal registration fee (≈ ₹2000) may be charged to cover comfortable hostel accommodation, all meals, and the special Aarambh welcome kit."
  },
  {
    category: 'registration',
    question: "What does the registration fee include?",
    answer: "It covers non‑AC shared hostel rooms for the entire duration, all meals (breakfast, lunch, snacks, dinner), an Aarambh kit containing merchandise (official T-shirt, customized ID cards, bag, etc.), and complete access to all workshops, expert sessions, and cultural nights."
  },
  // Rules & Discipline
  {
    category: 'rules',
    question: "Are there any prohibited items in the hostels?",
    answer: "Yes. Smoking, consumption of alcohol or narcotics, and heavy electronic appliances (such as irons, heaters, or hair straighteners) are strictly prohibited. Safe usage of common rooms and compliance with general campus safety guidelines are required."
  },
  {
    category: 'rules',
    question: "How can I get regular updates?",
    answer: "Stay updated by visiting the official website (jklu.edu.in) under the Aarambh/Student Affairs section, following our official Instagram handle, or contacting your designated volunteer cohort leads."
  }
];
