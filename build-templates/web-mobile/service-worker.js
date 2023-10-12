// キャッシュファイルの指定
const CACHE_NAME = 'six-cache';
const CACHE_VERSION = 202305121725;
var urlsToCache = [
    'https://loghouse.x0.com/game/six/',
];

// インストール処理
self.addEventListener('install', function(event) {
    console.log("installing");
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                console.log("installed.");
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response ? response : fetch(event.request);
            })
    );
});