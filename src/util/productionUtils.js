/**
 * Angelo Tutoring - Production Utilities
 *
 * This module provides production-ready utilities for:
 * - Error tracking and reporting
 * - Performance monitoring
 * - Console management
 * - Health check utilities
 */

import { IS_PRODUCTION, IS_STAGING_OR_DEVELOPMENT } from './getBuildType';

// ============================================
// Console Management
// ============================================

/**
 * Production-safe console wrapper
 * In production, suppresses debug/log but keeps warn/error
 */
const productionConsole = {
    log: IS_PRODUCTION ? () => {} : console.log.bind(console),
    debug: IS_PRODUCTION ? () => {} : console.debug.bind(console),
    info: IS_PRODUCTION ? () => {} : console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
};

/**
 * Initialize console for production
 * Call this early in app initialization to suppress verbose logging
 */
export function initProductionConsole() {
    if (IS_PRODUCTION) {
        // Store original console for debugging if needed
        window.__originalConsole = { ...console };

        // Override console methods in production
        console.log = productionConsole.log;
        console.debug = productionConsole.debug;
        console.info = productionConsole.info;

        // Keep warn and error for important messages
        // console.warn and console.error remain unchanged
    }
}

// ============================================
// Error Tracking
// ============================================

/**
 * Error tracking configuration
 * In production, you can integrate with services like Sentry
 */
const errorTracker = {
    initialized: false,
    queue: [],

    /**
     * Initialize error tracking
     * @param {Object} options - Configuration options
     * @param {string} options.dsn - Error tracking service DSN (optional)
     * @param {string} options.environment - Environment name
     */
    init(options = {}) {
        const { environment = IS_PRODUCTION ? 'production' : 'development' } = options;

        this.environment = environment;
        this.initialized = true;

        // Set up global error handlers
        this.setupGlobalHandlers();

        // Process queued errors
        this.queue.forEach(error => this.captureError(error));
        this.queue = [];

        if (IS_STAGING_OR_DEVELOPMENT) {
            console.debug('[ErrorTracker] Initialized for environment:', environment);
        }
    },

    /**
     * Set up global error handlers
     */
    setupGlobalHandlers() {
        // Catch unhandled errors
        window.onerror = (message, source, lineno, colno, error) => {
            this.captureError({
                type: 'unhandled_error',
                message,
                source,
                lineno,
                colno,
                stack: error?.stack,
            });
            return false; // Don't suppress error
        };

        // Catch unhandled promise rejections
        window.onunhandledrejection = (event) => {
            this.captureError({
                type: 'unhandled_rejection',
                reason: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
            });
        };
    },

    /**
     * Capture and report an error
     * @param {Error|Object} error - Error to capture
     * @param {Object} context - Additional context
     */
    captureError(error, context = {}) {
        if (!this.initialized) {
            this.queue.push({ error, context });
            return;
        }

        const errorData = {
            timestamp: new Date().toISOString(),
            environment: this.environment,
            url: window.location.href,
            userAgent: navigator.userAgent,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            } : error,
            context,
        };

        // Log to console in development
        if (IS_STAGING_OR_DEVELOPMENT) {
            console.error('[ErrorTracker] Captured error:', errorData);
        }

        // In production, send to error tracking service
        if (IS_PRODUCTION) {
            this.sendToService(errorData);
        }
    },

    /**
     * Send error to tracking service
     * @param {Object} errorData - Error data to send
     */
    sendToService(errorData) {
        // Placeholder for error tracking service integration
        // Example integrations:
        // - Sentry: Sentry.captureException(errorData)
        // - LogRocket: LogRocket.captureException(errorData)
        // - Custom endpoint: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) })

        // For now, store in localStorage for debugging
        try {
            const errors = JSON.parse(localStorage.getItem('angelo_error_log') || '[]');
            errors.push(errorData);
            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.shift();
            }
            localStorage.setItem('angelo_error_log', JSON.stringify(errors));
        } catch (e) {
            // Storage might be full or unavailable
        }
    },

    /**
     * Get stored errors (for debugging)
     */
    getStoredErrors() {
        try {
            return JSON.parse(localStorage.getItem('angelo_error_log') || '[]');
        } catch {
            return [];
        }
    },

    /**
     * Clear stored errors
     */
    clearStoredErrors() {
        localStorage.removeItem('angelo_error_log');
    },
};

// ============================================
// Performance Monitoring
// ============================================

/**
 * Performance monitoring utilities
 */
