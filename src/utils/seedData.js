/**
 * Seed data for populating the application with demo data
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate sample teams data
 * @returns {Array} - Array of team objects
 */
export const generateTeamsData = () => {
  return [
    {
      id: uuidv4(),
      name: 'Engineering',
      description: 'Software development and technical infrastructure',
      color: '#3b82f6',
      lead: 'Sarah Johnson',
      memberCount: 8,
      budget: 150000,
      createdAt: new Date('2025-01-15').toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Product',
      description: 'Product management and strategy',
      color: '#8b5cf6',
      lead: 'Michael Chen',
      memberCount: 5,
      budget: 75000,
      createdAt: new Date('2025-01-20').toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Design',
      description: 'UX/UI design and brand development',
      color: '#ec4899',
      lead: 'Emma Wilson',
      memberCount: 4,
      budget: 60000,
      createdAt: new Date('2025-02-01').toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Marketing',
      description: 'Marketing and growth strategies',
      color: '#f59e0b',
      lead: 'David Martinez',
      memberCount: 6,
      budget: 100000,
      createdAt: new Date('2025-02-10').toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Sales',
      description: 'Customer acquisition and revenue generation',
      color: '#10b981',
      lead: 'Lisa Anderson',
      memberCount: 7,
      budget: 120000,
      createdAt: new Date('2025-02-15').toISOString(),
    },
  ];
};

/**
 * Generate sample interns data
 * @param {Array} teams - Teams array to assign interns to
 * @returns {Array} - Array of intern objects
 */
export const generateInternsData = (teams) => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Drew', 'Skyler', 'Dakota', 'Peyton', 'Blake', 'Sage'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas'];
  const universities = ['MIT', 'Stanford', 'UC Berkeley', 'Carnegie Mellon', 'Harvard', 'Yale', 'Princeton', 'Columbia', 'Cornell', 'Northwestern'];
  const skills = [
    ['React', 'Node.js', 'JavaScript', 'TypeScript'],
    ['Python', 'Django', 'PostgreSQL', 'AWS'],
    ['Figma', 'Adobe XD', 'Sketch', 'Illustration'],
    ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    ['Sales', 'CRM', 'Communication', 'Negotiation'],
    ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    ['UI/UX', 'Prototyping', 'User Research', 'Wireframing'],
  ];

  const interns = [];
  const internCount = 15;

  for (let i = 0; i < internCount; i++) {
    const team = teams[i % teams.length];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    interns.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@intern.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      teamId: team.id,
      teamName: team.name,
      position: `${team.name} Intern`,
      university: universities[Math.floor(Math.random() * universities.length)],
      graduationYear: 2025 + Math.floor(Math.random() * 2),
      skills: skills[i % skills.length],
      startDate: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
      hourlyRate: 20 + Math.floor(Math.random() * 15),
      hoursWorked: Math.floor(Math.random() * 200) + 50,
      status: ['active', 'active', 'active', 'on-leave'][Math.floor(Math.random() * 4)],
      performance: ['excellent', 'good', 'satisfactory'][Math.floor(Math.random() * 3)],
      avatar: `https://i.pravatar.cc/150?u=${uuidv4()}`,
      createdAt: new Date(2025, 0, 1 + i).toISOString(),
    });
  }

  return interns;
};

/**
 * Generate sample tasks data
 * @param {Array} teams - Teams array to assign tasks to
 * @param {Array} interns - Interns array to assign tasks to
 * @returns {Array} - Array of task objects
 */
