/**
 * OfflineSyncService - Handle offline data synchronization
 * Queues actions when offline and syncs when connection is restored
 */

import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

// Queue storage key
const SYNC_QUEUE_KEY = 'angelo_offline_sync_queue';
const LAST_SYNC_KEY = 'angelo_last_sync';

// Connection state
let isOnline = true;
let connectionListeners = [];

// Sync queue
let syncQueue = [];
let isSyncing = false;

/**
 * Initialize the offline sync service
 */
async function initialize() {
    // Load queue from storage
    loadQueue();

    // Get initial network status
    if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        isOnline = status.connected;

        // Listen for network changes
        Network.addListener('networkStatusChange', (status) => {
            const wasOffline = !isOnline;
            isOnline = status.connected;

            console.log('[OfflineSync] Network status:', status.connected ? 'online' : 'offline');

            // Notify listeners
            connectionListeners.forEach(listener => listener(isOnline));

            // If coming back online, trigger sync
            if (wasOffline && isOnline) {
                syncPendingActions();
            }
        });
    } else {
        // Web - use navigator.onLine
        isOnline = navigator.onLine;

        window.addEventListener('online', () => {
            const wasOffline = !isOnline;
            isOnline = true;
            connectionListeners.forEach(listener => listener(true));
            if (wasOffline) {
                syncPendingActions();
            }
        });

        window.addEventListener('offline', () => {
            isOnline = false;
            connectionListeners.forEach(listener => listener(false));
        });
    }

    console.log('[OfflineSync] Initialized, online:', isOnline);

    // Sync on startup if online
    if (isOnline && syncQueue.length > 0) {
        syncPendingActions();
    }
}

/**
 * Load sync queue from localStorage
 */
function loadQueue() {
    try {
        const stored = localStorage.getItem(SYNC_QUEUE_KEY);
        if (stored) {
            syncQueue = JSON.parse(stored);
            console.log('[OfflineSync] Loaded queue with', syncQueue.length, 'items');
        }
    } catch (error) {
        console.error('[OfflineSync] Error loading queue:', error);
        syncQueue = [];
    }
}

/**
 * Save sync queue to localStorage
 */
function saveQueue() {
    try {
        localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
    } catch (error) {
        console.error('[OfflineSync] Error saving queue:', error);
    }
}

/**
 * Check if currently online
 */
function getOnlineStatus() {
    return isOnline;
}

/**
 * Add listener for connection changes
 */
function onConnectionChange(listener) {
    connectionListeners.push(listener);
    return () => {
        connectionListeners = connectionListeners.filter(l => l !== listener);
    };
}

/**
 * Queue an action for sync
 */
function queueAction(action) {
    const queuedAction = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: Date.now(),
        retries: 0,
        maxRetries: 3,
        ...action,
    };

    syncQueue.push(queuedAction);
    saveQueue();

    console.log('[OfflineSync] Queued action:', action.type, 'Queue size:', syncQueue.length);

    // Try to sync immediately if online
    if (isOnline && !isSyncing) {
        syncPendingActions();
    }

    return queuedAction.id;
}

/**
 * Queue a problem submission
 */
function queueSubmission(submission) {
    return queueAction({
        type: 'problem_submission',
        endpoint: '/api/submissions',
        method: 'POST',
        data: submission,
    });
}

/**
 * Queue progress update
 */
function queueProgressUpdate(progress) {
    return queueAction({
        type: 'progress_update',
        endpoint: '/api/progress',
        method: 'PUT',
        data: progress,
    });
}

/**
 * Queue lesson completion
 */
function queueLessonComplete(lessonData) {
    return queueAction({
        type: 'lesson_complete',
        endpoint: '/api/lessons/complete',
        method: 'POST',
        data: lessonData,
    });
}

/**
 * Sync all pending actions
 */
async function syncPendingActions() {
    if (isSyncing || syncQueue.length === 0 || !isOnline) {
        return { synced: 0, failed: 0, pending: syncQueue.length };
    }

    isSyncing = true;
    let synced = 0;
    let failed = 0;

    console.log('[OfflineSync] Starting sync of', syncQueue.length, 'items');

    // Process queue (oldest first)
    const actionsToSync = [...syncQueue];
    const failedActions = [];

    for (const action of actionsToSync) {
        try {
            await syncAction(action);
            synced++;

            // Remove from queue
            syncQueue = syncQueue.filter(a => a.id !== action.id);

        } catch (error) {
            console.error('[OfflineSync] Failed to sync action:', action.id, error);

            // Increment retry count
            action.retries++;

            if (action.retries >= action.maxRetries) {
                // Max retries reached, move to failed
                failed++;
                syncQueue = syncQueue.filter(a => a.id !== action.id);
                failedActions.push({ ...action, error: error.message });
            }
        }
    }

    // Save updated queue
    saveQueue();

    // Store last sync time
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());

    isSyncing = false;

    console.log('[OfflineSync] Sync complete. Synced:', synced, 'Failed:', failed, 'Pending:', syncQueue.length);

    return {
        synced,
        failed,
        pending: syncQueue.length,
        failedActions,
    };
}

/**
 * Sync a single action
 */
async function syncAction(action) {
    // In a real implementation, this would make the actual API call
    // For now, we simulate the sync based on action type

    console.log('[OfflineSync] Syncing action:', action.type, action.id);

    // Simulate network request
    return new Promise((resolve, reject) => {
        // Use fetch if endpoint is provided
        if (action.endpoint && window.fetch) {
            // Check if we should use Supabase instead
            if (action.type === 'problem_submission' || action.type === 'progress_update') {
                // These would normally go to Supabase
                // For now, resolve successfully (data is already saved locally)
                resolve({ success: true, offline: true });
                return;
            }

            fetch(action.endpoint, {
                method: action.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(action.data),
            })
            .then(response => {
                if (response.ok) {
                    resolve(response.json());
                } else {
                    reject(new Error(`HTTP ${response.status}`));
                }
            })
            .catch(reject);
        } else {
            // No endpoint - just resolve
            resolve({ success: true, offline: true });
        }
    });
}

/**
 * Get queue status
 */
function getQueueStatus() {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    return {
        pending: syncQueue.length,
        isOnline,
        isSyncing,
        lastSync: lastSync ? new Date(parseInt(lastSync)) : null,
        queue: syncQueue.map(a => ({
            id: a.id,
            type: a.type,
            timestamp: a.timestamp,
            retries: a.retries,
        })),
    };
}

/**
 * Clear the sync queue (use with caution)
 */
function clearQueue() {
    syncQueue = [];
    saveQueue();
    console.log('[OfflineSync] Queue cleared');
}

/**
 * Remove a specific action from queue
 */
function removeFromQueue(actionId) {
    syncQueue = syncQueue.filter(a => a.id !== actionId);
    saveQueue();
}

/**
 * Force sync (manual trigger)
 */
async function forceSync() {
    if (!isOnline) {
        return { error: 'Currently offline', pending: syncQueue.length };
    }
    return syncPendingActions();
}

const OfflineSyncService = {
    initialize,
    getOnlineStatus,
    onConnectionChange,
    queueAction,
    queueSubmission,
    queueProgressUpdate,
    queueLessonComplete,
    syncPendingActions,
    getQueueStatus,
    clearQueue,
    removeFromQueue,
    forceSync,
};

export default OfflineSyncService;
