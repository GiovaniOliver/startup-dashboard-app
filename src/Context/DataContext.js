/**
 * Data Context - Centralized data management for teams, interns, tasks, and finances
 */

import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import { syncToStorage, syncFromStorage, createDebouncedSave } from '../utils/sync';
import { initializeHistory, recordChange } from '../utils/history';
import * as dataManager from '../utils/dataManager';

// Initial state
const INITIAL_STATE = {
  teams: [],
  interns: [],
  tasks: [],
  finances: [],
  initialized: false,
};

// Action types
export const DATA_ACTIONS = {
  // Initialization
  INITIALIZE_DATA: 'INITIALIZE_DATA',
  RESET_DATA: 'RESET_DATA',

  // Teams
  SET_TEAMS: 'SET_TEAMS',
  ADD_TEAM: 'ADD_TEAM',
  UPDATE_TEAM: 'UPDATE_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',

  // Interns
  SET_INTERNS: 'SET_INTERNS',
  ADD_INTERN: 'ADD_INTERN',
  UPDATE_INTERN: 'UPDATE_INTERN',
  DELETE_INTERN: 'DELETE_INTERN',

  // Tasks
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',

  // Finances
  SET_FINANCES: 'SET_FINANCES',
  ADD_FINANCE: 'ADD_FINANCE',
  UPDATE_FINANCE: 'UPDATE_FINANCE',
  DELETE_FINANCE: 'DELETE_FINANCE',

  // Batch operations
  BATCH_UPDATE: 'BATCH_UPDATE',
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    // Initialization
    case DATA_ACTIONS.INITIALIZE_DATA:
      return {
        ...state,
        ...action.payload,
        initialized: true,
      };

    case DATA_ACTIONS.RESET_DATA:
      return {
        ...INITIAL_STATE,
        initialized: true,
      };

    // Teams
    case DATA_ACTIONS.SET_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };

    case DATA_ACTIONS.ADD_TEAM:
      return {
        ...state,
        teams: [...state.teams, action.payload],
      };

    case DATA_ACTIONS.UPDATE_TEAM:
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.id ? action.payload : team
        ),
      };

    case DATA_ACTIONS.DELETE_TEAM:
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
      };

    // Interns
    case DATA_ACTIONS.SET_INTERNS:
      return {
        ...state,
        interns: action.payload,
      };

    case DATA_ACTIONS.ADD_INTERN:
      return {
        ...state,
        interns: [...state.interns, action.payload],
      };

    case DATA_ACTIONS.UPDATE_INTERN:
      return {
        ...state,
        interns: state.interns.map(intern =>
          intern.id === action.payload.id ? action.payload : intern
        ),
      };

    case DATA_ACTIONS.DELETE_INTERN:
      return {
        ...state,
        interns: state.interns.filter(intern => intern.id !== action.payload),
      };

    // Tasks
    case DATA_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    case DATA_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case DATA_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case DATA_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    // Finances
    case DATA_ACTIONS.SET_FINANCES:
      return {
        ...state,
        finances: action.payload,
      };

    case DATA_ACTIONS.ADD_FINANCE:
      return {
        ...state,
        finances: [...state.finances, action.payload],
      };

    case DATA_ACTIONS.UPDATE_FINANCE:
      return {
        ...state,
        finances: state.finances.map(finance =>
          finance.id === action.payload.id ? action.payload : finance
        ),
      };

    case DATA_ACTIONS.DELETE_FINANCE:
      return {
        ...state,
        finances: state.finances.filter(finance => finance.id !== action.payload),
      };

    // Batch operations
    case DATA_ACTIONS.BATCH_UPDATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

// Create context
export const DataContext = createContext();

