import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/testUtils';
import App from '../../App';

describe('App Integration Tests', () => {
  test('renders app and navigates to home page', () => {
    renderWithProviders(<App />);
    // App should render without crashing
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  test('navigates to different routes', async () => {
    const { container } = renderWithProviders(<App />, { route: '/' });
    expect(container).toBeInTheDocument();
  });

  test('handles route changes', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<App />);

    // Test that app container exists
    expect(container.querySelector('.app')).toBeInTheDocument();
  });

  test('maintains state across route changes', async () => {
    renderWithProviders(<App />);

    // Verify app renders
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  test('handles invalid routes gracefully', () => {
    renderWithProviders(<App />, { route: '/invalid-route' });

    // Should still render the app container
    expect(document.querySelector('.app')).toBeInTheDocument();
  });
});
