// Global notification service
class NotificationService {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  error(message, options = {}) {
    this.notify({
      type: 'error',
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 5000,
      ...options
    });
  }

  success(message, options = {}) {
    this.notify({
      type: 'success',
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 3000,
      ...options
    });
  }

  warning(message, options = {}) {
    this.notify({
      type: 'warning',
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 4000,
      ...options
    });
  }

  info(message, options = {}) {
    this.notify({
      type: 'info',
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 3000,
      ...options
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;