export const generateTasksData = (teams, interns) => {
  const taskTemplates = [
    { title: 'Implement user authentication', priority: 'high', estimatedHours: 16 },
    { title: 'Design landing page mockup', priority: 'medium', estimatedHours: 8 },
    { title: 'Write API documentation', priority: 'low', estimatedHours: 12 },
    { title: 'Set up CI/CD pipeline', priority: 'high', estimatedHours: 20 },
    { title: 'Create email templates', priority: 'medium', estimatedHours: 6 },
    { title: 'Optimize database queries', priority: 'high', estimatedHours: 14 },
    { title: 'Conduct user research interviews', priority: 'medium', estimatedHours: 10 },
    { title: 'Build analytics dashboard', priority: 'high', estimatedHours: 24 },
    { title: 'Update brand guidelines', priority: 'low', estimatedHours: 8 },
    { title: 'Refactor legacy code', priority: 'medium', estimatedHours: 18 },
    { title: 'Create social media content', priority: 'low', estimatedHours: 5 },
    { title: 'Implement payment integration', priority: 'high', estimatedHours: 22 },
    { title: 'Design mobile app screens', priority: 'medium', estimatedHours: 16 },
    { title: 'Write unit tests', priority: 'high', estimatedHours: 12 },
    { title: 'Customer feedback analysis', priority: 'medium', estimatedHours: 8 },
    { title: 'Prepare investor pitch deck', priority: 'high', estimatedHours: 15 },
    { title: 'Optimize website performance', priority: 'medium', estimatedHours: 10 },
    { title: 'Create onboarding tutorial', priority: 'low', estimatedHours: 7 },
    { title: 'Set up monitoring and alerts', priority: 'high', estimatedHours: 11 },
    { title: 'Design email campaign', priority: 'medium', estimatedHours: 6 },
  ];

  const statuses = ['pending', 'in-progress', 'completed', 'blocked'];
  const tasks = [];

  taskTemplates.forEach((template, index) => {
    const team = teams[index % teams.length];
    const teamInterns = interns.filter(intern => intern.teamId === team.id);
    const assignedIntern = teamInterns.length > 0 ? teamInterns[Math.floor(Math.random() * teamInterns.length)] : null;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const progress = status === 'completed' ? 100 : status === 'in-progress' ? Math.floor(Math.random() * 80) + 10 : 0;

    tasks.push({
      id: uuidv4(),
      title: template.title,
      description: `Complete ${template.title.toLowerCase()} for ${team.name} team`,
      teamId: team.id,
      teamName: team.name,
      assignedTo: assignedIntern ? assignedIntern.id : null,
      assignedToName: assignedIntern ? `${assignedIntern.firstName} ${assignedIntern.lastName}` : 'Unassigned',
      priority: template.priority,
      status: status,
      progress: progress,
      estimatedHours: template.estimatedHours,
      actualHours: status === 'completed' ? template.estimatedHours + Math.floor(Math.random() * 5) - 2 : Math.floor(Math.random() * template.estimatedHours),
      dueDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      createdAt: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['development', 'design', 'research', 'documentation'][Math.floor(Math.random() * 4)],
    });
  });

  return tasks;
};

/**
 * Generate sample finances data
 * @param {Array} teams - Teams array to link finances to
 * @param {Array} interns - Interns array to link finances to
 * @returns {Array} - Array of finance objects
 */
export const generateFinancesData = (teams, interns) => {
  const finances = [];
  const categories = ['salary', 'equipment', 'software', 'training', 'travel', 'office-supplies', 'other'];
  const descriptions = {
    salary: 'Intern salary payment',
    equipment: 'Equipment purchase',
    software: 'Software license',
    training: 'Training and development',
    travel: 'Business travel expenses',
    'office-supplies': 'Office supplies',
    other: 'Miscellaneous expense',
  };

  // Generate intern salary payments
  interns.forEach(intern => {
    const months = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < months; i++) {
      finances.push({
        id: uuidv4(),
        type: 'expense',
        category: 'salary',
        amount: intern.hourlyRate * 40 * 4, // Monthly salary
        description: `${intern.firstName} ${intern.lastName} - Monthly salary`,
        teamId: intern.teamId,
        internId: intern.id,
        date: new Date(2025, i + 1, Math.floor(Math.random() * 28) + 1).toISOString(),
        status: 'completed',
        paymentMethod: 'bank-transfer',
        createdAt: new Date(2025, i + 1, Math.floor(Math.random() * 28) + 1).toISOString(),
      });
    }
  });

  // Generate other expenses
  teams.forEach(team => {
    const expenseCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < expenseCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      finances.push({
        id: uuidv4(),
        type: 'expense',
        category: category,
        amount: Math.floor(Math.random() * 5000) + 500,
        description: `${team.name} - ${descriptions[category]}`,
        teamId: team.id,
        internId: null,
        date: new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1).toISOString(),
        status: ['completed', 'pending', 'approved'][Math.floor(Math.random() * 3)],
        paymentMethod: ['bank-transfer', 'credit-card', 'paypal'][Math.floor(Math.random() * 3)],
        createdAt: new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1).toISOString(),
      });
    }
  });

  // Generate some revenue entries
  const revenueCount = 5;
  for (let i = 0; i < revenueCount; i++) {
    finances.push({
      id: uuidv4(),
      type: 'revenue',
      category: 'client-payment',
      amount: Math.floor(Math.random() * 50000) + 10000,
      description: `Client payment - Project ${i + 1}`,
      teamId: teams[Math.floor(Math.random() * teams.length)].id,
      internId: null,
      date: new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: 'completed',
      paymentMethod: 'bank-transfer',
      createdAt: new Date(2025, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1).toISOString(),
    });
  }

  return finances;
};

/**
 * Generate complete demo dataset
 * @returns {Object} - Complete dataset with all data types
 */
export const generateDemoData = () => {
  const teams = generateTeamsData();
  const interns = generateInternsData(teams);
  const tasks = generateTasksData(teams, interns);
  const finances = generateFinancesData(teams, interns);

  return {
    teams,
    interns,
    tasks,
    finances,
  };
};

/**
 * Get empty dataset
 * @returns {Object} - Empty dataset structure
 */
export const getEmptyData = () => {
  return {
    teams: [],
    interns: [],
    tasks: [],
    finances: [],
  };
};

export default {
  generateTeamsData,
  generateInternsData,
  generateTasksData,
  generateFinancesData,
  generateDemoData,
  getEmptyData,
};
