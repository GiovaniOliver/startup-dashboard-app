/**
 * History Manager - Undo/Redo Functionality
 * Tracks state changes and provides undo/redo operations
 */

const MAX_HISTORY_SIZE = 50; // Maximum number of history entries to keep

class HistoryManager {
  constructor(maxSize = MAX_HISTORY_SIZE) {
    this.past = [];
    this.present = null;
    this.future = [];
    this.maxSize = maxSize;
  }

  /**
   * Initialize history with current state
   * @param {*} initialState - Initial state
   */
  initialize(initialState) {
    this.present = this.deepClone(initialState);
    this.past = [];
    this.future = [];
  }

  /**
   * Deep clone an object
   * @param {*} obj - Object to clone
   * @returns {*} - Cloned object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Push a new state to history
   * @param {*} newState - New state to push
   * @param {string} description - Description of the change
   */
  push(newState, description = '') {
    if (this.present !== null) {
      // Add current state to past
      this.past.push({
        state: this.deepClone(this.present),
        description,
        timestamp: new Date().toISOString(),
      });

      // Limit history size
      if (this.past.length > this.maxSize) {
        this.past.shift();
      }
    }

    // Set new state as present
    this.present = this.deepClone(newState);

    // Clear future (can't redo after new change)
    this.future = [];
  }

  /**
   * Undo last change
   * @returns {Object|null} - Previous state or null if no history
   */
  undo() {
    if (this.past.length === 0) {
      return null;
    }

    // Move current state to future
    this.future.push({
      state: this.deepClone(this.present),
      timestamp: new Date().toISOString(),
    });

    // Get previous state from past
    const previous = this.past.pop();
    this.present = this.deepClone(previous.state);

    return {
      state: this.present,
      description: previous.description,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  /**
   * Redo last undone change
   * @returns {Object|null} - Next state or null if no future
   */
  redo() {
    if (this.future.length === 0) {
      return null;
    }

    // Move current state to past
    this.past.push({
      state: this.deepClone(this.present),
      timestamp: new Date().toISOString(),
    });

    // Get next state from future
    const next = this.future.pop();
    this.present = this.deepClone(next.state);

    return {
      state: this.present,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.past.length > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.future.length > 0;
  }

  /**
   * Get current state
   * @returns {*} - Current state
   */
  getCurrentState() {
    return this.deepClone(this.present);
  }

  /**
   * Get history information
   * @returns {Object} - History info
   */
  getHistoryInfo() {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      maxSize: this.maxSize,
    };
  }

  /**
   * Get full history (past entries with descriptions)
   * @returns {Array} - Array of history entries
   */
  getHistory() {
    return this.past.map((entry, index) => ({
      index,
      description: entry.description,
      timestamp: entry.timestamp,
    }));
  }

  /**
   * Jump to a specific point in history
   * @param {number} index - Index in past history
   * @returns {Object|null} - State at that point or null if invalid
   */
  jumpToHistory(index) {
    if (index < 0 || index >= this.past.length) {
      return null;
    }

    // Move states to future
    while (this.past.length > index + 1) {
      const entry = this.past.pop();
      this.future.push({
        state: entry.state,
        timestamp: entry.timestamp,
      });
    }

    // Undo to the target state
    return this.undo();
  }

  /**
   * Clear all history
   */
  clear() {
    this.past = [];
    this.future = [];
  }

  /**
   * Reset history with new state
   * @param {*} newState - New state to reset to
   */
  reset(newState) {
    this.past = [];
    this.future = [];
    this.present = this.deepClone(newState);
  }
}

// Create singleton instance for data history
const dataHistory = new HistoryManager();

/**
 * Initialize data history
 * @param {Object} initialState - Initial state
 */
export const initializeHistory = (initialState) => {
  dataHistory.initialize(initialState);
};

/**
 * Record a state change
 * @param {Object} newState - New state
 * @param {string} description - Description of change
 */
export const recordChange = (newState, description) => {
  dataHistory.push(newState, description);
};

/**
 * Undo last change
 * @returns {Object|null} - Result of undo operation
 */
export const undo = () => {
  return dataHistory.undo();
};

/**
 * Redo last undone change
 * @returns {Object|null} - Result of redo operation
 */
export const redo = () => {
  return dataHistory.redo();
};

/**
 * Check if undo is available
 * @returns {boolean}
 */
export const canUndo = () => {
  return dataHistory.canUndo();
};

/**
 * Check if redo is available
 * @returns {boolean}
 */
export const canRedo = () => {
  return dataHistory.canRedo();
};

/**
 * Get current state from history
 * @returns {Object}
 */
export const getCurrentState = () => {
  return dataHistory.getCurrentState();
};

/**
 * Get history information
 * @returns {Object}
 */
export const getHistoryInfo = () => {
  return dataHistory.getHistoryInfo();
};

/**
 * Get full history list
 * @returns {Array}
 */
export const getHistoryList = () => {
  return dataHistory.getHistory();
};

/**
 * Jump to specific history point
 * @param {number} index - History index
 * @returns {Object|null}
 */
export const jumpToHistory = (index) => {
  return dataHistory.jumpToHistory(index);
};

/**
 * Clear history
 */
export const clearHistory = () => {
  dataHistory.clear();
};

/**
 * Reset history with new state
 * @param {Object} newState - New state
 */
export const resetHistory = (newState) => {
  dataHistory.reset(newState);
};

/**
 * Create a history-aware state updater
 * @param {Function} setState - State setter function
 * @param {Function} getState - State getter function
 * @returns {Function} - History-aware updater function
 */
export const createHistoryUpdater = (setState, getState) => {
  return (updater, description = '') => {
    const currentState = getState();
    const newState = typeof updater === 'function' ? updater(currentState) : updater;

    // Record the change
    recordChange(newState, description);

    // Update state
    setState(newState);
  };
};

/**
 * Batch multiple changes into single history entry
 */
export class HistoryBatch {
  constructor(description = 'Batch operation') {
    this.description = description;
    this.changes = [];
  }

  /**
   * Add a change to the batch
   * @param {Function} change - Change function
   */
  add(change) {
    this.changes.push(change);
  }

  /**
   * Execute all changes in batch
   * @param {Object} currentState - Current state
   * @returns {Object} - New state after all changes
   */
  execute(currentState) {
    let state = currentState;
    this.changes.forEach(change => {
      state = change(state);
    });
    return state;
  }

  /**
   * Apply batch and record in history
   * @param {Object} currentState - Current state
   * @returns {Object} - New state
   */
  apply(currentState) {
    const newState = this.execute(currentState);
    recordChange(newState, this.description);
    return newState;
  }
}

/**
 * Create a new batch
 * @param {string} description - Batch description
 * @returns {HistoryBatch} - New batch instance
 */
export const createBatch = (description) => {
  return new HistoryBatch(description);
};

export { HistoryManager };

export default {
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
  createHistoryUpdater,
  createBatch,
  HistoryManager,
};
