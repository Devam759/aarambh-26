export interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
  batches: number[];
  speaker?: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  theme?: string;
  events: ScheduleItem[];
}

export const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 'Day 01',
    date: 'July 14',
    theme: 'Open Skies Day',
    events: [
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      { time: '9:30 AM - 10:45 AM', title: 'Registrations', location: 'Main Gate', batches: [1, 2, 3, 4] },
      { time: '11:10 AM - 12:30 PM', title: 'Inaugural Ceremony', location: 'New Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '12:30 PM - 1:00 PM', title: 'Aarambh Schedule | Rules & Regulations', speaker: 'Mr. Deepak Sogani', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '1:00 PM - 2:30 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },
      { time: '2:30 PM - 5:30 PM', title: 'Ice Breaking Session by Manish Freeman & Team', location: 'Tech Block', batches: [1, 2, 3, 4] },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Kingdom Game Night by Manish Freeman & Team', location: 'Tech Block', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'Fun Event With Manish Freeman & Team', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 02',
    date: 'July 15',
    theme: 'Bollywood Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities & Yoga', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      { time: '9:30 AM - 1:00 PM', title: 'Youth UnConferencing by Manish Freeman and Team', location: 'Tech Block', batches: [1, 2, 3, 4] },
      { time: '1:00 PM - 2:30 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },
      { time: '2:30 PM - 5:30 PM', title: 'The League Room: Peer Connect', location: '4 Venues', speaker: 'Team Aarambh', batches: [1, 2, 3, 4] },
      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Dumb Show', location: '4 Venues', speaker: 'Team Aarambh', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'DJ Vibe Check', location: 'Tech Lawn', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 03',
    date: 'July 16',
    theme: 'Canvas Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities & Yoga', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      
      { time: '9:30 AM - 1:00 PM', title: 'Session on POSH and digital well being', speaker: 'Mrs. Anjali Suneja', location: 'IM Amphi', batches: [1] },
      { time: '9:30 AM - 1:00 PM', title: 'Craft appreciation and art workshop', speaker: 'Mr. Amitanshu Shrivastava', location: 'Tech Block Rooms', batches: [2] },
      { time: '9:30 AM - 1:00 PM', title: 'Pottery & Clay Art Workshop', speaker: 'Mr. Kunal Agarwal', location: 'Tech Block Rooms', batches: [3] },
      { time: '9:30 AM - 12:00 PM', title: 'Goal Setting Workshop', speaker: 'CCCT', location: 'IET Amphi', batches: [4] },
      { time: '12:00 PM - 1:00 PM', title: 'Art of Living', location: 'IET Amphi', batches: [4] },
      
      { time: '1:00 PM - 2:00 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },

      { time: '2:00 PM - 5:30 PM', title: 'Craft appreciation and art workshop', speaker: 'Mr. Amitanshu Shrivastava', location: 'Tech Block Rooms', batches: [1] },
      { time: '2:00 PM - 3:00 PM', title: 'Art of Living', location: 'IM Amphi', batches: [2] },
      { time: '3:00 PM - 5:30 PM', title: 'Goal Setting Workshop', speaker: 'CCCT', location: 'IET Amphi', batches: [2] },
      { time: '2:00 PM - 5:30 PM', title: 'Session on POSH and digital well being', speaker: 'Mrs. Anjali Suneja', location: 'IM Amphi', batches: [3] },
      { time: '2:00 PM - 5:30 PM', title: 'Pottery & Clay Art Workshop', speaker: 'Mr. Kunal Agarwal', location: 'Tech Block Rooms', batches: [4] },

      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Brush & Bond', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'Express Yourself: Creative Expression Hour', location: 'Tech Lawn', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 04',
    date: 'July 17',
    theme: 'Anime & Toons Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities & Yoga', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      
      { time: '9:30 AM - 1:00 PM', title: 'Pottery & Clay Art Workshop', speaker: 'Mr. Kunal Agarwal', location: 'Tech Block Rooms', batches: [1] },
      { time: '9:30 AM - 1:00 PM', title: 'Session on POSH and digital well being', speaker: 'Mrs. Anjali Suneja', location: 'IM Amphi', batches: [2] },
      { time: '9:30 AM - 12:00 PM', title: 'Goal Setting Workshop', speaker: 'CCCT', location: 'IET Amphi', batches: [3] },
      { time: '12:00 PM - 1:00 PM', title: 'Art of Living', location: 'IET Amphi', batches: [3] },
      { time: '9:30 AM - 1:00 PM', title: 'Craft appreciation and art workshop', speaker: 'Mr. Amitanshu Shrivastava', location: 'Tech Block Rooms', batches: [4] },
      
      { time: '1:00 PM - 2:00 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },

      { time: '2:00 PM - 3:00 PM', title: 'Art of Living', location: 'IM Amphi', batches: [1] },
      { time: '3:00 PM - 5:30 PM', title: 'Goal Setting Workshop', speaker: 'CCCT', location: 'IET Amphi', batches: [1] },
      { time: '2:00 PM - 5:30 PM', title: 'Pottery & Clay Art Workshop', speaker: 'Mr. Kunal Agarwal', location: 'Tech Block Rooms', batches: [2] },
      { time: '2:00 PM - 5:30 PM', title: 'Craft appreciation and art workshop', speaker: 'Mr. Amitanshu Shrivastava', location: 'Tech Block Rooms', batches: [3] },
      { time: '2:00 PM - 5:30 PM', title: 'Session on POSH and digital well being', speaker: 'Mrs. Anjali Suneja', location: 'IM Amphi', batches: [4] },

      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'DanceVerse: Dance & Movement Night', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'Movie Night', location: 'Batch Wise', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 05',
    date: 'July 18',
    theme: 'Ethnic Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities & Yoga', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      
      { time: '9:30 AM - 11:00 AM', title: 'Workshop on Cyber Security', speaker: 'Mr. Mukesh Choudhary', location: 'IM Amphi', batches: [1] },
      { time: '11:00 AM - 1:00 PM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Mr. Manan Pahwa', location: 'IM Amphi', batches: [1] },

      { time: '9:30 AM - 10:30 AM', title: 'Examination (1hr)', location: 'IET Amphi', batches: [2] },
      { time: '10:30 AM - 11:00 AM', title: 'Admin Session(30min)', location: 'IET Amphi', batches: [2] },
      { time: '11:00 AM - 1:00 PM', title: 'Workshop on Cyber Security (*From 11:30am)', speaker: 'Mr. Mukesh Choudhary', location: 'IET Amphi', batches: [2] },

      { time: '9:30 AM - 11:00 AM', title: 'Student Affairs (1.5Hr)', location: '008TB', batches: [3] },
      { time: '11:00 AM - 1:00 PM', title: 'Admin Session(30min) | Hostel(1hr) | Anti-Ragging(30min)', location: '008TB', batches: [3] },

      { time: '9:30 AM - 11:00 AM', title: 'Hostel(1hr) | Anti-Ragging(30min)', location: '006TB & 001TB', batches: [4] },
      { time: '11:00 AM - 12:30 PM', title: 'Alumni JKLU (1.5hr)', location: '009TB', batches: [4] },
      { time: '12:30 PM - 1:00 PM', title: 'Admin Session(30min)', location: '009TB', batches: [4] },

      { time: '1:00 PM - 2:00 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },

      { time: '2:00 PM - 3:00 PM', title: 'Examination (1HR)', location: '008TB', batches: [1] },
      { time: '3:00 PM - 5:30 PM', title: 'Session on Mental Health(1hr) | Student Affairs (1.5Hr)', location: '008TB', batches: [1] },

      { time: '2:00 PM - 3:00 PM', title: 'Creating Your Own Path', speaker: 'Mr. RamG Vallath', location: 'IM Amphi', batches: [2] },
      { time: '3:00 PM - 5:30 PM', title: 'Hostel(1hr) | Anti-Ragging(30min) | Accounts + IT + LRC Session(1hr)', location: '006TB & 001TB', batches: [2] },

      { time: '2:00 PM - 3:00 PM', title: 'Accounts + IT + LRC Session(1hr)', location: '006TB & 001TB', batches: [3] },
      { time: '3:00 PM - 4:00 PM', title: 'Creating Your Own Path', speaker: 'Mr. RamG Vallath', location: 'IET Amphi', batches: [3] },
      { time: '4:00 PM - 5:30 PM', title: 'Workshop on Cyber Security', speaker: 'Mr. Mukesh Choudhary', location: 'IM Amphi', batches: [3] },

      { time: '2:00 PM - 3:30 PM', title: 'Workshop on Cyber Security (till 3:30pm)', speaker: 'Mr. Mukesh Choudhary', location: 'IET Amphi', batches: [4] },
      { time: '3:30 PM - 5:30 PM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Mr. Manan Pahwa (From 3:30pm)', location: 'IM Amphi', batches: [4] },

      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Fashion Show', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'JKLU Got Latent', location: 'Tech Lawn', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 06',
    date: 'July 19',
    theme: 'Black & White 90s Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'Sports Activities & Yoga', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 8:50 AM', title: 'BREAKFAST', batches: [1, 2, 3, 4] },
      
      { time: '9:30 AM - 10:30 AM', title: 'Creating Your Own Path', speaker: 'Mr. RamG Vallath', location: 'IM Amphi', batches: [1] },
      { time: '10:30 AM - 11:00 AM', title: 'Admin Session(30min)', location: '008TB', batches: [1] },
      { time: '11:00 AM - 1:00 PM', title: 'Hostel(1hr) | Anti-Ragging(30min) | Session on International studies (30min)', location: '008TB', batches: [1] },

      { time: '9:30 AM - 11:00 AM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Mr. Manan Pahwa', location: 'IET Amphi', batches: [2] },
      { time: '11:00 AM - 1:00 PM', title: 'Introduction to AIC session(1hr) | Session on Mental Health(1hr)', location: '009TB', batches: [2] },

      { time: '9:30 AM - 10:30 AM', title: 'Session on Mental Health(1hr)', location: '009TB', batches: [3] },
      { time: '10:30 AM - 11:30 AM', title: 'Examination (1hr)(*Till 11:30)', location: '009TB', batches: [3] },
      { time: '11:30 AM - 1:00 PM', title: 'Alumni of JKLU(1.5hr) (*From 11:30)', location: 'IET Amphi', batches: [3] },

      { time: '9:30 AM - 10:30 AM', title: 'Introduction to AIC session(1hr)', location: '008TB', batches: [4] },
      { time: '10:30 AM - 11:30 AM', title: 'Creating Your Own Path (*Till 11:30am)', speaker: 'Mr. RamG Vallath', location: 'IM Amphi', batches: [4] },
      { time: '11:30 AM - 1:00 PM', title: 'Student Affairs (1.5Hr) (*From 11:30)', location: 'IM Amphi', batches: [4] },

      { time: '1:00 PM - 2:00 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },

      { time: '2:00 PM - 3:00 PM', title: 'Accounts + IT + LRC Session(1hr)', location: '006TB & 001TB', batches: [1] },
      { time: '3:00 PM - 5:30 PM', title: 'Introduction to AIC session(1hr) | Alumni of JKLU(1.5hr)', location: '009TB', batches: [1] },

      { time: '2:00 PM - 3:30 PM', title: 'Alumni of JKLU(1.5hr)(*Till 3:30pm)', location: 'IM Amphi', batches: [2] },
      { time: '3:30 PM - 5:30 PM', title: 'Student Affairs (1.5Hr)(*from 3:30pm) | Session on International studies (30min)', location: 'IM Amphi', batches: [2] },

      { time: '2:00 PM - 4:00 PM', title: 'Mind Hacks: The Hidden Psychology Behind Every Decision Mr. Manan Pahwa (till 4pm)', location: 'IET Amphi', batches: [3] },
      { time: '4:00 PM - 5:30 PM', title: 'Session on International studies (30min) (*From 4pm) | Introduction to AIC session(1hr)', location: 'IET Amphi', batches: [3] },

      { time: '2:00 PM - 3:00 PM', title: 'Examination (1HR)', location: '008TB', batches: [4] },
      { time: '3:00 PM - 5:30 PM', title: 'Session on International studies (30min) | Accounts + IT + LRC Session(1hr) | Session on Mental Health(1hr)', location: '008TB', batches: [4] },

      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Bands & Brief about Outing', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: 'Midnight', title: 'Live telecast of FIFA world cup', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 07',
    date: 'July 20',
    theme: 'Fresh and fun Day',
    events: [
      { time: '4:30 AM - 12:30 PM', title: 'OUTING ACTIVITY', batches: [1, 2, 3, 4] },
      
      { time: '1:00 PM - 2:00 PM', title: 'LUNCH', batches: [1, 2, 3, 4] },

      { time: '2:00 PM - 5:30 PM', title: 'The Art of Folding', speaker: 'Design Club & Aarambh Team', location: 'IM Amphi & IET Amphi', batches: [1, 2] },
      { time: '2:00 PM - 5:30 PM', title: 'Canvas Beyond: Art Expression Workshop', speaker: 'Art Club & Aarambh Team', location: '008TB', batches: [3] },
      { time: '2:00 PM - 5:30 PM', title: 'VR Zone (Cohort Wise)', speaker: 'Tech Club & Aarambh Team', location: '006 Tech Block Room', batches: [4] },

      { time: '5:30 PM - 6:30 PM', title: 'SNACKS', batches: [1, 2, 3, 4] },
      { time: '6:30 PM - 9:00 PM', title: 'Stories Framed', location: 'Tech Lawn', batches: [1, 2, 3, 4] },
      { time: '9:00 PM - 10:30 PM', title: 'DINNER', batches: [1, 2, 3, 4] },
      { time: '10:30 PM - 11:30 PM', title: 'Star Gazing & Vibe Check (Start From 8pm* (Cohort Wise))', speaker: 'Astronomy Club & Aarambh Team', location: 'Tech Lawn', batches: [1, 2, 3, 4] }
    ]
  },
  {
    day: 'Day 08',
    date: 'July 21',
    theme: 'Formal Day',
    events: [
      { time: '6:30 AM - 7:30 AM', title: 'REST', batches: [1, 2, 3, 4] },
      { time: '7:30 AM - 9:00 AM', title: 'Breakfast', batches: [1, 2, 3, 4] },
      { time: '9:30 AM - 1:00 PM', title: 'Know Your Institution & Placement Cell Orientation (Institute wise)', batches: [1, 2, 3, 4] },
      { time: '1:00 PM - 2:30 PM', title: 'Lunch', batches: [1, 2, 3, 4] },
      { time: '2:30 PM - 4:00 PM', title: 'Cluster Battle Fun Finale & Valedictory Ceremony', batches: [1, 2, 3, 4] },
      { time: '4:00 PM - 6:30 PM', title: 'Bold & Beyond', batches: [1, 2, 3, 4] },
      { time: '6:30 PM', title: 'Departure of Buses', location: 'JKLU Main Gate', batches: [1, 2, 3, 4] }
    ]
  }
];
