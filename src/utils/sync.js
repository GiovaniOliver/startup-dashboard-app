/**
 * Data Synchronization Utilities
 * Handles data consistency, optimistic updates, and conflict resolution
 */

import { saveToStorage, loadFromStorage, STORAGE_KEYS, createBackup } from './storage';

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

let autoSaveInterval = null;
let autoSaveEnabled = false;
let autoSaveDelay = 30000; // 30 seconds default

/**
 * Enable auto-save functionality
 * @param {number} delay - Delay between saves in milliseconds
 */
export const enableAutoSave = (delay = 30000) => {
  autoSaveEnabled = true;
  autoSaveDelay = delay;
};

/**
 * Disable auto-save functionality
 */
export const disableAutoSave = () => {
  autoSaveEnabled = false;
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};

/**
 * Start auto-save interval
 * @param {Function} saveCallback - Function to call for saving
 */
export const startAutoSave = (saveCallback) => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  if (autoSaveEnabled) {
    autoSaveInterval = setInterval(() => {
      try {
        saveCallback();
        console.log('Auto-save completed at', new Date().toISOString());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, autoSaveDelay);
  }
};

/**
 * Stop auto-save interval
 */
export const stopAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};

// ============================================================================
// OPTIMISTIC UPDATES
// ============================================================================

const pendingUpdates = new Map();

/**
 * Add an optimistic update
 * @param {string} id - Update ID
 * @param {Object} update - Update data
 */
export const addOptimisticUpdate = (id, update) => {
  pendingUpdates.set(id, {
    ...update,
    timestamp: Date.now(),
  });
};

/**
 * Confirm an optimistic update
 * @param {string} id - Update ID
 */
export const confirmOptimisticUpdate = (id) => {
  pendingUpdates.delete(id);
};

/**
 * Rollback an optimistic update
 * @param {string} id - Update ID
 * @returns {Object|null} - The rolled back update or null
 */
export const rollbackOptimisticUpdate = (id) => {
  const update = pendingUpdates.get(id);
  pendingUpdates.delete(id);
  return update || null;
};

/**
 * Get all pending updates
 * @returns {Array} - Array of pending updates
 */
export const getPendingUpdates = () => {
  return Array.from(pendingUpdates.entries()).map(([id, update]) => ({
    id,
    ...update,
  }));
};

/**
 * Clear all pending updates
 */
export const clearPendingUpdates = () => {
  pendingUpdates.clear();
};

// ============================================================================
// CONFLICT RESOLUTION
// ============================================================================

/**
 * Detect conflicts between local and remote data
 * @param {Object} localData - Local version of data
 * @param {Object} remoteData - Remote version of data
 * @returns {Object} - Conflict information
 */
export const detectConflicts = (localData, remoteData) => {
  const conflicts = [];

  // Compare timestamps
  const localTime = new Date(localData.updatedAt || localData.createdAt).getTime();
  const remoteTime = new Date(remoteData.updatedAt || remoteData.createdAt).getTime();

  if (localTime !== remoteTime) {
    // Find specific field conflicts
    Object.keys(localData).forEach(key => {
      if (key !== 'updatedAt' && key !== 'createdAt' && localData[key] !== remoteData[key]) {
        conflicts.push({
          field: key,
          localValue: localData[key],
          remoteValue: remoteData[key],
          localTime,
          remoteTime,
        });
      }
    });
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    localTime,
    remoteTime,
  };
};

/**
 * Resolve conflicts using a strategy
 * @param {Object} localData - Local version of data
 * @param {Object} remoteData - Remote version of data
 * @param {string} strategy - Resolution strategy ('local', 'remote', 'latest', 'merge')
 * @returns {Object} - Resolved data
 */
export const resolveConflicts = (localData, remoteData, strategy = 'latest') => {
  const conflictInfo = detectConflicts(localData, remoteData);

  switch (strategy) {
    case 'local':
      // Keep local changes
      return localData;

    case 'remote':
      // Use remote changes
      return remoteData;

    case 'latest':
      // Use the most recent version
      return conflictInfo.localTime > conflictInfo.remoteTime ? localData : remoteData;

    case 'merge':
      // Merge both versions, preferring latest for conflicts
      const merged = { ...remoteData };
      conflictInfo.conflicts.forEach(conflict => {
        if (conflictInfo.localTime > conflictInfo.remoteTime) {
          merged[conflict.field] = conflict.localValue;
        }
      });
      return merged;

    default:
      return localData;
  }
};

// ============================================================================
// DATA CONSISTENCY CHECKS
// ============================================================================

/**
 * Validate data integrity across all data types
 * @param {Object} data - All application data
 * @returns {Object} - Validation result
 */