const performanceMonitor = {
    marks: new Map(),

    /**
     * Start a performance measurement
     * @param {string} name - Measurement name
     */
    startMeasure(name) {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(`${name}_start`);
            this.marks.set(name, Date.now());
        }
    },

    /**
     * End a performance measurement and log result
     * @param {string} name - Measurement name
     */
    endMeasure(name) {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(`${name}_end`);

            try {
                performance.measure(name, `${name}_start`, `${name}_end`);
                const measure = performance.getEntriesByName(name)[0];

                if (IS_STAGING_OR_DEVELOPMENT) {
                    console.debug(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
                }

                return measure.duration;
            } catch (e) {
                // Measurement may have been cleared
                const startTime = this.marks.get(name);
                if (startTime) {
                    const duration = Date.now() - startTime;
                    if (IS_STAGING_OR_DEVELOPMENT) {
                        console.debug(`[Performance] ${name}: ${duration}ms`);
                    }
                    return duration;
                }
            }
        }
        return null;
    },

    /**
     * Get Core Web Vitals metrics
     */
    getWebVitals() {
        if (typeof performance === 'undefined') return null;

        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        const metrics = {
            // Navigation Timing
            dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
            tcp: navigation?.connectEnd - navigation?.connectStart,
            ttfb: navigation?.responseStart - navigation?.requestStart,
            domLoad: navigation?.domContentLoadedEventEnd - navigation?.startTime,
            windowLoad: navigation?.loadEventEnd - navigation?.startTime,
        };

        // Paint Timing
        paint.forEach(entry => {
            if (entry.name === 'first-paint') {
                metrics.fp = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                metrics.fcp = entry.startTime;
            }
        });

        return metrics;
    },

    /**
     * Log Web Vitals to console
     */
    logWebVitals() {
        const vitals = this.getWebVitals();
        if (vitals && IS_STAGING_OR_DEVELOPMENT) {
            console.debug('[Web Vitals]', vitals);
        }
        return vitals;
    },
};

// ============================================
// Health Check
// ============================================

/**
 * Health check utilities for monitoring
 */
const healthCheck = {
    /**
     * Get application health status
     */
    getStatus() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.REACT_APP_VERSION || '1.0.0',
            buildType: process.env.REACT_APP_BUILD_TYPE || 'unknown',
            commitHash: process.env.REACT_APP_COMMIT_HASH || 'unknown',
            environment: IS_PRODUCTION ? 'production' : IS_STAGING_OR_DEVELOPMENT ? 'staging' : 'development',
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                online: navigator.onLine,
                cookiesEnabled: navigator.cookieEnabled,
            },
            storage: {
                localStorage: this.checkLocalStorage(),
                sessionStorage: this.checkSessionStorage(),
                indexedDB: this.checkIndexedDB(),
            },
            features: {
                serviceWorker: 'serviceWorker' in navigator,
                notifications: 'Notification' in window,
                webGL: this.checkWebGL(),
            },
        };
    },

    /**
     * Check localStorage availability
     */
    checkLocalStorage() {
        try {
            localStorage.setItem('__test__', 'test');
            localStorage.removeItem('__test__');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check sessionStorage availability
     */
    checkSessionStorage() {
        try {
            sessionStorage.setItem('__test__', 'test');
            sessionStorage.removeItem('__test__');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check IndexedDB availability
     */
    checkIndexedDB() {
        return 'indexedDB' in window;
    },

    /**
     * Check WebGL availability
     */
    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch {
            return false;
        }
    },

    /**
     * Expose health endpoint for monitoring tools
     * Call this to make health status available globally
     */
    exposeEndpoint() {
        window.__angeloHealth = () => this.getStatus();

        if (IS_STAGING_OR_DEVELOPMENT) {
            console.debug('[Health] Health check endpoint exposed at window.__angeloHealth()');
        }
    },
};

// ============================================
// Exports
// ============================================

export {
    productionConsole,
    errorTracker,
    performanceMonitor,
    healthCheck,
};

/**
 * Initialize all production utilities
 * Call this early in the application lifecycle
 */
export function initProductionMode() {
    // Initialize console management
    initProductionConsole();

    // Initialize error tracking
    errorTracker.init({
        environment: IS_PRODUCTION ? 'production' : 'development',
    });

    // Expose health endpoint
    healthCheck.exposeEndpoint();

    // Log web vitals after page load
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                performanceMonitor.logWebVitals();
            }, 0);
        });
    }

    if (IS_STAGING_OR_DEVELOPMENT) {
        console.debug('[Production] All production utilities initialized');
    }
}

const productionUtils = {
    initProductionMode,
    initProductionConsole,
    productionConsole,
    errorTracker,
    performanceMonitor,
    healthCheck,
};

export default productionUtils;
