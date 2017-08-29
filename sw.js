importScripts('./sw/cache.js')
toolbox.options.debug = false;
const VERSION = '0';
const PREFIX = 'kiss';

const CACHE_NAME = `${PREFIX}-v${VERSION}`;
const PWA_OPTION = {
  cache: {
    name: `PWA-${CACHE_NAME}`,
    networkTimeoutSeconds: 2
  }
};

toolbox.options.cache.name = CACHE_NAME;
toolbox.router.default = toolbox.networkFirst;
toolbox.options.successResponses = /^200$/;
toolbox.router.get(/.*\.(js|gif|png|svg|jpg|jpeg|css|woff|ttf|svg|woff2)$/, toolbox.cacheFirst);
toolbox.router.get(/\/repos\//, toolbox.networkOnly);
toolbox.router.get(/\/(page|post)\//, function(request, values, options) {
  options.rewrite = request.url.replace(/\brd=[^&]+/, '')
  return toolbox.networkFirst(request, values, options);
}, PWA_OPTION);

// Claim all clients and delete old caches that are no longer needed.
self.addEventListener('activate', event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    )
  );
});

// Make sure the SW the page we register() is the service we use.
self.addEventListener('install', () => self.skipWaiting());