// Provider component
export const DataContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, INITIAL_STATE);

  // Initialize data from storage on mount
  useEffect(() => {
    const loadedData = syncFromStorage();
    dispatch({
      type: DATA_ACTIONS.INITIALIZE_DATA,
      payload: loadedData,
    });

    // Initialize history
    initializeHistory(loadedData);
  }, []);

  // Create debounced save function
  const debouncedSave = useCallback(
    createDebouncedSave(() => {
      syncToStorage({
        teams: state.teams,
        interns: state.interns,
        tasks: state.tasks,
        finances: state.finances,
      });
    }, 1000),
    [state]
  );

  // Save to storage when data changes
  useEffect(() => {
    if (state.initialized) {
      debouncedSave();
    }
  }, [state, debouncedSave]);

  // Record changes in history
  const recordStateChange = useCallback((description) => {
    recordChange({
      teams: state.teams,
      interns: state.interns,
      tasks: state.tasks,
      finances: state.finances,
    }, description);
  }, [state]);

  // ============================================================================
  // TEAMS OPERATIONS
  // ============================================================================

  const createTeam = useCallback((teamData) => {
    const result = dataManager.createTeam(state.teams, teamData);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.ADD_TEAM, payload: result.item });
      recordStateChange(`Created team: ${result.item.name}`);
      return { success: true, team: result.item };
    }
    return { success: false, errors: result.errors };
  }, [state.teams, recordStateChange]);

  const updateTeam = useCallback((teamId, updates) => {
    const result = dataManager.updateTeam(state.teams, teamId, updates);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.UPDATE_TEAM, payload: result.item });
      recordStateChange(`Updated team: ${result.item.name}`);
      return { success: true, team: result.item };
    }
    return { success: false, error: result.error, errors: result.errors };
  }, [state.teams, recordStateChange]);

  const deleteTeam = useCallback((teamId) => {
    const team = dataManager.getTeamById(state.teams, teamId);
    const result = dataManager.deleteTeam(state.teams, teamId);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.SET_TEAMS, payload: result.data });
      recordStateChange(`Deleted team: ${team?.name || teamId}`);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [state.teams, recordStateChange]);

  const getTeamById = useCallback((teamId) => {
    return dataManager.getTeamById(state.teams, teamId);
  }, [state.teams]);

  // ============================================================================
  // INTERNS OPERATIONS
  // ============================================================================

  const createIntern = useCallback((internData) => {
    const result = dataManager.createIntern(state.interns, internData);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.ADD_INTERN, payload: result.item });
      recordStateChange(`Created intern: ${result.item.firstName} ${result.item.lastName}`);
      return { success: true, intern: result.item };
    }
    return { success: false, errors: result.errors };
  }, [state.interns, recordStateChange]);

  const updateIntern = useCallback((internId, updates) => {
    const result = dataManager.updateIntern(state.interns, internId, updates);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.UPDATE_INTERN, payload: result.item });
      recordStateChange(`Updated intern: ${result.item.firstName} ${result.item.lastName}`);
      return { success: true, intern: result.item };
    }
    return { success: false, error: result.error, errors: result.errors };
  }, [state.interns, recordStateChange]);

  const deleteIntern = useCallback((internId) => {
    const intern = dataManager.getInternById(state.interns, internId);
    const result = dataManager.deleteIntern(state.interns, internId);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.SET_INTERNS, payload: result.data });
      recordStateChange(`Deleted intern: ${intern?.firstName} ${intern?.lastName} || internId`);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [state.interns, recordStateChange]);

  const getInternById = useCallback((internId) => {
    return dataManager.getInternById(state.interns, internId);
  }, [state.interns]);

  // ============================================================================
  // TASKS OPERATIONS
  // ============================================================================

  const createTask = useCallback((taskData) => {
    const result = dataManager.createTask(state.tasks, taskData);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.ADD_TASK, payload: result.item });
      recordStateChange(`Created task: ${result.item.title}`);
      return { success: true, task: result.item };
    }
    return { success: false, errors: result.errors };
  }, [state.tasks, recordStateChange]);

  const updateTask = useCallback((taskId, updates) => {
    const result = dataManager.updateTask(state.tasks, taskId, updates);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.UPDATE_TASK, payload: result.item });
      recordStateChange(`Updated task: ${result.item.title}`);
      return { success: true, task: result.item };
    }
    return { success: false, error: result.error, errors: result.errors };
  }, [state.tasks, recordStateChange]);

  const deleteTask = useCallback((taskId) => {
    const task = dataManager.getTaskById(state.tasks, taskId);
    const result = dataManager.deleteTask(state.tasks, taskId);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.SET_TASKS, payload: result.data });
      recordStateChange(`Deleted task: ${task?.title || taskId}`);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [state.tasks, recordStateChange]);

  const getTaskById = useCallback((taskId) => {
    return dataManager.getTaskById(state.tasks, taskId);
  }, [state.tasks]);

  // ============================================================================
  // FINANCES OPERATIONS
  // ============================================================================

  const createFinance = useCallback((financeData) => {
    const result = dataManager.createFinance(state.finances, financeData);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.ADD_FINANCE, payload: result.item });
      recordStateChange(`Created finance: ${result.item.description}`);
      return { success: true, finance: result.item };
    }
    return { success: false, errors: result.errors };
  }, [state.finances, recordStateChange]);

  const updateFinance = useCallback((financeId, updates) => {
    const result = dataManager.updateFinance(state.finances, financeId, updates);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.UPDATE_FINANCE, payload: result.item });
      recordStateChange(`Updated finance: ${result.item.description}`);
      return { success: true, finance: result.item };
    }
    return { success: false, error: result.error, errors: result.errors };
  }, [state.finances, recordStateChange]);

  const deleteFinance = useCallback((financeId) => {
    const finance = dataManager.getFinanceById(state.finances, financeId);
    const result = dataManager.deleteFinance(state.finances, financeId);
    if (result.success) {
      dispatch({ type: DATA_ACTIONS.SET_FINANCES, payload: result.data });
      recordStateChange(`Deleted finance: ${finance?.description || financeId}`);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [state.finances, recordStateChange]);

  const getFinanceById = useCallback((financeId) => {
    return dataManager.getFinanceById(state.finances, financeId);
  }, [state.finances]);

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  const resetData = useCallback(() => {
    dispatch({ type: DATA_ACTIONS.RESET_DATA });
    recordStateChange('Reset all data');
  }, [recordStateChange]);

  const loadDemoData = useCallback((demoData) => {
    dispatch({
      type: DATA_ACTIONS.BATCH_UPDATE,
      payload: demoData,
    });
    recordStateChange('Loaded demo data');
  }, [recordStateChange]);

  const searchTeams = useCallback((query) => {
    return dataManager.searchTeams(state.teams, query);
  }, [state.teams]);

  const searchInterns = useCallback((query) => {
    return dataManager.searchInterns(state.interns, query);
  }, [state.interns]);

  const searchTasks = useCallback((query) => {
    return dataManager.searchTasks(state.tasks, query);
  }, [state.tasks]);

  const getInternsByTeam = useCallback((teamId) => {
    return dataManager.getInternsByTeam(state.interns, teamId);
  }, [state.interns]);

  const getTasksByTeam = useCallback((teamId) => {
    return dataManager.getTasksByTeam(state.tasks, teamId);
  }, [state.tasks]);

  const getTasksByIntern = useCallback((internId) => {
    return dataManager.getTasksByIntern(state.tasks, internId);
  }, [state.tasks]);

  const getFinancesByTeam = useCallback((teamId) => {
    return dataManager.getFinancesByTeam(state.finances, teamId);
  }, [state.finances]);

  const getFinancesByIntern = useCallback((internId) => {
    return dataManager.getFinancesByIntern(state.finances, internId);
  }, [state.finances]);

  // Context value
  const value = {
    // State
    teams: state.teams,
    interns: state.interns,
    tasks: state.tasks,
    finances: state.finances,
    initialized: state.initialized,

    // Teams operations
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,

    // Interns operations
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,

    // Tasks operations
    createTask,
    updateTask,
    deleteTask,
    getTaskById,

    // Finances operations
    createFinance,
    updateFinance,
    deleteFinance,
    getFinanceById,

    // Utility operations
    resetData,
    loadDemoData,
    searchTeams,
    searchInterns,
    searchTasks,
    getInternsByTeam,
    getTasksByTeam,
    getTasksByIntern,
    getFinancesByTeam,
    getFinancesByIntern,

    // Direct dispatch for advanced use cases
    dispatch,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use data context
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataContextProvider');
  }
  return context;
};

export default DataContext;
