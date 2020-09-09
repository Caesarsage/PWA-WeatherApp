const staticCacheName = 'site-static';
const assets = [
    '/'
];

//install service worker
self.addEventListener('install', evt =>{  
    //console.log('service worker have been install');
    caches.open(staticCacheName).then(cache => {
        cache.addAll()
    })
});         

//activate
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated');
});

//fetch
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
});