export const validateDataIntegrity = (data) => {
  const issues = [];

  // Check for orphaned interns (interns with non-existent teams)
  if (data.interns && data.teams) {
    const teamIds = new Set(data.teams.map(t => t.id));
    data.interns.forEach(intern => {
      if (!teamIds.has(intern.teamId)) {
        issues.push({
          type: 'orphaned_intern',
          internId: intern.id,
          internName: `${intern.firstName} ${intern.lastName}`,
          teamId: intern.teamId,
        });
      }
    });
  }

  // Check for orphaned tasks (tasks with non-existent teams or interns)
  if (data.tasks && data.teams) {
    const teamIds = new Set(data.teams.map(t => t.id));
    const internIds = new Set((data.interns || []).map(i => i.id));

    data.tasks.forEach(task => {
      if (!teamIds.has(task.teamId)) {
        issues.push({
          type: 'orphaned_task_team',
          taskId: task.id,
          taskTitle: task.title,
          teamId: task.teamId,
        });
      }
      if (task.assignedTo && !internIds.has(task.assignedTo)) {
        issues.push({
          type: 'orphaned_task_intern',
          taskId: task.id,
          taskTitle: task.title,
          internId: task.assignedTo,
        });
      }
    });
  }

  // Check for duplicate IDs
  ['teams', 'interns', 'tasks', 'finances'].forEach(type => {
    if (data[type]) {
      const ids = data[type].map(item => item.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        issues.push({
          type: 'duplicate_ids',
          dataType: type,
          duplicateIds: [...new Set(duplicates)],
        });
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Fix data integrity issues
 * @param {Object} data - All application data
 * @returns {Object} - Fixed data
 */
export const fixDataIntegrity = (data) => {
  const fixedData = { ...data };
  const validation = validateDataIntegrity(data);

  if (validation.isValid) {
    return fixedData;
  }

  // Remove orphaned interns
  const orphanedInternIssues = validation.issues.filter(i => i.type === 'orphaned_intern');
  if (orphanedInternIssues.length > 0 && fixedData.interns) {
    const orphanedInternIds = new Set(orphanedInternIssues.map(i => i.internId));
    fixedData.interns = fixedData.interns.filter(intern => !orphanedInternIds.has(intern.id));
  }

  // Fix orphaned tasks
  const orphanedTaskTeamIssues = validation.issues.filter(i => i.type === 'orphaned_task_team');
  const orphanedTaskInternIssues = validation.issues.filter(i => i.type === 'orphaned_task_intern');

  if ((orphanedTaskTeamIssues.length > 0 || orphanedTaskInternIssues.length > 0) && fixedData.tasks) {
    const orphanedTaskTeamIds = new Set(orphanedTaskTeamIssues.map(i => i.taskId));
    const orphanedTaskInternIds = new Set(orphanedTaskInternIssues.map(i => i.taskId));

    // Remove tasks with invalid teams
    fixedData.tasks = fixedData.tasks.filter(task => !orphanedTaskTeamIds.has(task.id));

    // Clear invalid assignees
    fixedData.tasks = fixedData.tasks.map(task => {
      if (orphanedTaskInternIds.has(task.id)) {
        return { ...task, assignedTo: null, assignedToName: 'Unassigned' };
      }
      return task;
    });
  }

  // Fix duplicate IDs by regenerating them
  const duplicateIdIssues = validation.issues.filter(i => i.type === 'duplicate_ids');
  duplicateIdIssues.forEach(issue => {
    const seenIds = new Set();
    fixedData[issue.dataType] = fixedData[issue.dataType].map(item => {
      if (seenIds.has(item.id)) {
        // Regenerate ID
        return { ...item, id: `${item.id}_${Date.now()}_${Math.random()}` };
      }
      seenIds.add(item.id);
      return item;
    });
  });

  return fixedData;
};

// ============================================================================
// SYNCHRONIZATION
// ============================================================================

/**
 * Sync data to localStorage
 * @param {Object} data - Data to sync
 * @returns {boolean} - Success status
 */
export const syncToStorage = (data) => {
  try {
    // Create backup before syncing
    createBackup();

    // Validate data integrity
    const validation = validateDataIntegrity(data);
    if (!validation.isValid) {
      console.warn('Data integrity issues detected:', validation.issues);
      data = fixDataIntegrity(data);
    }

    // Save each data type
    if (data.teams) saveToStorage(STORAGE_KEYS.TEAMS, data.teams);
    if (data.interns) saveToStorage(STORAGE_KEYS.INTERNS, data.interns);
    if (data.tasks) saveToStorage(STORAGE_KEYS.TASKS, data.tasks);
    if (data.finances) saveToStorage(STORAGE_KEYS.FINANCES, data.finances);
    if (data.appState) saveToStorage(STORAGE_KEYS.APP_STATE, data.appState);

    return true;
  } catch (error) {
    console.error('Error syncing to storage:', error);
    return false;
  }
};

/**
 * Sync data from localStorage
 * @returns {Object} - Synced data
 */
export const syncFromStorage = () => {
  try {
    const data = {
      teams: loadFromStorage(STORAGE_KEYS.TEAMS, []),
      interns: loadFromStorage(STORAGE_KEYS.INTERNS, []),
      tasks: loadFromStorage(STORAGE_KEYS.TASKS, []),
      finances: loadFromStorage(STORAGE_KEYS.FINANCES, []),
      appState: loadFromStorage(STORAGE_KEYS.APP_STATE, {}),
    };

    // Validate and fix data integrity
    const validation = validateDataIntegrity(data);
    if (!validation.isValid) {
      console.warn('Data integrity issues detected during sync:', validation.issues);
      return fixDataIntegrity(data);
    }

    return data;
  } catch (error) {
    console.error('Error syncing from storage:', error);
    return {
      teams: [],
      interns: [],
      tasks: [],
      finances: [],
      appState: {},
    };
  }
};

/**
 * Debounce function for auto-save
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a debounced save function
 * @param {Function} saveCallback - Function to call for saving
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} - Debounced save function
 */
export const createDebouncedSave = (saveCallback, delay = 1000) => {
  return debounce(saveCallback, delay);
};

export default {
  // Auto-save
  enableAutoSave,
  disableAutoSave,
  startAutoSave,
  stopAutoSave,
  // Optimistic updates
  addOptimisticUpdate,
  confirmOptimisticUpdate,
  rollbackOptimisticUpdate,
  getPendingUpdates,
  clearPendingUpdates,
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
};
