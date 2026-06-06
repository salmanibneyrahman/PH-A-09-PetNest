let listeners = new Set();

export const toastState = {
    toasts: [],
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    notify() {
        listeners.forEach((listener) => listener([...this.toasts]));
    }
};

function createToast(message, type, duration) {
    if (typeof window === "undefined") return;

    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };

    toastState.toasts = [...toastState.toasts, newToast];
    toastState.notify();
}

export const toast = {
    success: (message, duration = 4000) => createToast(message, "success", duration),
    error: (message, duration = 5000) => createToast(message, "error", duration),
    warning: (message, duration = 4000) => createToast(message, "warning", duration),
    info: (message, duration = 4000) => createToast(message, "info", duration),
};
