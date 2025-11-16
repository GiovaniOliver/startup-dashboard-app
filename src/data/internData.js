export const internData = [
  {
    id: 1,
    name: "Sarah Johnson",
    university: "Stanford University",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.85,
    skills: ["React", "JavaScript", "Python", "Git"],
    stipend: 2500,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    mentor: "John Smith",
    mentorId: 1,
    status: "Active",
    email: "sarah.johnson@stanford.edu",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
    resumeUrl: "/resumes/sarah-johnson.pdf",
    interviewNotes: "Excellent communication skills. Strong React knowledge. Passionate about frontend development.",

    // Learning goals and progress
    learningGoals: [
      { goal: "Master React Hooks", progress: 85, status: "In Progress" },
      { goal: "Learn Redux State Management", progress: 60, status: "In Progress" },
      { goal: "Complete Team Dashboard Feature", progress: 40, status: "In Progress" },
    ],

    // Assigned tasks
    assignedTasks: [
      { id: 1, title: "Build User Profile Component", status: "Completed", dueDate: "2024-06-15" },
      { id: 2, title: "Implement Dashboard Widgets", status: "In Progress", dueDate: "2024-07-01" },
      { id: 3, title: "Create Data Visualization Charts", status: "Pending", dueDate: "2024-07-15" },
    ],

    // Assigned projects
    assignedProjects: [
      { id: 1, name: "Startup Dashboard", role: "Frontend Developer", contribution: 35 },
    ],

    // Attendance
    attendanceRecord: {
      totalDays: 60,
      present: 57,
      absent: 2,
      late: 1,
      attendanceRate: 95,
    },

    // Evaluations
    evaluations: [
      {
        date: "2024-06-30",
        evaluator: "John Smith",
        technicalSkills: 4.5,
        communication: 4.8,
        teamwork: 4.6,
        initiative: 4.7,
        overallRating: 4.65,
        comments: "Excellent progress. Shows great initiative and quick learning.",
      },
    ],

    // Onboarding checklist
    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    university: "MIT",
    major: "Software Engineering",
    year: "Sophomore",
    gpa: 3.92,
    skills: ["Java", "Python", "Machine Learning", "SQL"],
    stipend: 2800,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    mentor: "Emily Davis",
    mentorId: 2,
    status: "Active",
    email: "michael.chen@mit.edu",
    phone: "+1 (555) 234-5678",
    avatar: "https://i.pravatar.cc/150?img=12",
    resumeUrl: "/resumes/michael-chen.pdf",
    interviewNotes: "Strong analytical skills. Experience with ML projects. Great problem solver.",

    learningGoals: [
      { goal: "Build ML Model for User Analytics", progress: 70, status: "In Progress" },
      { goal: "Learn Cloud Deployment (AWS)", progress: 45, status: "In Progress" },
      { goal: "Database Optimization", progress: 80, status: "In Progress" },
    ],

    assignedTasks: [
      { id: 4, title: "Optimize Database Queries", status: "Completed", dueDate: "2024-06-20" },
      { id: 5, title: "Implement User Analytics", status: "In Progress", dueDate: "2024-07-10" },
      { id: 6, title: "Build Recommendation Engine", status: "Pending", dueDate: "2024-08-01" },
    ],

    assignedProjects: [
      { id: 1, name: "Analytics Platform", role: "Backend Developer", contribution: 40 },
    ],

    attendanceRecord: {
      totalDays: 60,
      present: 60,
      absent: 0,
      late: 0,
      attendanceRate: 100,
    },

    evaluations: [
      {
        date: "2024-06-30",
        evaluator: "Emily Davis",
        technicalSkills: 4.8,
        communication: 4.3,
        teamwork: 4.5,
        initiative: 4.9,
        overallRating: 4.625,
        comments: "Outstanding technical abilities. Exceptional dedication to learning.",
      },
    ],

    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    university: "UC Berkeley",
    major: "Data Science",
    year: "Senior",
    gpa: 3.78,
    skills: ["Python", "R", "Tableau", "Statistics"],
    stipend: 2600,
    startDate: "2024-05-15",
    endDate: "2024-08-15",
    mentor: "David Wilson",
    mentorId: 3,
    status: "Active",
    email: "emma.rodriguez@berkeley.edu",
    phone: "+1 (555) 345-6789",
    avatar: "https://i.pravatar.cc/150?img=5",
    resumeUrl: "/resumes/emma-rodriguez.pdf",
    interviewNotes: "Strong data visualization skills. Previous internship at startup. Great team player.",

    learningGoals: [
      { goal: "Advanced Statistical Analysis", progress: 90, status: "In Progress" },
      { goal: "Real-time Data Processing", progress: 55, status: "In Progress" },
      { goal: "A/B Testing Framework", progress: 75, status: "In Progress" },
    ],

    assignedTasks: [
      { id: 7, title: "Create Sales Dashboard", status: "Completed", dueDate: "2024-06-01" },
      { id: 8, title: "Build Analytics Reports", status: "Completed", dueDate: "2024-06-25" },
      { id: 9, title: "Implement A/B Testing", status: "In Progress", dueDate: "2024-07-20" },
    ],

    assignedProjects: [
      { id: 2, name: "Business Intelligence Platform", role: "Data Analyst", contribution: 50 },
    ],

    attendanceRecord: {
      totalDays: 75,
      present: 72,
      absent: 1,
      late: 2,
      attendanceRate: 96,
    },

    evaluations: [
      {
        date: "2024-06-30",
        evaluator: "David Wilson",
        technicalSkills: 4.6,
        communication: 4.7,
        teamwork: 4.9,
        initiative: 4.5,
        overallRating: 4.675,
        comments: "Exceptional data visualization skills. Very collaborative.",
      },
    ],

    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
  {
    id: 4,
    name: "Alex Thompson",
    university: "Carnegie Mellon",
    major: "Human-Computer Interaction",
    year: "Junior",
    gpa: 3.65,
    skills: ["UI/UX Design", "Figma", "HTML/CSS", "JavaScript"],
    stipend: 2400,
    startDate: "2024-06-15",
    endDate: "2024-09-15",
    mentor: "Sarah Anderson",
    mentorId: 4,
    status: "Active",
    email: "alex.thompson@cmu.edu",
    phone: "+1 (555) 456-7890",
    avatar: "https://i.pravatar.cc/150?img=8",
    resumeUrl: "/resumes/alex-thompson.pdf",
    interviewNotes: "Creative designer with strong technical skills. Portfolio shows excellent work.",

    learningGoals: [
      { goal: "Advanced Prototyping Techniques", progress: 65, status: "In Progress" },
      { goal: "Design System Development", progress: 50, status: "In Progress" },
      { goal: "User Research Methods", progress: 70, status: "In Progress" },
    ],

    assignedTasks: [
      { id: 10, title: "Design Mobile App Mockups", status: "Completed", dueDate: "2024-07-01" },
      { id: 11, title: "Create Design System", status: "In Progress", dueDate: "2024-07-25" },
      { id: 12, title: "Conduct User Testing", status: "Pending", dueDate: "2024-08-10" },
    ],

    assignedProjects: [
      { id: 3, name: "Mobile App Redesign", role: "UI/UX Designer", contribution: 60 },
    ],

    attendanceRecord: {
      totalDays: 45,
      present: 44,
      absent: 1,
      late: 0,
      attendanceRate: 97.8,
    },

    evaluations: [
      {
        date: "2024-07-15",
        evaluator: "Sarah Anderson",
        technicalSkills: 4.3,
        communication: 4.8,
        teamwork: 4.6,
        initiative: 4.4,
        overallRating: 4.525,
        comments: "Excellent design sense. Great at incorporating feedback.",
      },
    ],

    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
  {
    id: 5,
    name: "Priya Patel",
    university: "Georgia Tech",
    major: "Computer Science",
    year: "Sophomore",
    gpa: 3.88,
    skills: ["C++", "JavaScript", "Node.js", "MongoDB"],
    stipend: 2300,
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    mentor: "Robert Lee",
    mentorId: 5,
    status: "Active",
    email: "priya.patel@gatech.edu",
    phone: "+1 (555) 567-8901",
    avatar: "https://i.pravatar.cc/150?img=9",
    resumeUrl: "/resumes/priya-patel.pdf",
    interviewNotes: "Strong problem-solving skills. Experience with full-stack development.",

    learningGoals: [
      { goal: "Master Node.js Backend Development", progress: 40, status: "In Progress" },
      { goal: "Learn Microservices Architecture", progress: 30, status: "In Progress" },
      { goal: "API Design Best Practices", progress: 55, status: "In Progress" },
    ],

    assignedTasks: [
      { id: 13, title: "Build REST API Endpoints", status: "In Progress", dueDate: "2024-07-20" },
      { id: 14, title: "Implement Authentication", status: "Pending", dueDate: "2024-08-05" },
      { id: 15, title: "Database Migration Scripts", status: "Pending", dueDate: "2024-08-20" },
    ],

    assignedProjects: [
      { id: 4, name: "API Platform", role: "Backend Developer", contribution: 25 },
    ],

    attendanceRecord: {
      totalDays: 30,
      present: 30,
      absent: 0,
      late: 0,
      attendanceRate: 100,
    },

    evaluations: [],

    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
  {
    id: 6,
    name: "James Wilson",
    university: "University of Washington",
    major: "Information Systems",
    year: "Senior",
    gpa: 3.71,
    skills: ["Project Management", "SQL", "Business Analysis", "Agile"],
    stipend: 2200,
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    mentor: "Lisa Brown",
    mentorId: 6,
    status: "Completed",
    email: "james.wilson@uw.edu",
    phone: "+1 (555) 678-9012",
    avatar: "https://i.pravatar.cc/150?img=13",
    resumeUrl: "/resumes/james-wilson.pdf",
    interviewNotes: "Strong business acumen. Good technical understanding. Leadership potential.",

    learningGoals: [
      { goal: "Agile Project Management", progress: 100, status: "Completed" },
      { goal: "Stakeholder Management", progress: 100, status: "Completed" },
      { goal: "Product Roadmap Planning", progress: 100, status: "Completed" },
    ],

    assignedTasks: [
      { id: 16, title: "Create Project Timeline", status: "Completed", dueDate: "2024-05-15" },
      { id: 17, title: "Coordinate Sprint Planning", status: "Completed", dueDate: "2024-06-01" },
      { id: 18, title: "Document Product Requirements", status: "Completed", dueDate: "2024-07-15" },
    ],

    assignedProjects: [
      { id: 5, name: "Product Launch Initiative", role: "Project Coordinator", contribution: 70 },
    ],

    attendanceRecord: {
      totalDays: 90,
      present: 88,
      absent: 2,
      late: 0,
      attendanceRate: 97.8,
    },

    evaluations: [
      {
        date: "2024-07-31",
        evaluator: "Lisa Brown",
        technicalSkills: 4.2,
        communication: 4.9,
        teamwork: 4.8,
        initiative: 4.7,
        overallRating: 4.65,
        comments: "Outstanding organizational skills. Excellent communicator and team player.",
      },
    ],

    onboardingChecklist: [
      { item: "Complete HR Paperwork", completed: true },
      { item: "Setup Development Environment", completed: true },
      { item: "Security Training", completed: true },
      { item: "Team Introduction", completed: true },
      { item: "First Project Assignment", completed: true },
    ],
  },
];

export const internStatistics = {
  totalInterns: 6,
  activeInterns: 5,
  completedInterns: 1,
  averageGPA: 3.80,
  totalStipend: 15000,
  universities: ["Stanford University", "MIT", "UC Berkeley", "Carnegie Mellon", "Georgia Tech", "University of Washington"],
};

export default internData;
