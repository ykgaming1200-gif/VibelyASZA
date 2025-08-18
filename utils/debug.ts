// Debug utility for troubleshooting black screen issues
// This file helps identify what's happening during app initialization

export const debugLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] DEBUG: ${message}`, data || '');
};

export const debugError = (message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`, error || '');
};

export const debugWarn = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] WARN: ${message}`, data || '');
};

// Check if we're running in a problematic environment
export const checkEnvironment = () => {
  const env = {
    platform: typeof window !== 'undefined' ? 'web' : 'native',
    hasWindow: typeof window !== 'undefined',
    hasLocalStorage: typeof window !== 'undefined' && !!window.localStorage,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: new Date().toISOString()
  };
  
  debugLog('Environment check', env);
  return env;
};

// Monitor app loading state
export const monitorAppState = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      debugLog('Window loaded event fired');
    });
    
    window.addEventListener('DOMContentLoaded', () => {
      debugLog('DOM content loaded event fired');
    });
    
    window.addEventListener('error', (event) => {
      debugError('Global window error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      debugError('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }
};

// Initialize debugging
if (typeof window !== 'undefined') {
  monitorAppState();
  checkEnvironment();
}