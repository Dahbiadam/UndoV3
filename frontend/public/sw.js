// Service Worker for UNDO Recovery App
const CACHE_NAME = 'undo-app-v1';
const OFFLINE_CACHE_NAME = 'undo-offline-v1';
const STATIC_CACHE_NAME = 'undo-static-v1';

// Cache management strategies
const cacheStrategies = {
  // Cache first, falling back to network
  cacheFirst: async (request) => {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Update cache in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      });
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Return offline fallback for certain requests
      if (request.destination === 'document') {
        return caches.match('/offline.html');
      }
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  },

  // Network first, falling back to cache
  networkFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Cache only
  cacheOnly: async (request) => {
    const cache = await caches.open(OFFLINE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Not found in cache', { status: 404 });
  },

  // Network only
  networkOnly: async (request) => {
    return fetch(request);
  }
};

// Determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);

  // Static assets - cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    request.url.includes('/icons/') ||
    request.url.includes('/_next/static/')
  ) {
    return 'cacheFirst';
  }

  // API requests - network first
  if (url.pathname.startsWith('/api/')) {
    return 'networkFirst';
  }

  // OpenAI API - network only (don't cache API responses)
  if (url.hostname.includes('api.openai.com')) {
    return 'networkOnly';
  }

  // HTML pages - network first
  if (request.destination === 'document') {
    return 'networkFirst';
  }

  // Default - network first
  return 'networkFirst';
}

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(OFFLINE_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching offline files');
        return cache.addAll([
          '/',
          '/offline.html',
          '/manifest.json',
          '/_next/static/css/app/globals.css',
          // Add other critical assets
        ]);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate cache strategy
self.addEventListener('fetch', (event) => {
  const strategy = getCacheStrategy(event.request);

  event.respondWith(
    cacheStrategies[strategy](event.request)
      .catch((error) => {
        console.error('Service Worker: Fetch failed:', error);

        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }

        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);

  if (event.tag === 'background-sync-daily-checkin') {
    event.waitUntil(syncDailyCheckIns());
  } else if (event.tag === 'background-sync-emergency-sessions') {
    event.waitUntil(syncEmergencySessions());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');

  const options = {
    body: 'You have a new message from your recovery community',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/community'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  // Customize notification based on push data
  if (event.data) {
    const data = event.data.json();
    options.title = data.title || 'UNDO Recovery';
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };

    if (data.urgency === 'high') {
      options.vibrate = [200, 100, 200, 100, 200];
      options.requireInteraction = true;
    }
  }

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync functions
async function syncDailyCheckIns() {
  try {
    console.log('Service Worker: Syncing daily check-ins');

    // Get offline check-ins from IndexedDB
    const offlineCheckIns = await getOfflineCheckIns();

    // Sync each check-in with the server
    for (const checkIn of offlineCheckIns) {
      try {
        const response = await fetch('/api/checkins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${checkIn.token}`
          },
          body: JSON.stringify(checkIn.data)
        });

        if (response.ok) {
          await removeOfflineCheckIn(checkIn.id);
          console.log('Service Worker: Synced check-in:', checkIn.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync check-in:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

async function syncEmergencySessions() {
  try {
    console.log('Service Worker: Syncing emergency sessions');

    const offlineSessions = await getOfflineEmergencySessions();

    for (const session of offlineSessions) {
      try {
        const response = await fetch('/api/emergency/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          },
          body: JSON.stringify(session.data)
        });

        if (response.ok) {
          await removeOfflineEmergencySession(session.id);
          console.log('Service Worker: Synced emergency session:', session.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync emergency session:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Emergency session sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getOfflineCheckIns() {
  // Implementation would use IndexedDB to store offline actions
  return [];
}

async function removeOfflineCheckIn(id) {
  // Implementation would remove from IndexedDB
  console.log('Service Worker: Removed offline check-in:', id);
}

async function getOfflineEmergencySessions() {
  // Implementation would use IndexedDB to store offline emergency sessions
  return [];
}

async function removeOfflineEmergencySession(id) {
  // Implementation would remove from IndexedDB
  console.log('Service Worker: Removed offline emergency session:', id);
}

// Periodic background sync for updating cached content
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered:', event.tag);

  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  try {
    console.log('Service Worker: Updating cache');

    // Update critical pages
    const criticalPages = [
      '/',
      '/dashboard',
      '/emergency',
      '/checkin'
    ];

    for (const page of criticalPages) {
      try {
        await fetch(page);
        console.log('Service Worker: Updated cache for:', page);
      } catch (error) {
        console.error('Service Worker: Failed to update cache for:', page, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Cache update failed:', error);
  }
}