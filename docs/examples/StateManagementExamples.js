/**
 * State Management Usage Examples
 *
 * This file demonstrates how to use the state management and data persistence system.
 * These are example components showing various usage patterns.
 */

import React, { useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';
import { useDataContext } from '../Context/DataContext';
import { useTeams, useInterns, useTasks, useFinances } from '../hooks';
import { generateDemoData } from '../utils/seedData';
import { exportData, downloadDataAsJson, importData } from '../utils/storage';
import { undo, redo, canUndo, canRedo, getHistoryInfo } from '../utils/history';

// ============================================================================
// Example 1: Using App Context for UI State
// ============================================================================

export const AppStateExample = () => {
  const {
    state,
    toggleSidebar,
    setActiveView,
    addNotification,
    openModal,
    setGlobalSearch,
  } = useAppContext();

  const handleToggleSidebar = () => {
    toggleSidebar();
    addNotification({
      type: 'info',
      message: `Sidebar ${state.sidebarCollapsed ? 'expanded' : 'collapsed'}`,
    });
  };

  return (
    <div>
      <h2>App State Example</h2>
      <p>Sidebar collapsed: {state.sidebarCollapsed ? 'Yes' : 'No'}</p>
      <p>Active view: {state.activeView}</p>
      <button onClick={handleToggleSidebar}>Toggle Sidebar</button>
      <button onClick={() => setActiveView('dashboard')}>Set Dashboard View</button>
      <button onClick={() => openModal('create-team')}>Open Modal</button>
      <input
        type="text"
        placeholder="Global search..."
        value={state.globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
      />
    </div>
  );
};

// ============================================================================
// Example 2: Using Data Context for CRUD Operations
// ============================================================================

export const DataCRUDExample = () => {
  const { createTeam, updateTeam, deleteTeam, teams } = useDataContext();

  const handleCreateTeam = () => {
    const result = createTeam({
      name: 'New Engineering Team',
      description: 'A brand new engineering team',
      color: '#3b82f6',
      lead: 'John Doe',
      memberCount: 0,
      budget: 50000,
    });

    if (result.success) {
      console.log('Team created:', result.team);
    } else {
      console.error('Failed to create team:', result.errors);
    }
  };

  const handleUpdateTeam = (teamId) => {
    const result = updateTeam(teamId, {
      budget: 75000,
      memberCount: 5,
    });

    if (result.success) {
      console.log('Team updated:', result.team);
    } else {
      console.error('Failed to update team:', result.error);
    }
  };

  const handleDeleteTeam = (teamId) => {
    const result = deleteTeam(teamId);

    if (result.success) {
      console.log('Team deleted');
    } else {
      console.error('Failed to delete team:', result.error);
    }
  };

  return (
    <div>
      <h2>Data CRUD Example</h2>
      <button onClick={handleCreateTeam}>Create Team</button>
      <h3>Teams ({teams.length})</h3>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            {team.name} - Budget: ${team.budget}
            <button onClick={() => handleUpdateTeam(team.id)}>Update</button>
            <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// Example 3: Using Custom Hooks
// ============================================================================

export const CustomHooksExample = () => {
  const { teams, teamStats, createTeam, getTeamWithDetails } = useTeams();
  const { interns, internStats, searchInterns } = useInterns();
  const { tasks, taskStats, getOverdueTasks, getHighPriorityTasks } = useTasks();
  const { finances, financeStats, getExpenseTrend } = useFinances();

  const overdueTasks = getOverdueTasks();
  const highPriorityTasks = getHighPriorityTasks();
  const expenseTrend = getExpenseTrend(6);

  return (
    <div>
      <h2>Custom Hooks Example</h2>

      <div>
        <h3>Team Statistics</h3>
        <p>Total teams: {teamStats.total}</p>
        <p>Total budget: ${teamStats.totalBudget}</p>
        <p>Total members: {teamStats.totalMembers}</p>
      </div>

      <div>
        <h3>Intern Statistics</h3>
        <p>Total interns: {internStats.total}</p>
        <p>Active interns: {internStats.active}</p>
        <p>Total hours: {internStats.totalHours}</p>
      </div>

      <div>
        <h3>Task Statistics</h3>
        <p>Total tasks: {taskStats.total}</p>
        <p>Completed: {taskStats.completed}</p>
        <p>In Progress: {taskStats.inProgress}</p>
        <p>Overdue: {overdueTasks.length}</p>
        <p>High Priority: {highPriorityTasks.length}</p>
      </div>

      <div>
        <h3>Finance Statistics</h3>
        <p>Total revenue: ${financeStats.totalRevenue}</p>
        <p>Total expenses: ${financeStats.totalExpenses}</p>
        <p>Net income: ${financeStats.netIncome}</p>
        <p>Profit margin: {financeStats.profitMargin.toFixed(2)}%</p>
      </div>

      <div>
        <h3>Expense Trend (Last 6 Months)</h3>
        <ul>
          {expenseTrend.map((month, index) => (
            <li key={index}>
              {month.month}: ${month.expenses} expenses, ${month.revenue} revenue
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// Example 4: Loading Demo Data
// ============================================================================

export const DemoDataExample = () => {
  const { loadDemoData, resetData, teams, interns, tasks, finances } = useDataContext();

  const handleLoadDemoData = () => {
    const demoData = generateDemoData();
    loadDemoData(demoData);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      resetData();
    }
  };

  return (
    <div>
      <h2>Demo Data Example</h2>
      <button onClick={handleLoadDemoData}>Load Demo Data</button>
      <button onClick={handleResetData}>Reset All Data</button>
      <div>
        <p>Current data:</p>
        <ul>
          <li>Teams: {teams.length}</li>
          <li>Interns: {interns.length}</li>
          <li>Tasks: {tasks.length}</li>
          <li>Finances: {finances.length}</li>
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// Example 5: Data Export/Import
// ============================================================================

export const DataExportImportExample = () => {
  const handleExportData = () => {
    const data = exportData();
    console.log('Exported data:', data);
  };

  const handleDownloadData = () => {
    downloadDataAsJson('my-startup-data-backup.json');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          const success = importData(importedData);
          if (success) {
            alert('Data imported successfully! Please reload the page.');
          } else {
            alert('Failed to import data');
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Data Export/Import Example</h2>
      <button onClick={handleExportData}>Export Data (Console)</button>
      <button onClick={handleDownloadData}>Download Data as JSON</button>
      <div>
        <label>
          Import Data:
          <input type="file" accept=".json" onChange={handleImportData} />
        </label>
      </div>
    </div>
  );
};

// ============================================================================
// Example 6: Undo/Redo Functionality
// ============================================================================

export const UndoRedoExample = () => {
  const { createTeam, updateTeam } = useDataContext();
  const [historyInfo, setHistoryInfo] = React.useState(getHistoryInfo());

  useEffect(() => {
    // Update history info when it changes
    const interval = setInterval(() => {
      setHistoryInfo(getHistoryInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUndo = () => {
    const result = undo();
    if (result) {
      console.log('Undid:', result.description);
      setHistoryInfo(getHistoryInfo());
    }
  };

  const handleRedo = () => {
    const result = redo();
    if (result) {
      console.log('Redid action');
      setHistoryInfo(getHistoryInfo());
    }
  };

  const handleCreateTeam = () => {
    createTeam({
      name: `Team ${Date.now()}`,
      description: 'Test team',
      color: '#3b82f6',
      lead: 'Test Lead',
      budget: 50000,
    });
    setHistoryInfo(getHistoryInfo());
  };

  return (
    <div>
      <h2>Undo/Redo Example</h2>
      <button onClick={handleCreateTeam}>Create Test Team</button>
      <button onClick={handleUndo} disabled={!canUndo()}>
        Undo ({historyInfo.pastCount})
      </button>
      <button onClick={handleRedo} disabled={!canRedo()}>
        Redo ({historyInfo.futureCount})
      </button>
      <p>History: {historyInfo.pastCount} past, {historyInfo.futureCount} future</p>
    </div>
  );
};

// ============================================================================
// Example 7: Search and Filter
// ============================================================================

export const SearchFilterExample = () => {
  const { searchTeams, searchInterns, searchTasks } = useDataContext();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [results, setResults] = React.useState({ teams: [], interns: [], tasks: [] });

  const handleSearch = () => {
    setResults({
      teams: searchTeams(searchQuery),
      interns: searchInterns(searchQuery),
      tasks: searchTasks(searchQuery),
    });
  };

  return (
    <div>
      <h2>Search & Filter Example</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h3>Results</h3>
        <p>Teams: {results.teams.length}</p>
        <p>Interns: {results.interns.length}</p>
        <p>Tasks: {results.tasks.length}</p>
      </div>
    </div>
  );
};

// ============================================================================
// Example 8: Advanced Queries
// ============================================================================

export const AdvancedQueriesExample = () => {
  const {
    getInternsByTeam,
    getTasksByTeam,
    getFinancesByTeam,
    teams,
  } = useDataContext();

  const [selectedTeamId, setSelectedTeamId] = React.useState(null);
  const [teamData, setTeamData] = React.useState(null);

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setTeamData({
      interns: getInternsByTeam(teamId),
      tasks: getTasksByTeam(teamId),
      finances: getFinancesByTeam(teamId),
    });
  };

  return (
    <div>
      <h2>Advanced Queries Example</h2>
      <select onChange={(e) => handleSelectTeam(e.target.value)}>
        <option value="">Select a team</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {teamData && (
        <div>
          <h3>Team Data</h3>
          <p>Interns: {teamData.interns.length}</p>
          <p>Tasks: {teamData.tasks.length}</p>
          <p>Finance records: {teamData.finances.length}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Example Component
// ============================================================================

export const StateManagementExamples = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>State Management & Data Persistence Examples</h1>
      <p>
        This page demonstrates various features of the state management system.
        Open the browser console to see detailed logs.
      </p>

      <hr />
      <AppStateExample />

      <hr />
      <DataCRUDExample />

      <hr />
      <CustomHooksExample />

      <hr />
      <DemoDataExample />

      <hr />
      <DataExportImportExample />

      <hr />
      <UndoRedoExample />

      <hr />
      <SearchFilterExample />

      <hr />
      <AdvancedQueriesExample />
    </div>
  );
};

export default StateManagementExamples;
