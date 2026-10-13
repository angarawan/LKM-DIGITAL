// Simple custom in-app Toast emitter
type ToastCallback = (message: string, type: 'success' | 'error' | 'info') => void;

let listeners: ToastCallback[] = [];

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  listeners.forEach((fn) => fn(message, type));
};

export const subscribeToast = (fn: ToastCallback) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
};
