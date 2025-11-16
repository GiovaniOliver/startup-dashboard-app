import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import ConfirmDialog, { useConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test Message',
    onConfirm: jest.fn(),
    onCancel: jest.fn()
  };

  test('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  test('renders with custom button text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
  });

  test('renders different dialog types', () => {
    const { container, rerender } = render(
      <ConfirmDialog {...defaultProps} type="info" />
    );
    expect(container.querySelector('.confirm-dialog-info')).toBeInTheDocument();

    rerender(<ConfirmDialog {...defaultProps} type="success" />);
    expect(container.querySelector('.confirm-dialog-success')).toBeInTheDocument();

    rerender(<ConfirmDialog {...defaultProps} type="warning" />);
    expect(container.querySelector('.confirm-dialog-warning')).toBeInTheDocument();

    rerender(<ConfirmDialog {...defaultProps} type="danger" />);
    expect(container.querySelector('.confirm-dialog-danger')).toBeInTheDocument();
  });

  test('disables buttons when loading', async () => {
    const user = userEvent.setup();

    render(<ConfirmDialog {...defaultProps} loading={true} />);

    const confirmButton = screen.getByRole('button', { name: /loading/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  test('shows loading spinner when loading', () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} loading={true} />
    );

    expect(container.querySelector('.spinner-small')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('closes on Escape key press', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalled();
  });

  test('does not close on Escape when loading', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<ConfirmDialog {...defaultProps} loading={true} onCancel={onCancel} />);

    await user.keyboard('{Escape}');

    expect(onCancel).not.toHaveBeenCalled();
  });

  test('closes when clicking backdrop', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const overlay = screen.getByRole('dialog').parentElement;
    await user.click(overlay);

    expect(onCancel).toHaveBeenCalled();
  });

  test('does not close when clicking dialog content', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);

    expect(onCancel).not.toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(<ConfirmDialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-message');
  });

  test('prevents body scroll when open', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('restores body scroll when closed', () => {
    const { unmount } = render(<ConfirmDialog {...defaultProps} />);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('useConfirmDialog hook', () => {
  test('opens dialog with correct state', () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.openDialog({
        title: 'Delete Item',
        message: 'Are you sure?',
        type: 'danger'
      });
    });

    expect(result.current.dialogState.isOpen).toBe(true);
    expect(result.current.dialogState.title).toBe('Delete Item');
    expect(result.current.dialogState.message).toBe('Are you sure?');
    expect(result.current.dialogState.type).toBe('danger');
  });

  test('returns true when confirmed', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    let promise;
    act(() => {
      promise = result.current.openDialog({
        message: 'Test'
      });
    });

    act(() => {
      result.current.dialogState.onConfirm();
    });

    const confirmed = await promise;
    expect(confirmed).toBe(true);
    expect(result.current.dialogState.isOpen).toBe(false);
  });

  test('returns false when cancelled', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    let promise;
    act(() => {
      promise = result.current.openDialog({
        message: 'Test'
      });
    });

    act(() => {
      result.current.dialogState.onCancel();
    });

    const confirmed = await promise;
    expect(confirmed).toBe(false);
    expect(result.current.dialogState.isOpen).toBe(false);
  });

  test('closes dialog', () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.openDialog({ message: 'Test' });
    });

    expect(result.current.dialogState.isOpen).toBe(true);

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.dialogState.isOpen).toBe(false);
  });

  test('uses default values when not provided', () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.openDialog({
        message: 'Test message'
      });
    });

    expect(result.current.dialogState.title).toBe('Confirm Action');
    expect(result.current.dialogState.confirmText).toBe('Confirm');
    expect(result.current.dialogState.cancelText).toBe('Cancel');
    expect(result.current.dialogState.type).toBe('info');
  });
});
