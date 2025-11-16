// Task Data Structure for Startup Dashboard

export const taskData = [
  {
    id: 1,
    title: "Implement User Authentication System",
    description: "Build a complete authentication system with login, signup, and password reset functionality. Include JWT token management and secure session handling.",
    priority: "high",
    status: "in-progress",
    assigneeType: "team", // team or intern
    assigneeId: 1,
    assigneeName: "Sarah Chen",
    assigneeHourlyRate: 85,
    dueDate: "2025-11-25",
    startDate: "2025-11-10",
    estimatedHours: 40,
    actualHours: 28,
    budget: 3400,
    tags: ["backend", "security", "authentication"],
    dependencies: [],
    subtasks: [
      { id: 1, title: "Design database schema", completed: true },
      { id: 2, title: "Implement JWT middleware", completed: true },
      { id: 3, title: "Create login API endpoint", completed: true },
      { id: 4, title: "Create signup API endpoint", completed: false },
      { id: 5, title: "Add password reset functionality", completed: false },
      { id: 6, title: "Write unit tests", completed: false }
    ],
    attachments: [
      { id: 1, name: "auth-design.pdf", size: "2.3 MB" },
      { id: 2, name: "api-spec.json", size: "45 KB" }
    ],
    comments: [
      {
        id: 1,
        author: "Sarah Chen",
        date: "2025-11-12",
        text: "Started working on the JWT implementation. Using bcrypt for password hashing."
      },
      {
        id: 2,
        author: "Mike Johnson",
        date: "2025-11-14",
        text: "Looks good! Make sure to add rate limiting for the login endpoint."
      }
    ],
    activityLog: [
      { date: "2025-11-10", action: "Task created", user: "Mike Johnson" },
      { date: "2025-11-10", action: "Assigned to Sarah Chen", user: "Mike Johnson" },
      { date: "2025-11-12", action: "Status changed to In Progress", user: "Sarah Chen" },
      { date: "2025-11-14", action: "Added 28 hours of work", user: "Sarah Chen" }
    ]
  },
  {
    id: 2,
    title: "Design Landing Page Mockups",
    description: "Create high-fidelity mockups for the landing page including hero section, features, pricing, and footer. Should be mobile-responsive.",
    priority: "high",
    status: "in-review",
    assigneeType: "team",
    assigneeId: 2,
    assigneeName: "Alex Rivera",
    assigneeHourlyRate: 75,
    dueDate: "2025-11-20",
    startDate: "2025-11-05",
    estimatedHours: 30,
    actualHours: 32,
    budget: 2250,
    tags: ["design", "ui/ux", "frontend"],
    dependencies: [],
    subtasks: [
      { id: 1, title: "Research competitor designs", completed: true },
      { id: 2, title: "Create wireframes", completed: true },
      { id: 3, title: "Design hero section", completed: true },
      { id: 4, title: "Design features section", completed: true },
      { id: 5, title: "Design pricing section", completed: true },
      { id: 6, title: "Create mobile versions", completed: true }
    ],
    attachments: [
      { id: 1, name: "landing-page-mockup.fig", size: "15.7 MB" },
      { id: 2, name: "design-system.pdf", size: "3.2 MB" }
    ],
    comments: [
      {
        id: 1,
        author: "Alex Rivera",
        date: "2025-11-18",
        text: "Mockups are complete and ready for review. Used the brand colors and typography."
      }
    ],
    activityLog: [
      { date: "2025-11-05", action: "Task created", user: "Mike Johnson" },
      { date: "2025-11-05", action: "Status changed to In Progress", user: "Alex Rivera" },
      { date: "2025-11-18", action: "Status changed to In Review", user: "Alex Rivera" }
    ]
  },
  {
    id: 3,
    title: "Set Up CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment. Include staging and production environments.",
    priority: "medium",
    status: "todo",
    assigneeType: "team",
    assigneeId: 3,
    assigneeName: "Jordan Lee",
    assigneeHourlyRate: 90,
    dueDate: "2025-12-01",
    startDate: "2025-11-20",
    estimatedHours: 25,
    actualHours: 0,
    budget: 2250,
    tags: ["devops", "infrastructure", "automation"],
    dependencies: [1],
    subtasks: [
      { id: 1, title: "Set up GitHub Actions workflow", completed: false },
      { id: 2, title: "Configure test automation", completed: false },
      { id: 3, title: "Set up staging environment", completed: false },
      { id: 4, title: "Set up production environment", completed: false },
      { id: 5, title: "Configure deployment scripts", completed: false }
    ],
    attachments: [],
    comments: [],
    activityLog: [
      { date: "2025-11-15", action: "Task created", user: "Mike Johnson" }
    ]
  },
  {
    id: 4,
    title: "Create Social Media Graphics",
    description: "Design graphics for social media campaigns including Twitter, LinkedIn, and Instagram posts.",
    priority: "low",
    status: "done",
    assigneeType: "intern",
    assigneeId: 1,
    assigneeName: "Emily Watson",
    assigneeHourlyRate: 25,
    dueDate: "2025-11-15",
    startDate: "2025-11-08",
    estimatedHours: 15,
    actualHours: 14,
    budget: 375,
    tags: ["design", "marketing", "social-media"],
    dependencies: [],
    subtasks: [
      { id: 1, title: "Design Twitter graphics", completed: true },
      { id: 2, title: "Design LinkedIn graphics", completed: true },
      { id: 3, title: "Design Instagram graphics", completed: true },
      { id: 4, title: "Get approval from marketing team", completed: true }
    ],
    attachments: [
      { id: 1, name: "social-media-pack.zip", size: "8.4 MB" }
    ],
    comments: [
      {
        id: 1,
        author: "Emily Watson",
        date: "2025-11-14",
        text: "All graphics are complete and approved!"
      }
    ],
    activityLog: [
      { date: "2025-11-08", action: "Task created", user: "Alex Rivera" },
      { date: "2025-11-08", action: "Assigned to Emily Watson", user: "Alex Rivera" },
      { date: "2025-11-14", action: "Status changed to Done", user: "Emily Watson" }
    ]
  },
  {
    id: 5,
    title: "Database Schema Optimization",
    description: "Analyze and optimize database queries. Add indexes where needed and restructure tables for better performance.",
    priority: "high",
    status: "in-progress",
    assigneeType: "team",
    assigneeId: 1,
    assigneeName: "Sarah Chen",
    assigneeHourlyRate: 85,
    dueDate: "2025-11-28",
    startDate: "2025-11-16",
    estimatedHours: 20,
    actualHours: 8,
    budget: 1700,
    tags: ["backend", "database", "performance"],
    dependencies: [],
    subtasks: [
      { id: 1, title: "Analyze slow queries", completed: true },
      { id: 2, title: "Create index plan", completed: true },
      { id: 3, title: "Implement indexes", completed: false },
      { id: 4, title: "Test performance improvements", completed: false }
    ],
    attachments: [],
    comments: [],
    activityLog: [
      { date: "2025-11-16", action: "Task created", user: "Mike Johnson" },
      { date: "2025-11-16", action: "Status changed to In Progress", user: "Sarah Chen" }
    ]
  },
  {
    id: 6,
    title: "Write API Documentation",
    description: "Document all API endpoints with request/response examples, authentication requirements, and error codes.",
    priority: "medium",
    status: "todo",
    assigneeType: "intern",
    assigneeId: 2,
    assigneeName: "David Park",
    assigneeHourlyRate: 28,
    dueDate: "2025-12-05",
    startDate: "2025-11-22",
    estimatedHours: 25,
    actualHours: 0,
    budget: 700,
    tags: ["documentation", "backend", "api"],
    dependencies: [1],
    subtasks: [
      { id: 1, title: "Document authentication endpoints", completed: false },
      { id: 2, title: "Document user endpoints", completed: false },
      { id: 3, title: "Document task endpoints", completed: false },
      { id: 4, title: "Create example requests", completed: false },
      { id: 5, title: "Review with team", completed: false }
    ],
    attachments: [],
    comments: [],
    activityLog: [
      { date: "2025-11-18", action: "Task created", user: "Sarah Chen" }
    ]
  },
  {
    id: 7,
    title: "Implement Dark Mode",
    description: "Add dark mode toggle and theme switching functionality across the entire application.",
    priority: "low",
    status: "todo",
    assigneeType: "team",
    assigneeId: 2,
    assigneeName: "Alex Rivera",
    assigneeHourlyRate: 75,
    dueDate: "2025-12-10",
    startDate: "2025-11-25",
    estimatedHours: 18,
    actualHours: 0,
    budget: 1350,
    tags: ["frontend", "ui/ux", "accessibility"],
    dependencies: [2],
    subtasks: [
      { id: 1, title: "Create theme context", completed: false },
      { id: 2, title: "Design dark mode color palette", completed: false },
      { id: 3, title: "Update all components", completed: false },
      { id: 4, title: "Add toggle switch", completed: false },
      { id: 5, title: "Test accessibility", completed: false }
    ],
    attachments: [],
    comments: [],
    activityLog: [
      { date: "2025-11-19", action: "Task created", user: "Mike Johnson" }
    ]
  },
  {
    id: 8,
    title: "Bug: Email Notifications Not Sending",
    description: "Users report not receiving email notifications for task assignments. Investigate and fix the email service integration.",
    priority: "high",
    status: "in-progress",
    assigneeType: "team",
    assigneeId: 3,
    assigneeName: "Jordan Lee",
    assigneeHourlyRate: 90,
    dueDate: "2025-11-18",
    startDate: "2025-11-16",
    estimatedHours: 8,
    actualHours: 6,
    budget: 720,
    tags: ["bug", "backend", "email"],
    dependencies: [],
    subtasks: [
      { id: 1, title: "Reproduce the bug", completed: true },
      { id: 2, title: "Check email service logs", completed: true },
      { id: 3, title: "Fix email configuration", completed: false },
      { id: 4, title: "Test with different email providers", completed: false }
    ],
    attachments: [],
    comments: [
      {
        id: 1,
        author: "Jordan Lee",
        date: "2025-11-16",
        text: "Found the issue - SMTP credentials were expired. Updating now."
      }
    ],
    activityLog: [
      { date: "2025-11-16", action: "Task created", user: "Mike Johnson" },
      { date: "2025-11-16", action: "Status changed to In Progress", user: "Jordan Lee" }
    ]
  },
  {
    id: 9,
    title: "Conduct User Testing Sessions",
    description: "Schedule and conduct 10 user testing sessions for the new dashboard interface. Collect feedback and create report.",
    priority: "medium",
    status: "in-review",
    assigneeType: "intern",
    assigneeId: 3,
    assigneeName: "Lisa Martinez",
    assigneeHourlyRate: 22,
    dueDate: "2025-11-22",
    startDate: "2025-11-10",
    estimatedHours: 30,
    actualHours: 28,
    budget: 660,
    tags: ["research", "ux", "testing"],
    dependencies: [2],
    subtasks: [
      { id: 1, title: "Create testing script", completed: true },
      { id: 2, title: "Recruit participants", completed: true },
      { id: 3, title: "Conduct sessions", completed: true },
      { id: 4, title: "Analyze results", completed: true },
      { id: 5, title: "Create report", completed: false }
    ],
    attachments: [
      { id: 1, name: "testing-script.pdf", size: "456 KB" },
      { id: 2, name: "session-recordings.zip", size: "234 MB" }
    ],
    comments: [],
    activityLog: [
      { date: "2025-11-10", action: "Task created", user: "Alex Rivera" },
      { date: "2025-11-20", action: "Status changed to In Review", user: "Lisa Martinez" }
    ]
  },
  {
    id: 10,
    title: "Refactor Payment Processing Module",
    description: "Refactor the payment processing code to improve maintainability and add support for multiple payment gateways.",
    priority: "medium",
    status: "todo",
    assigneeType: "team",
    assigneeId: 1,
    assigneeName: "Sarah Chen",
    assigneeHourlyRate: 85,
    dueDate: "2025-12-08",
    startDate: "2025-11-28",
    estimatedHours: 35,
    actualHours: 0,
    budget: 2975,
    tags: ["backend", "refactoring", "payments"],
    dependencies: [1, 3],
    subtasks: [
      { id: 1, title: "Design new architecture", completed: false },
      { id: 2, title: "Create abstraction layer", completed: false },
      { id: 3, title: "Integrate Stripe", completed: false },
      { id: 4, title: "Integrate PayPal", completed: false },
      { id: 5, title: "Write tests", completed: false },
      { id: 6, title: "Migration plan", completed: false }
    ],
    attachments: [],
    comments: [],
    activityLog: [
      { date: "2025-11-19", action: "Task created", user: "Mike Johnson" }
    ]
  }
];

