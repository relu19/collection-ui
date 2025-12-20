import React from 'react';
import ErrorNotification from './index';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showNotification: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Check if it's a session expiration error
    if (error.message && error.message.includes('session has expired')) {
      this.setState({
        error: error,
        errorInfo: errorInfo,
        showNotification: true
      });
      
      // Clear auth data and reload after showing notification
      setTimeout(() => {
        localStorage.removeItem('auth');
        localStorage.removeItem('collector-data');
        window.location.reload();
      }, 3000);
    } else if (error.message && error.message.includes('Authentication required')) {
      this.setState({
        error: error,
        errorInfo: errorInfo,
        showNotification: true
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      // For other errors, show notification but don't auto-reload
      this.setState({
        error: error,
        errorInfo: errorInfo,
        showNotification: true
      });
    }
  }

  handleCloseNotification = () => {
    this.setState({ showNotification: false, hasError: false, error: null });
  };

  render() {
    if (this.state.showNotification && this.state.error) {
      // Safely get error message - handle plain objects and missing message property
      const errorMsg = this.state.error?.message || '';
      const isSessionError = typeof errorMsg === 'string' && 
        (errorMsg.includes('session has expired') || errorMsg.includes('Authentication required'));
      
      // Also check for session expired flag in plain objects
      const isSessionExpiredObject = this.state.error?.sessionExpired === true;
      
      let message;
      if (isSessionError || isSessionExpiredObject) {
        message = 'Your session has expired. Please log in again. Refreshing...';
      } else if (typeof errorMsg === 'string' && errorMsg.length > 0) {
        message = errorMsg;
      } else {
        message = 'An error occurred. Please try again.';
      }

      return (
        <>
          {this.props.children}
          <ErrorNotification
            message={message}
            onClose={this.handleCloseNotification}
            autoClose={true}
            duration={3000}
          />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

