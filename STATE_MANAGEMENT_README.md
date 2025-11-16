# State Management & Data Persistence System

A comprehensive state management and data persistence system for the Startup Dashboard application.

## Overview

This system provides:
- Centralized state management using React Context API
- Persistent data storage using localStorage
- CRUD operations for all data entities
- Data validation and integrity checks
- Undo/redo functionality
- Data import/export capabilities
- Auto-save functionality
- Custom hooks for easy data access
- Demo data seeding

## Architecture

### Context Providers

#### 1. AppContext (`src/Context/AppContext.js`)
Manages global application state including:
- UI state (sidebar, active view, theme)
- Notifications
- User preferences
- Loading/error states
- Modal/dialog state
- Search and filters

**Usage:**
```javascript
import { useAppContext } from './Context/AppContext';

function MyComponent() {
  const {
    state,
    toggleSidebar,
    addNotification,
    setActiveView,
    openModal,
  } = useAppContext();

  return (
    <button onClick={() => addNotification({ type: 'success', message: 'Done!' })}>
      Notify
    </button>
  );
}
```

#### 2. DataContext (`src/Context/DataContext.js`)
Manages all application data:
- Teams
- Interns
- Tasks
- Finances

**Usage:**
```javascript
import { useDataContext } from './Context/DataContext';

function MyComponent() {
  const { teams, createTeam, updateTeam, deleteTeam } = useDataContext();

  const handleCreateTeam = () => {
    const result = createTeam({
      name: 'Engineering',
      description: 'Software development team',
      budget: 100000,
    });

    if (result.success) {
      console.log('Created:', result.team);
    }
  };

  return <button onClick={handleCreateTeam}>Create Team</button>;
}
```

### Custom Hooks

#### useTeams (`src/hooks/useTeams.js`)
```javascript
import { useTeams } from './hooks';

const {
  teams,                    // All teams
  teamStats,                // Statistics
  teamsWithDetails,         // Teams with related data
  createTeam,               // Create new team
  updateTeam,               // Update team
  deleteTeam,               // Delete team
  getTeamById,              // Get single team
  getTeamWithDetails,       // Get team with interns, tasks, finances
  searchTeams,              // Search teams
  sortTeams,                // Sort teams
  filterTeams,              // Filter teams
  getInternsByTeam,         // Get team's interns
  getTasksByTeam,           // Get team's tasks
  getFinancesByTeam,        // Get team's finances
} = useTeams();
```

#### useInterns (`src/hooks/useInterns.js`)
```javascript
import { useInterns } from './hooks';

const {
  interns,                  // All interns
  internStats,              // Statistics
  internsWithDetails,       // Interns with related data
  createIntern,             // Create new intern
  updateIntern,             // Update intern
  deleteIntern,             // Delete intern
  getInternById,            // Get single intern
  getInternWithDetails,     // Get intern with tasks, finances, team
  searchInterns,            // Search interns
  sortInterns,              // Sort interns
  filterInterns,            // Filter interns
  getInternsByStatus,       // Get by status
  getInternsByTeamId,       // Get by team
  getInternsByPerformance,  // Get by performance
  getTopPerformers,         // Get top performers
} = useInterns();
```

#### useTasks (`src/hooks/useTasks.js`)
```javascript
import { useTasks } from './hooks';

const {
  tasks,                    // All tasks
  taskStats,                // Statistics
  tasksWithDetails,         // Tasks with related data
  createTask,               // Create new task
  updateTask,               // Update task
  deleteTask,               // Delete task
  getTaskById,              // Get single task
  getTaskWithDetails,       // Get task with team, assignee
  searchTasks,              // Search tasks
  sortTasks,                // Sort tasks
  filterTasks,              // Filter tasks
  getTasksByStatus,         // Get by status
  getTasksByPriority,       // Get by priority
  getTasksByTeam,           // Get by team
  getTasksByIntern,         // Get by intern
  getOverdueTasks,          // Get overdue tasks
  getUpcomingTasks,         // Get upcoming tasks
  getUnassignedTasks,       // Get unassigned tasks
  getHighPriorityTasks,     // Get high priority tasks
  getCompletionTrend,       // Get completion trend
} = useTasks();
```

