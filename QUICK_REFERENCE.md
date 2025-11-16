# State Management Quick Reference

## Quick Start

### 1. Using App State
```javascript
import { useAppContext } from './Context/AppContext';

function MyComponent() {
  const { addNotification, toggleSidebar, openModal } = useAppContext();

  addNotification({ type: 'success', message: 'Action completed!' });
  toggleSidebar();
  openModal('create-team');
}
```

### 2. Using Teams
```javascript
import { useTeams } from './hooks';

function TeamsPage() {
  const { teams, teamStats, createTeam, updateTeam, deleteTeam } = useTeams();

  const handleCreate = () => {
    const result = createTeam({
      name: 'Engineering',
      description: 'Dev team',
      budget: 100000,
    });

    if (result.success) {
      console.log('Created:', result.team);
    }
  };
}
```

### 3. Using Interns
```javascript
import { useInterns } from './hooks';

function InternsPage() {
  const { interns, internStats, createIntern, getTopPerformers } = useInterns();

  const topPerformers = getTopPerformers(5);
  console.log('Top 5:', topPerformers);
}
```

### 4. Using Tasks
```javascript
import { useTasks } from './hooks';

function TasksPage() {
  const {
    tasks,
    taskStats,
    getOverdueTasks,
    getHighPriorityTasks,
    updateTask
  } = useTasks();

  const overdue = getOverdueTasks();
  const urgent = getHighPriorityTasks();
}
```

### 5. Using Finances
```javascript
import { useFinances } from './hooks';

function FinancesPage() {
  const {
    finances,
    financeStats,
    getExpenseTrend,
    getMonthlySummary
  } = useFinances();

  const trend = getExpenseTrend(6); // Last 6 months
  const thisMonth = getMonthlySummary(2025, 10); // November 2025
}
```

## Common Operations

### Create Entity
```javascript
const { createTeam } = useTeams();

const result = createTeam({
  name: 'Team Name',
  description: 'Description',
  budget: 50000,
});

if (result.success) {
  // Success
} else {
  // Handle errors: result.errors
}
```

### Update Entity
```javascript
const { updateTeam } = useTeams();

const result = updateTeam(teamId, {
  budget: 75000,
});

if (result.success) {
  // Success
}
```

### Delete Entity
```javascript
const { deleteTeam } = useTeams();

const result = deleteTeam(teamId);
```

### Search
```javascript
const { searchTeams } = useDataContext();

const results = searchTeams('engineering');
```

### Filter & Sort
```javascript
const { filterTeams, sortTeams } = useTeams();

const filtered = filterTeams({ status: 'active' });
const sorted = sortTeams('budget', 'desc');
```

## Data Operations

### Load Demo Data
```javascript
import { useDataContext } from './Context/DataContext';
import { generateDemoData } from './utils/seedData';

const { loadDemoData } = useDataContext();
const demoData = generateDemoData();
loadDemoData(demoData);
```

### Export Data
```javascript
import { downloadDataAsJson } from './utils/storage';

downloadDataAsJson('backup.json');
```

### Import Data
```javascript
import { importData } from './utils/storage';

// After loading JSON file
const success = importData(jsonData);
```

### Undo/Redo
```javascript
import { undo, redo, canUndo, canRedo } from './utils/history';

if (canUndo()) {
  const result = undo();
  console.log('Undid:', result.description);
}

if (canRedo()) {
  redo();
}
```

## Statistics

### Team Stats
```javascript
const { teamStats } = useTeams();

// teamStats.total
// teamStats.totalBudget
// teamStats.totalMembers
// teamStats.averageBudget
```

### Intern Stats
```javascript
const { internStats } = useInterns();

// internStats.total
// internStats.active
// internStats.totalHours
// internStats.totalSalary
// internStats.averageHourlyRate
```

### Task Stats
```javascript
const { taskStats } = useTasks();

// taskStats.total
// taskStats.pending
// taskStats.inProgress
// taskStats.completed
// taskStats.completionRate
```

