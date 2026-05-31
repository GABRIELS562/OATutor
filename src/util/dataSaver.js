/**
 * Data Saver Utilities for SA Mobile Networks
 *
 * South African mobile data is expensive (~R149/GB on prepaid).
 * These utilities help minimize data usage for students.
 */

// Check if user has enabled data saver mode in their browser
export const isDataSaverEnabled = () => {
    // Check navigator.connection for data saver hint
    if ('connection' in navigator) {
        const conn = navigator.connection;
        return conn.saveData === true;
    }
    // Check localStorage for manual data saver setting
    return localStorage.getItem('dataSaverMode') === 'true';
};

// Check if user is on a slow connection (2G/3G common in rural SA)
export const isSlowConnection = () => {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        const slowTypes = ['slow-2g', '2g', '3g'];
        return slowTypes.includes(conn.effectiveType);
    }
    return false;
};

// Enable/disable manual data saver mode
export const setDataSaverMode = (enabled) => {
    localStorage.setItem('dataSaverMode', enabled ? 'true' : 'false');
};

// Get estimated data remaining (requires Network Information API)
export const getConnectionInfo = () => {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        return {
            effectiveType: conn.effectiveType, // '4g', '3g', '2g', 'slow-2g'
            downlink: conn.downlink, // Mbps
            rtt: conn.rtt, // Round-trip time in ms
            saveData: conn.saveData, // User preference
        };
    }
    return null;
};

// Prefetch hints for next likely problems (when on good connection)
export const shouldPrefetch = () => {
    if (isDataSaverEnabled()) return false;
    if (isSlowConnection()) return false;

    const conn = getConnectionInfo();
    if (conn && conn.effectiveType === '4g' && conn.downlink > 1) {
        return true;
    }
    return false;
};

// Image quality settings based on connection
export const getImageQuality = () => {
    if (isDataSaverEnabled()) return 'low';
    if (isSlowConnection()) return 'medium';
    return 'high';
};

// Debounce network requests (prevent rapid-fire API calls)
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Batch API requests to reduce connection overhead
export const batchRequests = (requests, batchSize = 3) => {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
        batches.push(requests.slice(i, i + batchSize));
    }
    return batches;
};

// Compress data before sending to API
export const compressForUpload = (data) => {
    // Remove null/undefined values
    const cleaned = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
    );
    return cleaned;
};

// Local storage with size limits (prevent filling up phone storage)
const MAX_STORAGE_MB = 10;

export const safeLocalStorage = {
    set: (key, value) => {
        try {
            const json = JSON.stringify(value);
            // Check size before storing
            if (json.length > MAX_STORAGE_MB * 1024 * 1024) {
                console.warn('Data too large to store locally');
                return false;
            }
            localStorage.setItem(key, json);
            return true;
        } catch (e) {
            // Storage full - clear old data
            console.warn('localStorage full, clearing old data');
            clearOldData();
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },
};

// Clear old cached data to free up space
const clearOldData = () => {
    const keysToKeep = ['userId', 'dataSaverMode', 'progress'];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
        if (!keysToKeep.some((keep) => key.includes(keep))) {
            localStorage.removeItem(key);
        }
    });
};

// Monitor network changes
export const onNetworkChange = (callback) => {
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', callback);
        return () => navigator.connection.removeEventListener('change', callback);
    }
    return () => {};
};

const DataSaver = {
    isDataSaverEnabled,
    isSlowConnection,
    setDataSaverMode,
    getConnectionInfo,
    shouldPrefetch,
    getImageQuality,
    debounce,
    batchRequests,
    compressForUpload,
    safeLocalStorage,
    onNetworkChange,
};

export default DataSaver;
