const C='mt-v4-'+Date.now();
const A=['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(C).then(function(c){return c.addAll(A)}).then(function(){return self.skipWaiting()})
  )
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))
    }).then(function(){return self.clients.claim()})
  )
});

self.addEventListener('fetch',function(e){
  // Always fetch fresh from network for HTML files
  if(e.request.url.endsWith('.html')||e.request.url.endsWith('/')){
    e.respondWith(
      fetch(e.request).catch(function(){return caches.match(e.request)})
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).catch(function(){return caches.match('./index.html')})
    })
  )
});