### Finance Stats
```javascript
const { financeStats } = useFinances();

// financeStats.totalRevenue
// financeStats.totalExpenses
// financeStats.netIncome
// financeStats.profitMargin
```

## Advanced Queries

### Get Related Data
```javascript
const { getInternsByTeam, getTasksByTeam } = useDataContext();

const teamInterns = getInternsByTeam(teamId);
const teamTasks = getTasksByTeam(teamId);
```

### Get Team with Full Details
```javascript
const { getTeamWithDetails } = useTeams();

const team = getTeamWithDetails(teamId);
// team.interns
// team.tasks
// team.finances
// team.budgetUtilization
```

### Get Intern with Full Details
```javascript
const { getInternWithDetails } = useInterns();

const intern = getInternWithDetails(internId);
// intern.team
// intern.tasks
// intern.totalEarnings
```

### Monthly/Yearly Summaries
```javascript
const { getMonthlySummary, getYearlySummary } = useFinances();

const november = getMonthlySummary(2025, 10); // Month is 0-indexed
const year2025 = getYearlySummary(2025);

// november.expenses
// november.revenue
// november.netIncome
```

## Notifications

```javascript
const { addNotification } = useAppContext();

// Success notification (auto-dismiss in 5s)
addNotification({
  type: 'success',
  message: 'Operation completed!',
});

// Error notification (stays until dismissed)
addNotification({
  type: 'error',
  message: 'Something went wrong',
});

// Info notification
addNotification({
  type: 'info',
  message: 'FYI: Something happened',
});

// Warning notification
addNotification({
  type: 'warning',
  message: 'Please be careful',
});
```

## Modal Management

```javascript
const { openModal, closeModal, state } = useAppContext();

// Open modal with data
openModal('create-team', { defaultBudget: 50000 });

// Close modal
closeModal();

// Check active modal
if (state.activeModal === 'create-team') {
  // Modal is open
}

// Access modal data
const modalData = state.modalData;
```

## Validation

All CRUD operations validate data automatically:

```javascript
const result = createIntern({
  firstName: '',        // ❌ Will fail - required
  email: 'invalid',     // ❌ Will fail - invalid format
  hourlyRate: -10,      // ❌ Will fail - must be positive
});

if (!result.success) {
  console.log(result.errors);
  // {
  //   firstName: 'First name is required',
  //   email: 'Valid email is required',
  //   hourlyRate: 'Hourly rate must be positive'
  // }
}
```

## Best Practices

1. **Always check result.success**
   ```javascript
   const result = createTeam(data);
   if (result.success) {
     // Handle success
   } else {
     // Handle errors
   }
   ```

2. **Use custom hooks in components**
   ```javascript
   // ✅ Good
   const { teams } = useTeams();

   // ❌ Avoid
   const { teams } = useDataContext();
   ```

3. **Load demo data for testing**
   ```javascript
   import { generateDemoData } from './utils/seedData';
   const demoData = generateDemoData();
   loadDemoData(demoData);
   ```

4. **Create backups before major operations**
   ```javascript
   import { createBackup } from './utils/storage';
   createBackup();
   // ... perform operations
   ```

5. **Use notifications for user feedback**
   ```javascript
   const result = createTeam(data);
   addNotification({
     type: result.success ? 'success' : 'error',
     message: result.success ? 'Team created!' : 'Failed to create team',
   });
   ```

## File Locations

- **Contexts**: `/src/Context/`
- **Hooks**: `/src/hooks/`
- **Utils**: `/src/utils/`
- **Examples**: `/src/examples/StateManagementExamples.js`
- **Full Docs**: `/STATE_MANAGEMENT_README.md`

## Need Help?

1. Check examples: `/src/examples/StateManagementExamples.js`
2. Read full docs: `/STATE_MANAGEMENT_README.md`
3. Check implementation: `/IMPLEMENTATION_SUMMARY.md`
