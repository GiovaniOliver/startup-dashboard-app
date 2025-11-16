/**
 * App Context - Global application state management
 * Manages UI state, notifications, user preferences, etc.
 */

import React, { createContext, useReducer, useContext, useEffect, useMemo } from 'react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

// Initial state
const INITIAL_STATE = {
  // UI State
  sidebarCollapsed: false,
  activeView: 'dashboard',
  theme: 'light',

  // Notifications
  notifications: [],

  // User preferences
  preferences: {
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    notifications: true,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
  },

  // App status
  loading: false,
  error: null,
  lastSync: null,

  // Modal/Dialog state
  activeModal: null,
  modalData: null,

  // Search/Filter state
  globalSearch: '',
  filters: {},
};

// Action types
export const APP_ACTIONS = {
  // UI Actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_THEME: 'SET_THEME',

  // Notification Actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

  // Preference Actions
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',

  // Status Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_SYNC_TIME: 'UPDATE_SYNC_TIME',

  // Modal Actions
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',

  // Search/Filter Actions
  SET_GLOBAL_SEARCH: 'SET_GLOBAL_SEARCH',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',

  // Reset
  RESET_APP_STATE: 'RESET_APP_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };

    case APP_ACTIONS.SET_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload,
      };

    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload,
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case APP_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case APP_ACTIONS.UPDATE_SYNC_TIME:
      return {
        ...state,
        lastSync: new Date().toISOString(),
      };

    case APP_ACTIONS.OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload.modal,
        modalData: action.payload.data || null,
      };

    case APP_ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        activeModal: null,
        modalData: null,
      };

    case APP_ACTIONS.SET_GLOBAL_SEARCH:
      return {
        ...state,
        globalSearch: action.payload,
      };

    case APP_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case APP_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: {},
        globalSearch: '',
      };

    case APP_ACTIONS.RESET_APP_STATE:
      return INITIAL_STATE;

    default:
      return state;
  }
};

// Create context
export const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
  // Load initial state from storage
  const loadedState = loadFromStorage(STORAGE_KEYS.APP_STATE, INITIAL_STATE);
  const [state, dispatch] = useReducer(appReducer, loadedState);

  // Save to storage when state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APP_STATE, state);
  }, [state]);

  // Helper functions
  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
  };

  const setActiveView = (view) => {
    dispatch({ type: APP_ACTIONS.SET_ACTIVE_VIEW, payload: view });
  };

  const setTheme = (theme) => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
  };

  const addNotification = (notification) => {
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification });

    // Auto-remove after 5 seconds if type is success or info
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(notification.id || Date.now());
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: APP_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
  };

  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });

    // Also add as notification
    if (error) {
      addNotification({
        type: 'error',
        message: error,
      });
    }
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  const updateSyncTime = () => {
    dispatch({ type: APP_ACTIONS.UPDATE_SYNC_TIME });
  };

  const openModal = (modal, data = null) => {
    dispatch({ type: APP_ACTIONS.OPEN_MODAL, payload: { modal, data } });
  };

  const closeModal = () => {
    dispatch({ type: APP_ACTIONS.CLOSE_MODAL });
  };

  const setGlobalSearch = (query) => {
    dispatch({ type: APP_ACTIONS.SET_GLOBAL_SEARCH, payload: query });
  };

  const setFilters = (filters) => {
    dispatch({ type: APP_ACTIONS.SET_FILTERS, payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_FILTERS });
  };

  const resetAppState = () => {
    dispatch({ type: APP_ACTIONS.RESET_APP_STATE });
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    state,
    dispatch,
    // Helper functions
    toggleSidebar,
    setActiveView,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    updatePreferences,
    setLoading,
    setError,
    clearError,
    updateSyncTime,
    openModal,
    closeModal,
    setGlobalSearch,
    setFilters,
    clearFilters,
    resetAppState,
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

export default AppContext;
