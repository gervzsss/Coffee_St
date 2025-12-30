import { useEffect, useRef, useCallback } from 'react';

const ACTIVITY_STORAGE_KEY = 'last_activity_time';
const ACTIVITY_CHECK_INTERVAL = 10000; // Check every 10 seconds
const ACTIVITY_THROTTLE = 2000; // Update activity timestamp max once per 2 seconds
const PING_INTERVAL = 5 * 60 * 1000; // Ping server every 5 minutes while active

/**
 * Throttle function to limit how often a function can be called
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Hook to automatically log out users after a period of inactivity
 * Supports multi-tab coordination via BroadcastChannel or localStorage
 * 
 * @param {Object} options
 * @param {number} options.timeoutMinutes - Number of minutes of inactivity before logout
 * @param {Function} options.onLogout - Callback function to execute when timeout occurs
 * @param {boolean} options.enabled - Whether the idle timer is active
 * @param {Function} options.onPing - Optional callback to ping the server while active
 */
export function useIdleLogout({ timeoutMinutes, onLogout, enabled = true, onPing = null }) {
  const lastActivityRef = useRef(Date.now());
  const checkIntervalRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastPingRef = useRef(Date.now());
  const broadcastChannelRef = useRef(null);

  const updateActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Update localStorage for cross-tab sync
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
    } catch (e) {
      console.warn('Failed to update activity in localStorage:', e);
    }

    // Broadcast to other tabs
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'activity', timestamp: now });
      } catch (e) {
        console.warn('Failed to broadcast activity:', e);
      }
    }

    // Ping server if enough time has passed
    if (onPing && (now - lastPingRef.current) >= PING_INTERVAL) {
      lastPingRef.current = now;
      onPing().catch(err => {
        console.warn('Session ping failed:', err);
      });
    }
  }, [onPing]);

  const throttledUpdateActivity = useRef(throttle(updateActivity, ACTIVITY_THROTTLE)).current;

  const checkIdleTimeout = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    const timeoutMs = timeoutMinutes * 60 * 1000;

    // Check localStorage for activity from other tabs
    try {
      const storedActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (storedActivity) {
        const storedTime = parseInt(storedActivity, 10);
        if (storedTime > lastActivityRef.current) {
          lastActivityRef.current = storedTime;
        }
      }
    } catch (e) {
      console.warn('Failed to read activity from localStorage:', e);
    }

    const idleTime = now - lastActivityRef.current;

    if (idleTime >= timeoutMs) {
      console.log('Idle timeout reached, logging out...');
      cleanup();
      onLogout();
    }
  }, [enabled, timeoutMinutes, onLogout]);

  const cleanup = useCallback(() => {
    // Remove event listeners
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.removeEventListener(event, throttledUpdateActivity);
    });

    // Clear intervals
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    // Close broadcast channel
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }

    // Clean up localStorage
    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clean up activity storage:', e);
    }
  }, [throttledUpdateActivity]);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    // Initialize activity timestamp
    updateActivity();

    // Set up BroadcastChannel for cross-tab communication (with fallback)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        broadcastChannelRef.current = new BroadcastChannel('auth_activity');
        broadcastChannelRef.current.onmessage = (event) => {
          if (event.data?.type === 'activity' && event.data?.timestamp) {
            const timestamp = event.data.timestamp;
            if (timestamp > lastActivityRef.current) {
              lastActivityRef.current = timestamp;
            }
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not available, using localStorage fallback:', e);
      }
    }

    // Fallback: listen to localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === ACTIVITY_STORAGE_KEY && e.newValue) {
        const timestamp = parseInt(e.newValue, 10);
        if (timestamp > lastActivityRef.current) {
          lastActivityRef.current = timestamp;
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, throttledUpdateActivity, { passive: true });
    });

    // Set up interval to check for timeout
    checkIntervalRef.current = setInterval(checkIdleTimeout, ACTIVITY_CHECK_INTERVAL);

    // Cleanup on unmount or when disabled
    return () => {
      cleanup();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [enabled, updateActivity, throttledUpdateActivity, checkIdleTimeout, cleanup]);

  return null;
}
