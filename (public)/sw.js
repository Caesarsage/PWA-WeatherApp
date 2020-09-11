const staticCacheName = 'site-static-v08';
const dynamicCacheName = 'site-dynamic-v3';

const assets = [
  '/',
  '/index.html',
  '/js/script.js',
  '/js/app.js',
  '/js/toggle.js',
  '/css/style.css',
  '/css/font-awesome.min.css',
  '/assets/images/icon-hamburger.svg',
  '/assets/images/icon-close.svg',
  '/assets/images/weather2.jpg',
  '/pages/fallback.html',
  ];

// cache size limit function
const limitCachesize = (name, size) =>{
  caches.open(name).then(caches =>{
    caches.keys().then(keys =>{
      if(keys.length > size){
        caches.delete(keys[0]).then(limitCachesize(name, size));
      }
    })
  })
};

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
      return cacheRes || fetch(e.request).then(fetchRes =>{
        return caches.open(dynamicCacheName).then(caches =>{
          caches.put(e.request.url, fetchRes.clone());
          limitCachesize(dynamicCacheName, 20);
          return fetchRes;
        })
      });
    }).catch(() => {
      if (e.request.url.indexOf('.html') > -1) {
        return caches.match('/pages/fallback.html');
      }
    })
  );
});