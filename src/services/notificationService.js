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
    // Ensure message is always a string
    let displayMessage = message;
    if (typeof message === 'object' && message !== null) {
      // Handle error objects - extract message or provide fallback
      displayMessage = message.message || message.error || 'An error occurred. Please try again.';
    } else if (typeof message !== 'string') {
      displayMessage = 'An error occurred. Please try again.';
    }
    
    this.notify({
      type: 'error',
      message: displayMessage,
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

