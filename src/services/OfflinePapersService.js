/**
 * OfflinePapersService - Download and manage past papers for offline access
 *
 * Uses Service Worker cache for PDF storage
 * Provides progress tracking and storage management
 */

const PAPERS_CACHE_NAME = 'angelo-papers-v1';

/**
 * Check if Service Worker is available
 */
const isServiceWorkerAvailable = () => {
    return 'serviceWorker' in navigator && 'caches' in window;
};

/**
 * Check if a paper is cached (available offline)
 */
async function isPaperCached(paperUrl) {
    if (!isServiceWorkerAvailable()) return false;

    try {
        const cache = await caches.open(PAPERS_CACHE_NAME);
        const response = await cache.match(paperUrl);
        return !!response;
    } catch (error) {
        console.error('[OfflinePapers] Error checking cache:', error);
        return false;
    }
}

/**
 * Download paper for offline access
 * @param {string} paperUrl - URL of the paper PDF
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<boolean>} - Success status
 */
async function downloadPaper(paperUrl, onProgress = () => {}) {
    if (!isServiceWorkerAvailable()) {
        throw new Error('Offline storage not available in this browser');
    }

    try {
        // Fetch the paper
        const response = await fetch(paperUrl);

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`);
        }

        // Get total size for progress tracking
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        // Read the response body as a stream
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            chunks.push(value);
            received += value.length;

            if (total > 0) {
                const progress = Math.round((received / total) * 100);
                onProgress(progress);
            }
        }

        // Combine chunks into a single Uint8Array
        const chunksAll = new Uint8Array(received);
        let position = 0;
        for (const chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }

        // Create a new response to cache
        const blob = new Blob([chunksAll], { type: 'application/pdf' });
        const cacheResponse = new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': String(received),
            },
        });

        // Store in cache
        const cache = await caches.open(PAPERS_CACHE_NAME);
        await cache.put(paperUrl, cacheResponse);

        onProgress(100);
        console.log('[OfflinePapers] Downloaded:', paperUrl);
        return true;

    } catch (error) {
        console.error('[OfflinePapers] Download failed:', error);
        throw error;
    }
}

/**
 * Download multiple papers with overall progress
 */
async function downloadPapers(paperUrls, onOverallProgress = () => {}) {
    const results = [];
    let completed = 0;

    for (const url of paperUrls) {
        try {
            await downloadPaper(url, (progress) => {
                const overallProgress = ((completed + progress / 100) / paperUrls.length) * 100;
                onOverallProgress(Math.round(overallProgress));
            });
            results.push({ url, success: true });
        } catch (error) {
            results.push({ url, success: false, error: error.message });
        }
        completed++;
    }

    return results;
}

/**
 * Remove paper from cache
 */
async function removePaper(paperUrl) {
    if (!isServiceWorkerAvailable()) return false;

    try {
        const cache = await caches.open(PAPERS_CACHE_NAME);
        await cache.delete(paperUrl);
        console.log('[OfflinePapers] Removed:', paperUrl);
        return true;
    } catch (error) {
        console.error('[OfflinePapers] Remove failed:', error);
        return false;
    }
}

/**
 * Get all cached papers
 */
async function getCachedPapers() {
    if (!isServiceWorkerAvailable()) return [];

    try {
        const cache = await caches.open(PAPERS_CACHE_NAME);
        const keys = await cache.keys();
        return keys.map(request => request.url);
    } catch (error) {
        console.error('[OfflinePapers] Error getting cached papers:', error);
        return [];
    }
}

/**
 * Get cache storage usage
 */
async function getCacheUsage() {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) {
        return { used: 0, quota: 0, percentage: 0 };
    }

    try {
        const estimate = await navigator.storage.estimate();
        return {
            used: estimate.usage || 0,
            quota: estimate.quota || 0,
            percentage: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0,
        };
    } catch (error) {
        console.error('[OfflinePapers] Error getting storage estimate:', error);
        return { used: 0, quota: 0, percentage: 0 };
    }
}

/**
 * Clear all cached papers
 */
async function clearAllPapers() {
    if (!isServiceWorkerAvailable()) return false;

    try {
        await caches.delete(PAPERS_CACHE_NAME);
        console.log('[OfflinePapers] Cleared all papers');
        return true;
    } catch (error) {
        console.error('[OfflinePapers] Clear failed:', error);
        return false;
    }
}

/**
 * Request persistent storage (prevents browser from auto-clearing)
 */
async function requestPersistentStorage() {
    if (!navigator.storage?.persist) {
        return false;
    }

    try {
        const isPersisted = await navigator.storage.persist();
        console.log('[OfflinePapers] Persistent storage:', isPersisted ? 'granted' : 'denied');
        return isPersisted;
    } catch (error) {
        console.error('[OfflinePapers] Error requesting persistent storage:', error);
        return false;
    }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get status summary
 */
async function getStatus() {
    const cachedPapers = await getCachedPapers();
    const usage = await getCacheUsage();

    return {
        isAvailable: isServiceWorkerAvailable(),
        cachedCount: cachedPapers.length,
        cachedUrls: cachedPapers,
        storageUsed: formatBytes(usage.used),
        storageQuota: formatBytes(usage.quota),
        storagePercentage: usage.percentage,
    };
}

const OfflinePapersService = {
    isPaperCached,
    downloadPaper,
    downloadPapers,
    removePaper,
    getCachedPapers,
    getCacheUsage,
    clearAllPapers,
    requestPersistentStorage,
    formatBytes,
    getStatus,
    isServiceWorkerAvailable,
};

export default OfflinePapersService;
