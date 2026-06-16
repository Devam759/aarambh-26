export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_CATEGORIES = [
  { id: 'all', name: 'All Questions', emoji: '', color: 'hover:bg-brand-orange hover:text-brand-ink hover:border-brand-orange' },
  { id: 'orientation', name: 'Orientation Week', emoji: '', color: 'hover:bg-brand-blue hover:text-brand-cloud hover:border-brand-blue' },
  { id: 'campus', name: 'Campus Life & Facilities', emoji: '', color: 'hover:bg-brand-orange hover:text-brand-ink hover:border-brand-orange' },
  { id: 'registration', name: 'Fees & Registration', emoji: '', color: 'hover:bg-brand-blue hover:text-brand-cloud hover:border-brand-blue' },
  { id: 'rules', name: 'Rules & Discipline', emoji: '', color: 'hover:bg-brand-ink hover:text-brand-cloud hover:border-brand-ink' }
];

export const FAQS_DATA: FAQItem[] = [
  // Orientation Week
  {
    category: 'orientation',
    question: "What happens during Aarambh 2026 Orientation Week?",
    answer: "Aarambh 2026 is designed to help new students transition smoothly into university life through orientation sessions, campus tours, faculty interactions, workshops, and engaging student activities."
  },
  {
    category: 'orientation',
    question: "Is attendance mandatory for all orientation activities?",
    answer: "Attendance is not mandatory, but it is highly recommended. All newly admitted students are encouraged to attend the orientation sessions as they contain important academic and administrative information."
  },
  {
    category: 'orientation',
    question: "Can parents attend the inauguration ceremony?",
    answer: "Yes. Parents are welcome to attend the inauguration ceremony; however, they are not permitted to stay for the entire orientation program."
  },
  {
    category: 'orientation',
    question: "Are parents allowed to stay with their children during the orientation?",
    answer: "Unfortunately, no. Parents are not allowed to stay with their children throughout the orientation program."
  },
  {
    category: 'orientation',
    question: "Can parents be provided accommodation during the program?",
    answer: "In exceptional cases, accommodation may be provided for one day only. Extended stay arrangements are not available."
  },
  {
    category: 'orientation',
    question: "Are parents allowed to meet their children during the orientation?",
    answer: "Once students enter the campus and the orientation program begins, no incoming or outgoing movement is permitted. Therefore, parents will not be able to meet their children during the program."
  },
  {
    category: 'orientation',
    question: "What if I have to leave the orientation in between?",
    answer: "Students who need to leave the orientation program before its completion must inform their Cohort Leader or the Student Affairs team and obtain the necessary approval and guidance."
  },
  {
    category: 'orientation',
    question: "What should I carry on the first day of Aarambh?",
    answer: "Students are advised to carry a valid photo ID, essential documents, a notebook, a water bottle, and any personal necessities. Additional guidance will be provided by the Cohort Leaders."
  },
  {
    category: 'orientation',
    question: "Is there any dress code during Aarambh?",
    answer: "There is no specific dress code unless communicated for a particular event."
  },
  {
    category: 'orientation',
    question: "How will I know the schedule and venue for each orientation activity?",
    answer: "The complete schedule and venue details will be shared through official university communication channels before and during Aarambh."
  },
  {
    category: 'orientation',
    question: "Will I get a chance to meet faculty members and seniors during Aarambh?",
    answer: "Yes. Aarambh includes interactive sessions that allow students to connect with faculty members, mentors, and senior students."
  },
  {
    category: 'orientation',
    question: "What should I do if I arrive late or miss an orientation session?",
    answer: "Students should inform their Cohort Leader or the Student Affairs team and collect any missed information from the designated support desk."
  },

  // Campus Life & Facilities
  {
    category: 'campus',
    question: "What facilities are available on campus for students?",
    answer: "The campus offers academic facilities, libraries, hostels, dining areas, sports facilities, medical support, recreational spaces, and student activity zones."
  },
  {
    category: 'campus',
    question: "What should I do in case of a medical emergency on campus?",
    answer: "Students can contact the campus Medical Center, their hostel warden, or the university emergency helpline for immediate assistance."
  },
  {
    category: 'campus',
    question: "What are the hostel timings for new students during Aarambh?",
    answer: "Hostel timings for new students will be shared at a stage communicated during the orientation week."
  },
  {
    category: 'rules',
    question: "What items are prohibited inside hostel rooms?",
    answer: "Heavy electrical appliances such as room heaters, electric cooktops, personal refrigerators, air coolers, and electric irons are not permitted inside hostel rooms."
  },
  {
    category: 'campus',
    question: "Is Wi-Fi available in hostels and across the campus?",
    answer: "Yes. High-speed Wi-Fi connectivity is available across academic areas and hostel facilities."
  },
  {
    category: 'campus',
    question: "How do the laundry facilities work?",
    answer: "Laundry facilities are available behind Boys’ Hostel I and II. There are no additional charges for using these facilities, as the cost is included in the hostel fee."
  },
  {
    category: 'campus',
    question: "What kind of food is served in the mess?",
    answer: "The dining facilities offer a variety of nutritious vegetarian and non-vegetarian meal options throughout the week."
  },
  {
    category: 'campus',
    question: "Are vegetarian and non-vegetarian meals served separately?",
    answer: "Yes. Separate serving sections are maintained for vegetarian and non-vegetarian meals."
  },
  {
    category: 'campus',
    question: "Can students order food from outside the campus or hostel?",
    answer: "Students may order food from outside, subject to hostel and campus regulations."
  },
  {
    category: 'campus',
    question: "How do meal plans work, and what happens if I miss a meal?",
    answer: "Cafeterias and vending machines are available at appropriate locations across the campus for students’ convenience."
  },
  {
    category: 'campus',
    question: "How can I join clubs, societies, and sports teams?",
    answer: "Students can explore and register for various clubs and societies during the Club Carnival and other student engagement events."
  },
  {
    category: 'campus',
    question: "Who should I contact if I need help or feel lost during my first few days on campus?",
    answer: "Orientation volunteers, hostel wardens, faculty mentors, and the Student Affairs team are available to assist students throughout Aarambh."
  },

  {
    category: 'registration',
    question: "Is there an entry fee for the orientation?",
    answer: "The program is free for registered students; a nominal registration fee of 2500 RS is charged to cover comfortable hostel accommodation, all meals, and the special Aarambh welcome kit."
  },
  {
    category: 'registration',
    question: "What does the registration fee include?",
    answer: "It covers non‑AC shared hostel rooms for the entire duration, all meals (breakfast, lunch, snacks, dinner), an Aarambh kit containing merchandise (official T-shirt, customized ID cards, bag, etc.), and complete access to all workshops, expert sessions, and cultural nights."
  }
];
