import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import Toast, { ToastContainer, useToast } from '../Toast/Toast';

describe('Toast', () => {
  jest.useFakeTimers();

  test('renders toast with message', () => {
    render(
      <Toast
        id={1}
        message="Test message"
        type="info"
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('renders different toast types', () => {
    const { container, rerender } = render(
      <Toast id={1} message="Success" type="success" onClose={() => {}} />
    );
    expect(container.querySelector('.toast-success')).toBeInTheDocument();

    rerender(
      <Toast id={2} message="Error" type="error" onClose={() => {}} />
    );
    expect(container.querySelector('.toast-error')).toBeInTheDocument();

    rerender(
      <Toast id={3} message="Warning" type="warning" onClose={() => {}} />
    );
    expect(container.querySelector('.toast-warning')).toBeInTheDocument();

    rerender(
      <Toast id={4} message="Info" type="info" onClose={() => {}} />
    );
    expect(container.querySelector('.toast-info')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = jest.fn();

    render(
      <Toast id={1} message="Test" onClose={onClose} />
    );

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(1);
    });
  });

  test('auto-closes after duration', async () => {
    const onClose = jest.fn();

    render(
      <Toast id={1} message="Test" duration={3000} onClose={onClose} />
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(1);
    }, { timeout: 1000 });
  });

  test('does not auto-close when duration is 0', () => {
    const onClose = jest.fn();

    render(
      <Toast id={1} message="Test" duration={0} onClose={onClose} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(
      <Toast id={1} message="Test" onClose={() => {}} />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});

describe('ToastContainer', () => {
  test('renders multiple toasts', () => {
    const toasts = [
      { id: 1, message: 'Toast 1', type: 'info' },
      { id: 2, message: 'Toast 2', type: 'success' },
      { id: 3, message: 'Toast 3', type: 'error' }
    ];

    render(
      <ToastContainer toasts={toasts} removeToast={() => {}} />
    );

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  test('renders with different positions', () => {
    const toasts = [{ id: 1, message: 'Test', type: 'info' }];
    const { container, rerender } = render(
      <ToastContainer toasts={toasts} position="top-right" removeToast={() => {}} />
    );

    expect(container.querySelector('.toast-top-right')).toBeInTheDocument();

    rerender(
      <ToastContainer toasts={toasts} position="bottom-left" removeToast={() => {}} />
    );
    expect(container.querySelector('.toast-bottom-left')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    const toasts = [{ id: 1, message: 'Test', type: 'info' }];
    const { container } = render(
      <ToastContainer toasts={toasts} removeToast={() => {}} />
    );

    const container_element = container.querySelector('.toast-container');
    expect(container_element).toHaveAttribute('aria-live', 'polite');
  });
});

describe('useToast hook', () => {
  test('adds toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast.info('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('info');
  });

  test('adds different toast types', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast.success('Success');
      result.current.toast.error('Error');
      result.current.toast.warning('Warning');
      result.current.toast.info('Info');
    });

    expect(result.current.toasts).toHaveLength(4);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[1].type).toBe('error');
    expect(result.current.toasts[2].type).toBe('warning');
    expect(result.current.toasts[3].type).toBe('info');
  });

  test('removes toast by id', () => {
    const { result } = renderHook(() => useToast());

    let toastId;
    act(() => {
      toastId = result.current.toast.info('Test');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test('clears all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast.info('Toast 1');
      result.current.toast.info('Toast 2');
      result.current.toast.info('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.toast.clear();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test('returns unique toast IDs', () => {
    const { result } = renderHook(() => useToast());

    let id1, id2;
    act(() => {
      id1 = result.current.toast.info('Toast 1');
      id2 = result.current.toast.info('Toast 2');
    });

    expect(id1).not.toBe(id2);
  });
});
