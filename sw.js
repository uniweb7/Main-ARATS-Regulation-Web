const CACHE_NAME = 'arats-os-v34-cache';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// 1. Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('ARATS Cache Opened');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. Listen for requests (Offline Support)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if found, else fetch from network
                if (response) {
                    return response; 
                }
                return fetch(event.request);
            })
    );
});

// 3. Activate and Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

