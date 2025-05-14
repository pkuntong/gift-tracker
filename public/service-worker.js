// Service Worker for Gift Tracker PWA
const CACHE_NAME = 'gift-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  // For Firebase authentication and Firestore requests
  if (event.request.url.includes('firebaseapp.com') ||
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Return the response directly for non-GET requests or if it's not valid for caching
        if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
          return response;
        }

        // Clone the response - response is a stream and can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle background sync for offline data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-gifts') {
    event.waitUntil(syncGifts());
  }
});

// Background sync function for gifts
async function syncGifts() {
  try {
    const syncCache = await caches.open('gift-sync-cache');
    const requests = await syncCache.keys();
    
    const syncPromises = requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await syncCache.delete(request);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Sync error:', error);
        return false;
      }
    });
    
    return Promise.all(syncPromises);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  // Show notification
  const showNotification = () => {
    const options = {
      body: data.message || 'You have a new reminder',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: {
        reminderId: data.reminderId,
        type: data.type,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        }
      ],
      vibrate: [100, 50, 100],
      tag: data.reminderId, // Use ID as tag to prevent duplicates
      renotify: true
    };
    
    // Use the waitUntil method to keep the service worker alive until the notification is shown
    event.waitUntil(
      self.registration.showNotification(data.title || 'Gift Tracker Reminder', options)
    );
  };
  
  // Show the notification
  showNotification();
}); 

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();
  
  const reminderId = notification.data?.reminderId;
  const targetUrl = notification.data?.url || '/';
  
  if (event.action === 'view') {
    // Open the app and navigate to the appropriate page
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(windowClients => {
        // Check if there is already a window open
        for (const client of windowClients) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Update reminder status to dismissed if reminderId is available
    // This would be handled by the client when it receives the notification
  }
});

// Legacy notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
