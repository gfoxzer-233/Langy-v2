const CACHE_NAME = 'langy-ai-v62';
const urlsToCache = [
  './',
  './index.html',
  './styles/variables.css',
  './styles/global.css',
  './styles/components.css',
  './styles/animations.css',
  './styles/screens.css',
  './src/main.js',
  './src/utils/config.js',
  './src/utils/core.js',
  './src/utils/ai.js',
  './src/utils/animations.js',
  './src/utils/db.js',
  './src/utils/router.js',
  './src/utils/state.js',
  './src/utils/target-language.js',
  './src/utils/mascot-persona.js',
  './src/utils/tutor.js',
  './src/utils/widgets.js',
  './src/data/curriculum.js',
  './src/screens/home.js',
  './src/screens/talk.js',
  './src/screens/onboarding.js',
  './src/screens/calendar.js',
  './src/screens/grammar.js',
  './src/screens/listening.js',
  './src/screens/progress.js',
  './src/utils/daily-speaking.js',
  './src/utils/voice.js',
  './src/utils/coach-intel.js',
  './src/utils/next-action.js',
  './src/utils/vocab-tracker.js'
];

// Install: pre-cache critical assets & skip waiting
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: purge ALL old caches & claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // Take over all tabs immediately
  );
});

const STATIC_EXT_RE = /\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/i;
const NETWORK_TIMEOUT_MS = 3500;

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
  ]);
}

// Fetch strategy:
// - HTML: network-first with timeout fallback
// - Static assets: cache-first with background refresh
// - Other GET: network-first fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Skip API calls entirely
  if (event.request.url.includes('openrouter.ai') || event.request.url.includes('workers.dev')) return;

  const accept = event.request.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');
  const isStatic = STATIC_EXT_RE.test(new URL(event.request.url).pathname);

  if (isHTML) {
    event.respondWith(
      withTimeout(fetch(event.request), NETWORK_TIMEOUT_MS)
        .then(networkRes => {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return networkRes;
        })
        .catch(() =>
          caches.match(event.request).then(cachedRes => cachedRes || caches.match('./index.html'))
        )
    );
    return;
  }

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(cachedRes => {
        const refresh = fetch(event.request)
          .then(networkRes => {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            return networkRes;
          })
          .catch(() => cachedRes);
        return cachedRes || refresh;
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkRes => {
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return networkRes;
      })
      .catch(() => caches.match(event.request))
  );
});
