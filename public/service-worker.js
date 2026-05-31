/**
 * Angelo Tutoring - Service Worker for Offline Mode
 * Enables studying without internet connection
 */

const CACHE_NAME = 'angelo-tutoring-v2';
const RUNTIME_CACHE = 'angelo-runtime-v2';
const VIDEO_CACHE = 'angelo-videos-v1';
const PAPERS_CACHE = 'angelo-papers-v1';

// Resources to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/favicon.png',
];

// Maximum cache sizes
const MAX_VIDEO_CACHE_SIZE = 50; // Number of videos
const MAX_VIDEO_CACHE_BYTES = 500 * 1024 * 1024; // 500MB

// Install event - cache essential resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE, VIDEO_CACHE, PAPERS_CACHE];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return cacheNames.filter((name) => !currentCaches.includes(name));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cache) => {
                        console.log('[SW] Deleting old cache:', cache);
                        return caches.delete(cache);
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API calls (they should always go to network)
    if (event.request.url.includes('/api/')) return;

    // Handle video requests specially (with size management)
    if (isVideoUrl(event.request.url)) {
        event.respondWith(handleVideoFetch(event.request));
        return;
    }

    // Handle PDF requests (for past papers)
    if (isPdfUrl(event.request.url)) {
        event.respondWith(handlePdfFetch(event.request));
        return;
    }

    // Skip cross-origin requests for non-video/pdf
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached response and update cache in background
                    event.waitUntil(updateCache(event.request));
                    return cachedResponse;
                }

                // Not in cache - fetch from network and cache
                return fetchAndCache(event.request);
            })
            .catch(() => {
                // Network failed and not in cache
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Offline', { status: 503 });
            })
    );
});

// Fetch and cache response
async function fetchAndCache(request) {
    const response = await fetch(request);

    // Don't cache non-successful responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }

    // Clone response for caching
    const responseToCache = response.clone();

    // Cache static assets
    if (shouldCache(request.url)) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, responseToCache);
    }

    return response;
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        // Network error - ignore, cached version will be used
    }
}

// Determine if URL should be cached
function shouldCache(url) {
    // Cache static assets
    if (url.includes('/static/')) return true;

    // Cache fonts
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) return true;

    // Cache images
    if (/\.(png|jpg|jpeg|svg|gif|webp)$/i.test(url)) return true;

    // Cache JS and CSS
    if (/\.(js|css)$/i.test(url)) return true;

    return false;
}

// =============================================
// VIDEO CACHING
// =============================================

// Check if URL is a video
function isVideoUrl(url) {
    return /\.(mp4|webm|ogg|m3u8)$/i.test(url) || url.includes('/videos/');
}

// Check if URL is a PDF (for past papers)
function isPdfUrl(url) {
    return /\.pdf$/i.test(url) || url.includes('/past-papers/');
}

// Cache video with size management
async function cacheVideo(request, response) {
    const cache = await caches.open(VIDEO_CACHE);

    // Clone response before caching
    const responseToCache = response.clone();

    // Check current cache size and evict old entries if needed
    const keys = await cache.keys();
    if (keys.length >= MAX_VIDEO_CACHE_SIZE) {
        // Remove oldest entry (FIFO)
        await cache.delete(keys[0]);
        console.log('[SW] Evicted oldest video from cache');
    }

    await cache.put(request, responseToCache);
    console.log('[SW] Cached video:', request.url);
}

// Cache PDF with size management
async function cachePdf(request, response) {
    const cache = await caches.open(PAPERS_CACHE);
    const responseToCache = response.clone();
    await cache.put(request, responseToCache);
    console.log('[SW] Cached PDF:', request.url);
}

// Handle video fetch with caching
async function handleVideoFetch(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('[SW] Serving video from cache:', request.url);
        return cachedResponse;
    }

    // Fetch from network
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            // Cache the video for offline access
            cacheVideo(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] Video fetch failed:', error);
        return new Response('Video unavailable offline', { status: 503 });
    }
}

// Handle PDF fetch with caching
async function handlePdfFetch(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('[SW] Serving PDF from cache:', request.url);
        return cachedResponse;
    }

    // Fetch from network
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            cachePdf(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] PDF fetch failed:', error);
        return new Response('PDF unavailable offline', { status: 503 });
    }
}

// Handle messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => caches.delete(cache))
                );
            })
        );
    }

    // Cache specific video for offline viewing
    if (event.data && event.data.type === 'CACHE_VIDEO') {
        const videoUrl = event.data.url;
        event.waitUntil(
            fetch(videoUrl)
                .then(response => {
                    if (response.ok) {
                        return cacheVideo(new Request(videoUrl), response);
                    }
                })
                .catch(err => console.error('[SW] Failed to cache video:', err))
        );
    }

    // Cache specific PDF for offline viewing
    if (event.data && event.data.type === 'CACHE_PDF') {
        const pdfUrl = event.data.url;
        event.waitUntil(
            fetch(pdfUrl)
                .then(response => {
                    if (response.ok) {
                        return cachePdf(new Request(pdfUrl), response);
                    }
                })
                .catch(err => console.error('[SW] Failed to cache PDF:', err))
        );
    }

    // Get cache status
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        event.waitUntil(
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            })
        );
    }
});

// Get current cache status (for UI display)
async function getCacheStatus() {
    const videoCache = await caches.open(VIDEO_CACHE);
    const papersCache = await caches.open(PAPERS_CACHE);

    const videoKeys = await videoCache.keys();
    const paperKeys = await papersCache.keys();

    return {
        videos: {
            count: videoKeys.length,
            maxCount: MAX_VIDEO_CACHE_SIZE,
            urls: videoKeys.map(r => r.url)
        },
        papers: {
            count: paperKeys.length,
            urls: paperKeys.map(r => r.url)
        }
    };
}

// Background sync for submitting answers when back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-answers') {
        event.waitUntil(syncPendingAnswers());
    }
});

async function syncPendingAnswers() {
    // This would sync any pending problem answers
    // when the user comes back online
    console.log('[SW] Syncing pending answers...');
}

console.log('[SW] Angelo Tutoring Service Worker loaded');