// Helper function to get tasks by status
export const getTasksByStatus = (status) => {
  return taskData.filter(task => task.status === status);
};

// Helper function to get tasks by assignee
export const getTasksByAssignee = (assigneeId, assigneeType) => {
  return taskData.filter(
    task => task.assigneeId === assigneeId && task.assigneeType === assigneeType
  );
};

// Helper function to calculate total cost
export const calculateTaskCost = (task) => {
  return task.actualHours * task.assigneeHourlyRate;
};

// Helper function to get overdue tasks
export const getOverdueTasks = () => {
  const today = new Date();
  return taskData.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'done';
  });
};

// Helper function to calculate task progress
export const calculateTaskProgress = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) return 0;
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  return Math.round((completedSubtasks / task.subtasks.length) * 100);
};

// Task statistics
export const getTaskStatistics = () => {
  const total = taskData.length;
  const todo = taskData.filter(t => t.status === 'todo').length;
  const inProgress = taskData.filter(t => t.status === 'in-progress').length;
  const inReview = taskData.filter(t => t.status === 'in-review').length;
  const done = taskData.filter(t => t.status === 'done').length;

  const totalBudget = taskData.reduce((sum, task) => sum + task.budget, 0);
  const totalActualCost = taskData.reduce((sum, task) => sum + calculateTaskCost(task), 0);
  const totalEstimatedHours = taskData.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActualHours = taskData.reduce((sum, task) => sum + task.actualHours, 0);

  return {
    total,
    todo,
    inProgress,
    inReview,
    done,
    totalBudget,
    totalActualCost,
    budgetRemaining: totalBudget - totalActualCost,
    totalEstimatedHours,
    totalActualHours,
    overdue: getOverdueTasks().length
  };
};

export default taskData;
