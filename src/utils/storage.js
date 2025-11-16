/**
 * Storage utility for managing localStorage operations
 * Handles save/load/export/import of all application data
 */

const STORAGE_KEYS = {
  TEAMS: 'startup_dashboard_teams',
  INTERNS: 'startup_dashboard_interns',
  TASKS: 'startup_dashboard_tasks',
  FINANCES: 'startup_dashboard_finances',
  APP_STATE: 'startup_dashboard_app_state',
  VERSION: 'startup_dashboard_version',
  BACKUP: 'startup_dashboard_backup',
  LAST_SAVE: 'startup_dashboard_last_save',
};

const CURRENT_VERSION = '1.0.0';

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 * @returns {boolean} - Success status
 */
export const saveToStorage = (key, data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Loaded data or default value
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all application data from localStorage
 * @returns {boolean} - Success status
 */
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Export all application data as JSON
 * @returns {Object} - All application data
 */
export const exportData = () => {
  try {
    const exportData = {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      data: {
        teams: loadFromStorage(STORAGE_KEYS.TEAMS, []),
        interns: loadFromStorage(STORAGE_KEYS.INTERNS, []),
        tasks: loadFromStorage(STORAGE_KEYS.TASKS, []),
        finances: loadFromStorage(STORAGE_KEYS.FINANCES, []),
        appState: loadFromStorage(STORAGE_KEYS.APP_STATE, {}),
      },
    };
    return exportData;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

/**
 * Import application data from JSON
 * @param {Object} importData - Data to import
 * @returns {boolean} - Success status
 */
export const importData = (importData) => {
  try {
    if (!importData || !importData.data) {
      throw new Error('Invalid import data format');
    }

    const { data } = importData;

    // Save each data type
    if (data.teams) saveToStorage(STORAGE_KEYS.TEAMS, data.teams);
    if (data.interns) saveToStorage(STORAGE_KEYS.INTERNS, data.interns);
    if (data.tasks) saveToStorage(STORAGE_KEYS.TASKS, data.tasks);
    if (data.finances) saveToStorage(STORAGE_KEYS.FINANCES, data.finances);
    if (data.appState) saveToStorage(STORAGE_KEYS.APP_STATE, data.appState);

    saveToStorage(STORAGE_KEYS.VERSION, importData.version || CURRENT_VERSION);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Download data as JSON file
 * @param {string} filename - Name of the file to download
 */
export const downloadDataAsJson = (filename = 'startup-dashboard-backup.json') => {
  try {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading data:', error);
    return false;
  }
};

/**
 * Create a backup of current data
 * @returns {boolean} - Success status
 */
export const createBackup = () => {
  try {
    const backupData = exportData();
    saveToStorage(STORAGE_KEYS.BACKUP, backupData);
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

/**
 * Restore data from backup
 * @returns {boolean} - Success status
 */
export const restoreFromBackup = () => {
  try {
    const backupData = loadFromStorage(STORAGE_KEYS.BACKUP);
    if (!backupData) {
      throw new Error('No backup found');
    }
    return importData(backupData);
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
};

/**
 * Get storage info
 * @returns {Object} - Storage information
 */
export const getStorageInfo = () => {
  try {
    const lastSave = loadFromStorage(STORAGE_KEYS.LAST_SAVE);
    const version = loadFromStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);

    return {
      lastSave: lastSave ? new Date(lastSave) : null,
      version,
      currentVersion: CURRENT_VERSION,
      hasBackup: loadFromStorage(STORAGE_KEYS.BACKUP) !== null,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

/**
 * Migrate data from old version to new version
 * @param {string} fromVersion - Version to migrate from
 * @returns {boolean} - Success status
 */
export const migrateData = (fromVersion) => {
  try {
    // Add migration logic here when versions change
    console.log(`Migrating data from version ${fromVersion} to ${CURRENT_VERSION}`);

    // Example migration logic:
    // if (fromVersion === '0.9.0') {
    //   // Migrate specific changes
    // }

    saveToStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Error migrating data:', error);
    return false;
  }
};

export { STORAGE_KEYS, CURRENT_VERSION };
