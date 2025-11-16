/**
 * Data Manager - CRUD operations, validation, and transformations
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phone && phoneRegex.test(phone);
};

/**
 * Validate team data
 */
export const validateTeam = (team) => {
  const errors = {};

  if (!team.name || team.name.trim() === '') {
    errors.name = 'Team name is required';
  }

  if (team.budget !== undefined && (isNaN(team.budget) || team.budget < 0)) {
    errors.budget = 'Budget must be a positive number';
  }

  if (team.memberCount !== undefined && (isNaN(team.memberCount) || team.memberCount < 0)) {
    errors.memberCount = 'Member count must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate intern data
 */
export const validateIntern = (intern) => {
  const errors = {};

  if (!intern.firstName || intern.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  }

  if (!intern.lastName || intern.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  }

  if (!intern.email || !validateEmail(intern.email)) {
    errors.email = 'Valid email is required';
  }

  if (intern.phone && !validatePhone(intern.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!intern.teamId) {
    errors.teamId = 'Team assignment is required';
  }

  if (intern.hourlyRate !== undefined && (isNaN(intern.hourlyRate) || intern.hourlyRate < 0)) {
    errors.hourlyRate = 'Hourly rate must be a positive number';
  }

  if (intern.graduationYear && (isNaN(intern.graduationYear) || intern.graduationYear < 2020 || intern.graduationYear > 2030)) {
    errors.graduationYear = 'Invalid graduation year';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate task data
 */
export const validateTask = (task) => {
  const errors = {};

  if (!task.title || task.title.trim() === '') {
    errors.title = 'Task title is required';
  }

  if (!task.teamId) {
    errors.teamId = 'Team assignment is required';
  }

  if (!['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = 'Invalid priority value';
  }

  if (!['pending', 'in-progress', 'completed', 'blocked'].includes(task.status)) {
    errors.status = 'Invalid status value';
  }

  if (task.progress !== undefined && (isNaN(task.progress) || task.progress < 0 || task.progress > 100)) {
    errors.progress = 'Progress must be between 0 and 100';
  }

  if (task.estimatedHours !== undefined && (isNaN(task.estimatedHours) || task.estimatedHours < 0)) {
    errors.estimatedHours = 'Estimated hours must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate finance data
 */
export const validateFinance = (finance) => {
  const errors = {};

  if (!['expense', 'revenue'].includes(finance.type)) {
    errors.type = 'Invalid transaction type';
  }

  if (!finance.category || finance.category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (!finance.amount || isNaN(finance.amount) || finance.amount <= 0) {
    errors.amount = 'Amount must be a positive number';
  }

  if (!finance.description || finance.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (!finance.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================================
// CRUD OPERATIONS - TEAMS
// ============================================================================

export const createTeam = (teams, teamData) => {
  const validation = validateTeam(teamData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newTeam = {
    id: uuidv4(),
    ...teamData,
    memberCount: teamData.memberCount || 0,
    budget: teamData.budget || 0,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: [...teams, newTeam],
    item: newTeam,
  };
};

export const updateTeam = (teams, teamId, updates) => {
  const teamIndex = teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) {
    return { success: false, error: 'Team not found' };
  }

  const updatedTeam = { ...teams[teamIndex], ...updates, updatedAt: new Date().toISOString() };
  const validation = validateTeam(updatedTeam);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newTeams = [...teams];
  newTeams[teamIndex] = updatedTeam;

  return {
    success: true,
    data: newTeams,
    item: updatedTeam,
  };
};

export const deleteTeam = (teams, teamId) => {
  const teamIndex = teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) {
    return { success: false, error: 'Team not found' };
  }

  const newTeams = teams.filter(t => t.id !== teamId);

  return {
    success: true,
    data: newTeams,
  };
};

export const getTeamById = (teams, teamId) => {
  return teams.find(t => t.id === teamId) || null;
};

// ============================================================================
// CRUD OPERATIONS - INTERNS
// ============================================================================

export const createIntern = (interns, internData) => {
  const validation = validateIntern(internData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newIntern = {
    id: uuidv4(),
    ...internData,
    hoursWorked: internData.hoursWorked || 0,
    status: internData.status || 'active',
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: [...interns, newIntern],
    item: newIntern,
  };
};

export const updateIntern = (interns, internId, updates) => {
  const internIndex = interns.findIndex(i => i.id === internId);
  if (internIndex === -1) {
    return { success: false, error: 'Intern not found' };
  }

  const updatedIntern = { ...interns[internIndex], ...updates, updatedAt: new Date().toISOString() };
  const validation = validateIntern(updatedIntern);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newInterns = [...interns];
  newInterns[internIndex] = updatedIntern;

  return {
    success: true,
    data: newInterns,
    item: updatedIntern,
  };
};

export const deleteIntern = (interns, internId) => {
  const internIndex = interns.findIndex(i => i.id === internId);
  if (internIndex === -1) {
    return { success: false, error: 'Intern not found' };
  }

  const newInterns = interns.filter(i => i.id !== internId);

  return {
    success: true,
    data: newInterns,
  };
};

export const getInternById = (interns, internId) => {
  return interns.find(i => i.id === internId) || null;
};

// ============================================================================
// CRUD OPERATIONS - TASKS
// ============================================================================

export const createTask = (tasks, taskData) => {
  const validation = validateTask(taskData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newTask = {
    id: uuidv4(),
    ...taskData,
    status: taskData.status || 'pending',
    progress: taskData.progress || 0,
    actualHours: taskData.actualHours || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: [...tasks, newTask],
    item: newTask,
  };
};

export const updateTask = (tasks, taskId, updates) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const updatedTask = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
  const validation = validateTask(updatedTask);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newTasks = [...tasks];
  newTasks[taskIndex] = updatedTask;

  return {
    success: true,
    data: newTasks,
    item: updatedTask,
  };
};

export const deleteTask = (tasks, taskId) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const newTasks = tasks.filter(t => t.id !== taskId);

  return {
    success: true,
    data: newTasks,
  };
};

export const getTaskById = (tasks, taskId) => {
  return tasks.find(t => t.id === taskId) || null;
};

// ============================================================================
// CRUD OPERATIONS - FINANCES
// ============================================================================

export const createFinance = (finances, financeData) => {
  const validation = validateFinance(financeData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newFinance = {
    id: uuidv4(),
    ...financeData,
    status: financeData.status || 'pending',
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: [...finances, newFinance],
    item: newFinance,
  };
};

export const updateFinance = (finances, financeId, updates) => {
  const financeIndex = finances.findIndex(f => f.id === financeId);
  if (financeIndex === -1) {
    return { success: false, error: 'Finance record not found' };
  }

  const updatedFinance = { ...finances[financeIndex], ...updates, updatedAt: new Date().toISOString() };
  const validation = validateFinance(updatedFinance);

  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const newFinances = [...finances];
  newFinances[financeIndex] = updatedFinance;

  return {
    success: true,
    data: newFinances,
    item: updatedFinance,
  };
};

export const deleteFinance = (finances, financeId) => {
  const financeIndex = finances.findIndex(f => f.id === financeId);
  if (financeIndex === -1) {
    return { success: false, error: 'Finance record not found' };
  }

  const newFinances = finances.filter(f => f.id !== financeId);

  return {
    success: true,
    data: newFinances,
  };
};

export const getFinanceById = (finances, financeId) => {
  return finances.find(f => f.id === financeId) || null;
};

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

/**
 * Search teams by name or description
 */
export const searchTeams = (teams, query) => {
  const lowerQuery = query.toLowerCase();
  return teams.filter(team =>
    team.name.toLowerCase().includes(lowerQuery) ||
    (team.description && team.description.toLowerCase().includes(lowerQuery)) ||
    (team.lead && team.lead.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Search interns by name, email, or team
 */
export const searchInterns = (interns, query) => {
  const lowerQuery = query.toLowerCase();
  return interns.filter(intern =>
    intern.firstName.toLowerCase().includes(lowerQuery) ||
    intern.lastName.toLowerCase().includes(lowerQuery) ||
    intern.email.toLowerCase().includes(lowerQuery) ||
    (intern.teamName && intern.teamName.toLowerCase().includes(lowerQuery)) ||
    (intern.university && intern.university.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Search tasks by title or description
 */
export const searchTasks = (tasks, query) => {
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerQuery) ||
    (task.description && task.description.toLowerCase().includes(lowerQuery)) ||
    (task.teamName && task.teamName.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Filter items by multiple criteria
 */
export const filterItems = (items, filters) => {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      return item[key] === value;
    });
  });
};

/**
 * Sort items by field
 */
export const sortItems = (items, field, direction = 'asc') => {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Get interns by team
 */
export const getInternsByTeam = (interns, teamId) => {
  return interns.filter(intern => intern.teamId === teamId);
};

/**
 * Get tasks by team
 */
export const getTasksByTeam = (tasks, teamId) => {
  return tasks.filter(task => task.teamId === teamId);
};

/**
 * Get tasks by intern
 */
export const getTasksByIntern = (tasks, internId) => {
  return tasks.filter(task => task.assignedTo === internId);
};

/**
 * Get finances by team
 */
export const getFinancesByTeam = (finances, teamId) => {
  return finances.filter(finance => finance.teamId === teamId);
};

/**
 * Get finances by intern
 */
export const getFinancesByIntern = (finances, internId) => {
  return finances.filter(finance => finance.internId === internId);
};

/**
 * Calculate total expenses
 */
export const calculateTotalExpenses = (finances) => {
  return finances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + (f.amount || 0), 0);
};

/**
 * Calculate total revenue
 */
export const calculateTotalRevenue = (finances) => {
  return finances
    .filter(f => f.type === 'revenue')
    .reduce((sum, f) => sum + (f.amount || 0), 0);
};

/**
 * Calculate team budget utilization
 */
export const calculateTeamBudgetUtilization = (team, finances) => {
  const teamExpenses = getFinancesByTeam(finances, team.id)
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  return {
    budget: team.budget,
    spent: teamExpenses,
    remaining: team.budget - teamExpenses,
    utilizationPercent: team.budget > 0 ? (teamExpenses / team.budget) * 100 : 0,
  };
};

/**
 * Get task statistics
 */
export const getTaskStatistics = (tasks) => {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };
};

/**
 * Get intern statistics
 */
export const getInternStatistics = (interns) => {
  return {
    total: interns.length,
    active: interns.filter(i => i.status === 'active').length,
    onLeave: interns.filter(i => i.status === 'on-leave').length,
    totalHours: interns.reduce((sum, i) => sum + (i.hoursWorked || 0), 0),
    averageHours: interns.length > 0 ? interns.reduce((sum, i) => sum + (i.hoursWorked || 0), 0) / interns.length : 0,
  };
};

export default {
  // Validation
  validateTeam,
  validateIntern,
  validateTask,
  validateFinance,
  validateEmail,
  validatePhone,
  // Teams CRUD
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
  // Interns CRUD
  createIntern,
  updateIntern,
  deleteIntern,
  getInternById,
  // Tasks CRUD
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  // Finances CRUD
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceById,
  // Search and Filter
  searchTeams,
  searchInterns,
  searchTasks,
  filterItems,
  sortItems,
  // Data Transformation
  getInternsByTeam,
  getTasksByTeam,
  getTasksByIntern,
  getFinancesByTeam,
  getFinancesByIntern,
  calculateTotalExpenses,
  calculateTotalRevenue,
  calculateTeamBudgetUtilization,
  getTaskStatistics,
  getInternStatistics,
};