#### useFinances (`src/hooks/useFinances.js`)
```javascript
import { useFinances } from './hooks';

const {
  finances,                 // All finances
  financeStats,             // Statistics
  financesWithDetails,      // Finances with related data
  createFinance,            // Create new finance record
  updateFinance,            // Update finance record
  deleteFinance,            // Delete finance record
  getFinanceById,           // Get single finance record
  getFinanceWithDetails,    // Get finance with team, intern
  sortFinances,             // Sort finances
  filterFinances,           // Filter finances
  getFinancesByType,        // Get by type (expense/revenue)
  getFinancesByCategory,    // Get by category
  getFinancesByStatus,      // Get by status
  getFinancesByTeam,        // Get by team
  getFinancesByIntern,      // Get by intern
  getFinancesByDateRange,   // Get by date range
  getTopExpenses,           // Get top expenses
  getRecentTransactions,    // Get recent transactions
  getMonthlySummary,        // Get monthly summary
  getYearlySummary,         // Get yearly summary
  getTeamBudgetOverview,    // Get budget overview
  getExpenseTrend,          // Get expense trend
} = useFinances();
```

### Utility Functions

#### Storage (`src/utils/storage.js`)
```javascript
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearAllStorage,
  exportData,
  importData,
  downloadDataAsJson,
  createBackup,
  restoreFromBackup,
  getStorageInfo,
  migrateData,
} from './utils/storage';

// Export all data
const data = exportData();

// Download as JSON file
downloadDataAsJson('backup.json');

// Import data
importData(importedData);

// Create backup
createBackup();

// Restore from backup
restoreFromBackup();
```

#### Data Manager (`src/utils/dataManager.js`)
```javascript
import {
  // Validation
  validateTeam,
  validateIntern,
  validateTask,
  validateFinance,
  validateEmail,
  validatePhone,

  // CRUD operations (used internally by context)
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,

  // Search and filter
  searchTeams,
  searchInterns,
  searchTasks,
  filterItems,
  sortItems,

  // Data transformation
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
} from './utils/dataManager';
```

#### Synchronization (`src/utils/sync.js`)
```javascript
import {
  // Auto-save
  enableAutoSave,
  disableAutoSave,
  startAutoSave,
  stopAutoSave,

  // Optimistic updates
  addOptimisticUpdate,
  confirmOptimisticUpdate,
  rollbackOptimisticUpdate,

  // Conflict resolution
  detectConflicts,
  resolveConflicts,

  // Data consistency
  validateDataIntegrity,
  fixDataIntegrity,

  // Synchronization
  syncToStorage,
  syncFromStorage,
  debounce,
  createDebouncedSave,
} from './utils/sync';

// Enable auto-save (30 seconds)
enableAutoSave(30000);

// Validate data integrity
const validation = validateDataIntegrity(data);
if (!validation.isValid) {
  console.log('Issues:', validation.issues);
  const fixedData = fixDataIntegrity(data);
}
```

#### History/Undo-Redo (`src/utils/history.js`)
```javascript
import {
  initializeHistory,
  recordChange,
  undo,
  redo,
  canUndo,
  canRedo,
  getCurrentState,
  getHistoryInfo,
  getHistoryList,
  jumpToHistory,
  clearHistory,
  resetHistory,
  createBatch,
} from './utils/history';

// Check if undo/redo available
if (canUndo()) {
  const result = undo();
  console.log('Undid:', result.description);
}

if (canRedo()) {
  const result = redo();
}

// Get history info
const info = getHistoryInfo();
console.log(`Past: ${info.pastCount}, Future: ${info.futureCount}`);

// Batch multiple changes
const batch = createBatch('Multiple team updates');
batch.add(state => updateTeam(state, teamId1, updates1));
batch.add(state => updateTeam(state, teamId2, updates2));
const newState = batch.apply(currentState);
```

#### Seed Data (`src/utils/seedData.js`)
```javascript
import {
  generateDemoData,
  getEmptyData,
  generateTeamsData,
  generateInternsData,
  generateTasksData,
  generateFinancesData,
} from './utils/seedData';

// Generate complete demo dataset
const demoData = generateDemoData();
loadDemoData(demoData);

// Generate individual data types
const teams = generateTeamsData();
const interns = generateInternsData(teams);
const tasks = generateTasksData(teams, interns);
const finances = generateFinancesData(teams, interns);
```

