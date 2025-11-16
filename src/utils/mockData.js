/**
 * Mock data for testing
 */

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-234-567-8900',
    role: 'Developer',
    team: 'Engineering',
    status: 'Active',
    joinDate: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-234-567-8901',
    role: 'Designer',
    team: 'Design',
    status: 'Active',
    joinDate: '2024-02-20',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1-234-567-8902',
    role: 'Product Manager',
    team: 'Product',
    status: 'Inactive',
    joinDate: '2024-03-10',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Implement user authentication',
    description: 'Add login and signup functionality',
    assignedTo: 1,
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-12-31',
    createdAt: '2024-11-01'
  },
  {
    id: 2,
    title: 'Design landing page',
    description: 'Create mockups for the landing page',
    assignedTo: 2,
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2024-11-30',
    createdAt: '2024-10-15'
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all API endpoints',
    assignedTo: 3,
    status: 'Not Started',
    priority: 'Low',
    dueDate: '2025-01-15',
    createdAt: '2024-11-10'
  }
];

export const mockProjects = [
  {
    id: 1,
    name: 'Startup Dashboard',
    description: 'Internal dashboard for managing team and tasks',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 100000,
    spent: 45000,
    teamMembers: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Mobile App',
    description: 'iOS and Android mobile application',
    status: 'Planning',
    startDate: '2024-06-01',
    endDate: '2025-03-31',
    budget: 250000,
    spent: 0,
    teamMembers: [1, 2]
  }
];

export const mockMetrics = {
  totalUsers: 156,
  activeUsers: 142,
  totalTasks: 89,
  completedTasks: 67,
  totalProjects: 12,
  activeProjects: 8,
  totalRevenue: 450000,
  monthlyRevenue: 45000
};

export const mockChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 35000, 42000, 38000, 45000, 48000],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

export const mockLoginCredentials = {
  valid: {
    email: 'admin@startup.com',
    password: 'Admin123!'
  },
  invalid: {
    email: 'wrong@startup.com',
    password: 'wrongpassword'
  }
};

export const mockFormData = {
  user: {
    name: 'Test User',
    email: 'test.user@example.com',
    phone: '+1-555-123-4567',
    role: 'Developer',
    team: 'Engineering'
  },
  task: {
    title: 'Test Task',
    description: 'This is a test task',
    assignedTo: 1,
    priority: 'High',
    dueDate: '2024-12-31'
  },
  project: {
    name: 'Test Project',
    description: 'This is a test project',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 100000
  }
};

export const mockApiResponses = {
  success: {
    status: 200,
    message: 'Operation successful',
    data: {}
  },
  error: {
    status: 500,
    message: 'Internal server error',
    error: 'Something went wrong'
  },
  unauthorized: {
    status: 401,
    message: 'Unauthorized',
    error: 'Invalid credentials'
  },
  notFound: {
    status: 404,
    message: 'Not found',
    error: 'Resource not found'
  },
  validationError: {
    status: 422,
    message: 'Validation error',
    errors: {
      email: 'Invalid email format',
      phone: 'Invalid phone number'
    }
  }
};

export const mockNotifications = [
  {
    id: 1,
    type: 'success',
    message: 'Task completed successfully',
    timestamp: new Date('2024-11-16T10:00:00')
  },
  {
    id: 2,
    type: 'warning',
    message: 'Task deadline approaching',
    timestamp: new Date('2024-11-16T09:00:00')
  },
  {
    id: 3,
    type: 'error',
    message: 'Failed to save changes',
    timestamp: new Date('2024-11-16T08:00:00')
  }
];
