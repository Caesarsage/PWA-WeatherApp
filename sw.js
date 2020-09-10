const staticCacheName = 'site-static-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/script.js',
  '/css/style.css',
  '/assets/images/WeatherPrpBG.png'
];

//install service worker
self.addEventListener('install', e =>{  
  //console.log('service worker have been install');
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
        console.log('caching shell assets');
        cache.addAll(assets);
    })
  )
});         

//activate
self.addEventListener('activate', e => {
  // console.log('service worker has been activated');
  e.waitUntil(
    caches.keys().then(keys =>{
      // console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
});

//fetch
self.addEventListener('fetch', e => {
  // console.log('fetch event', evt);
  e.respondWith(
    caches.match(e.request).then(cacheRes =>{
      return cacheRes || fetch(e.request);
    })
  );
});