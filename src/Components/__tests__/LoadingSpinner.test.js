import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, {
  SkeletonLoader,
  SkeletonCard,
  SkeletonTable,
  ProgressBar
} from '../LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders spinner with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders spinner with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('renders small spinner', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    expect(container.querySelector('.spinner-small')).toBeInTheDocument();
  });

  test('renders medium spinner', () => {
    const { container } = render(<LoadingSpinner size="medium" />);
    expect(container.querySelector('.spinner-medium')).toBeInTheDocument();
  });

  test('renders large spinner', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    expect(container.querySelector('.spinner-large')).toBeInTheDocument();
  });

  test('renders with different colors', () => {
    const { container, rerender } = render(<LoadingSpinner color="primary" />);
    expect(container.querySelector('.spinner-primary')).toBeInTheDocument();

    rerender(<LoadingSpinner color="success" />);
    expect(container.querySelector('.spinner-success')).toBeInTheDocument();

    rerender(<LoadingSpinner color="danger" />);
    expect(container.querySelector('.spinner-danger')).toBeInTheDocument();
  });

  test('renders fullscreen spinner', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    expect(container.querySelector('.loading-fullscreen')).toBeInTheDocument();
  });

  test('renders with overlay', () => {
    const { container } = render(<LoadingSpinner overlay />);
    expect(container.querySelector('.loading-overlay')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});

describe('SkeletonLoader', () => {
  test('renders single skeleton', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.querySelectorAll('.skeleton').length).toBe(1);
  });

  test('renders multiple skeletons', () => {
    const { container } = render(<SkeletonLoader count={3} />);
    expect(container.querySelectorAll('.skeleton').length).toBe(3);
  });

  test('renders different skeleton types', () => {
    const { container, rerender } = render(<SkeletonLoader type="text" />);
    expect(container.querySelector('.skeleton-text')).toBeInTheDocument();

    rerender(<SkeletonLoader type="title" />);
    expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
  });

  test('applies custom width and height', () => {
    const { container } = render(
      <SkeletonLoader width="200px" height="50px" />
    );
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
  });

  test('has aria-hidden attribute', () => {
    const { container } = render(<SkeletonLoader />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('SkeletonCard', () => {
  test('renders skeleton card structure', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.skeleton-card')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-avatar')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-content')).toBeInTheDocument();
  });

  test('has aria-hidden attribute', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('SkeletonTable', () => {
  test('renders skeleton table with default rows and columns', () => {
    const { container } = render(<SkeletonTable />);
    expect(container.querySelector('.skeleton-table')).toBeInTheDocument();
    expect(container.querySelectorAll('.skeleton-table-row').length).toBe(5);
  });

  test('renders custom number of rows and columns', () => {
    const { container } = render(<SkeletonTable rows={3} columns={2} />);
    expect(container.querySelectorAll('.skeleton-table-row').length).toBe(3);
  });

  test('has aria-hidden attribute', () => {
    const { container } = render(<SkeletonTable />);
    const table = container.querySelector('.skeleton-table');
    expect(table).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('ProgressBar', () => {
  test('renders progress bar', () => {
    const { container } = render(<ProgressBar progress={50} />);
    expect(container.querySelector('.progress-bar')).toBeInTheDocument();
  });

  test('shows percentage when enabled', () => {
    render(<ProgressBar progress={75} showPercentage />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('hides percentage when disabled', () => {
    const { container } = render(
      <ProgressBar progress={75} showPercentage={false} />
    );
    expect(container.querySelector('.progress-percentage')).not.toBeInTheDocument();
  });

  test('clamps progress value between 0 and 100', () => {
    const { container, rerender } = render(<ProgressBar progress={-10} />);
    let bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '0%' });

    rerender(<ProgressBar progress={150} />);
    bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '100%' });
  });

  test('applies custom color', () => {
    const { container } = render(<ProgressBar progress={50} color="success" />);
    expect(container.querySelector('.progress-success')).toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    const { container } = render(<ProgressBar progress={60} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });
});
