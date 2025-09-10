// Mock data for the educational platform

export interface Student {
  id: string;
  name: string;
  age: number;
  studentContact: string;
  alternateContact: string;
  email: string;
  interests: string[];
  marks: number;
  progress: {
    coursesCompleted: number;
    quizScore: number;
    skillsUnlocked: number;
    gamesCompleted: number;
  };
  xp: number;
  level: number;
  badges: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  role: string;
  domain: string;
  location: string;
  type: 'Job' | 'Internship';
  description: string;
  requirements: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  eligibility: string[];
  deadline: string;
  description: string;
  isBookmarked: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  xp: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isUnlocked: boolean;
  thumbnail: string;
}

export interface Game {
  id: string;
  title: string;
  type: 'quiz' | 'memory' | 'puzzle' | 'drag-drop';
  xp: number;
  completed: boolean;
  progress: number;
  description: string;
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: 'tip' | 'exercise' | 'quote' | 'article';
  content: string;
  completed: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
  timeLimit: number;
  attempted: boolean;
  score?: number;
}

// Mock Data
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp',
    logo: '🏢',
    role: 'Software Developer Intern',
    domain: 'Technology',
    location: 'Bangalore',
    type: 'Internship',
    description: 'Join our innovative team to build cutting-edge applications',
    requirements: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: '2',
    name: 'DataSystems',
    logo: '📊',
    role: 'Data Analyst',
    domain: 'Analytics',
    location: 'Mumbai',
    type: 'Job',
    description: 'Analyze data to drive business decisions',
    requirements: ['Python', 'SQL', 'Statistics']
  },
  {
    id: '3',
    name: 'DesignStudio',
    logo: '🎨',
    role: 'UI/UX Designer',
    domain: 'Design',
    location: 'Delhi',
    type: 'Internship',
    description: 'Create beautiful and intuitive user experiences',
    requirements: ['Figma', 'Adobe XD', 'User Research']
  }
];

export const mockScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Merit Excellence Scholarship',
    provider: 'Education Foundation',
    amount: '₹50,000',
    eligibility: ['Above 85% marks', 'STEM fields'],
    deadline: '2024-12-31',
    description: 'Scholarship for outstanding academic performance in STEM',
    isBookmarked: false
  },
  {
    id: '2',
    title: 'Innovation Grant',
    provider: 'Tech Foundation',
    amount: '₹1,00,000',
    eligibility: ['Tech projects', 'Under 25 years'],
    deadline: '2024-11-15',
    description: 'Support for innovative technology projects',
    isBookmarked: true
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    category: 'Web Development',
    progress: 75,
    xp: 150,
    level: 'Beginner',
    isUnlocked: true,
    thumbnail: '⚛️'
  },
  {
    id: '2',
    title: 'Data Structures',
    category: 'Computer Science',
    progress: 40,
    xp: 200,
    level: 'Intermediate',
    isUnlocked: true,
    thumbnail: '🗂️'
  },
  {
    id: '3',
    title: 'Machine Learning',
    category: 'AI/ML',
    progress: 0,
    xp: 300,
    level: 'Advanced',
    isUnlocked: false,
    thumbnail: '🤖'
  }
];

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Code Quiz Challenge',
    type: 'quiz',
    xp: 50,
    completed: true,
    progress: 100,
    description: 'Test your programming knowledge'
  },
  {
    id: '2',
    title: 'Algorithm Memory',
    type: 'memory',
    xp: 75,
    completed: false,
    progress: 60,
    description: 'Match algorithm cards to boost memory'
  },
  {
    id: '3',
    title: 'Logic Puzzle',
    type: 'puzzle',
    xp: 100,
    completed: false,
    progress: 0,
    description: 'Solve complex logical challenges'
  }
];

export const mockMentalHealthResources: MentalHealthResource[] = [
  {
    id: '1',
    title: 'Deep Breathing Exercise',
    type: 'exercise',
    content: 'Take 10 deep breaths, focusing on slow inhalation and exhalation',
    completed: false
  },
  {
    id: '2',
    title: 'Stay Focused',
    type: 'quote',
    content: '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
    completed: false
  },
  {
    id: '3',
    title: 'Manage Study Stress',
    type: 'tip',
    content: 'Break large tasks into smaller, manageable chunks to reduce overwhelm',
    completed: true
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Basic Programming Concepts',
    timeLimit: 300, // 5 minutes
    attempted: false,
    questions: [
      {
        question: 'What is a variable in programming?',
        options: [
          'A container for storing data',
          'A type of function',
          'A programming language',
          'A debugging tool'
        ],
        correct: 0
      },
      {
        question: 'Which of these is a loop in JavaScript?',
        options: ['if statement', 'for loop', 'switch case', 'function'],
        correct: 1
      }
    ]
  }
];

export const interestOptions = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'UI/UX Design', 'Digital Marketing', 'Cybersecurity', 'Game Development',
  'Blockchain', 'Cloud Computing', 'DevOps', 'Business Analytics'
];