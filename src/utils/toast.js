// Global event emitter for toasts
export const toast = {
  success: (message, duration = 15000) => {
    window.dispatchEvent(
      new CustomEvent('add-toast', { detail: { message, type: 'success', duration } })
    );
  },
  error: (message, duration = 15000) => {
    window.dispatchEvent(
      new CustomEvent('add-toast', { detail: { message, type: 'error', duration } })
    );
  },
  info: (message, duration = 15000) => {
    window.dispatchEvent(
      new CustomEvent('add-toast', { detail: { message, type: 'info', duration } })
    );
  },
};