## Data Models

### Team
```javascript
{
  id: string,
  name: string,
  description: string,
  color: string,
  lead: string,
  memberCount: number,
  budget: number,
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
}
```

### Intern
```javascript
{
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  teamId: string,
  teamName: string,
  position: string,
  university: string,
  graduationYear: number,
  skills: string[],
  startDate: string (ISO date),
  hourlyRate: number,
  hoursWorked: number,
  status: 'active' | 'on-leave',
  performance: 'excellent' | 'good' | 'satisfactory',
  avatar: string (URL),
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
}
```

### Task
```javascript
{
  id: string,
  title: string,
  description: string,
  teamId: string,
  teamName: string,
  assignedTo: string (intern ID),
  assignedToName: string,
  priority: 'low' | 'medium' | 'high',
  status: 'pending' | 'in-progress' | 'completed' | 'blocked',
  progress: number (0-100),
  estimatedHours: number,
  actualHours: number,
  dueDate: string (ISO date),
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
  tags: string,
}
```

### Finance
```javascript
{
  id: string,
  type: 'expense' | 'revenue',
  category: string,
  amount: number,
  description: string,
  teamId: string,
  internId: string (optional),
  date: string (ISO date),
  status: 'pending' | 'completed' | 'approved',
  paymentMethod: string,
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
}
```

## Features

### 1. Automatic Persistence
All data changes are automatically saved to localStorage with debouncing to optimize performance.

### 2. Data Validation
All CRUD operations include comprehensive validation:
- Required fields
- Format validation (email, phone)
- Type checking
- Range validation

### 3. Data Integrity
The system automatically:
- Detects orphaned records
- Removes duplicate IDs
- Fixes relational inconsistencies

### 4. Undo/Redo
Track up to 50 state changes with full undo/redo support.

### 5. Import/Export
Export data as JSON for backup or migration. Import data from JSON files.

### 6. Search & Filter
Powerful search and filter capabilities across all data types.

### 7. Statistics & Analytics
Built-in functions for:
- Team statistics
- Intern performance metrics
- Task completion rates
- Financial summaries
- Trends and reports

## Installation

The system is already integrated into the application. All required dependencies are installed, including:
- `uuid` for generating unique IDs

## Usage Examples

See `/docs/examples/StateManagementExamples.js` for comprehensive usage examples.

## Best Practices

1. **Always use custom hooks** when accessing data in components
2. **Check validation results** before assuming CRUD operations succeeded
3. **Use batch operations** when making multiple related changes
4. **Enable auto-save** for better UX
5. **Create backups** before major operations
6. **Validate imported data** before using it

## Error Handling

All CRUD operations return a result object:
```javascript
{
  success: boolean,
  data?: any,           // Updated data array
  item?: any,           // Created/updated item
  error?: string,       // Error message
  errors?: object,      // Validation errors
}
```

Always check the `success` flag:
```javascript
const result = createTeam(teamData);
if (result.success) {
  // Handle success
  console.log('Created:', result.team);
} else {
  // Handle errors
  console.error('Errors:', result.errors);
}
```

## Performance Considerations

- **Debounced saves**: Storage operations are debounced (1 second)
- **Auto-save interval**: Default 30 seconds (configurable)
- **History limit**: Max 50 entries to prevent memory issues
- **Memoization**: Custom hooks use `useMemo` for expensive computations

## Migration

The system includes version tracking and migration support. When updating data structures:

1. Update `CURRENT_VERSION` in `storage.js`
2. Add migration logic in `migrateData()` function
3. Test thoroughly before deployment

## Troubleshooting

### Data not persisting
- Check browser localStorage is enabled
- Verify no errors in console
- Check storage quota

### Performance issues
- Reduce auto-save frequency
- Clear old history entries
- Limit search results

### Validation errors
- Check data models documentation
- Verify all required fields
- Ensure correct data types

## Support

For issues or questions, check:
1. This README
2. Example implementations in `/src/examples`
3. Inline code documentation
4. Type definitions and JSDoc comments

## License

Part of the Startup Dashboard application.
