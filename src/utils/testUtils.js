import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeContextProvider } from '../Context/darkModeContext';

/**
 * Custom render function that wraps components with necessary providers
 * @param {React.Component} ui - Component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - Render result
 */
export const renderWithProviders = (ui, options = {}) => {
  const { route = '/', ...renderOptions } = options;

  window.history.pushState({}, 'Test page', route);

  const AllTheProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <DarkModeContextProvider>
          {children}
        </DarkModeContextProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

/**
 * Custom render for components without router
 */
export const renderWithContext = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
      <DarkModeContextProvider>
        {children}
      </DarkModeContextProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Wait for async updates
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

/**
 * Setup localStorage mock
 */
export const setupLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
};

/**
 * Create mock fetch response
 */
export const createMockFetchResponse = (data, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
};

/**
 * Mock console methods for testing
 */
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.log = originalConsole.log;
  });
};

/**
 * Fire custom event
 */
export const fireCustomEvent = (element, eventType, detail = {}) => {
  const event = new CustomEvent(eventType, { detail, bubbles: true });
  element.dispatchEvent(event);
};

/**
 * Create mock IntersectionObserver
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  };
};

/**
 * Create mock ResizeObserver
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
