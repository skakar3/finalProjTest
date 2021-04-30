const cacheName = "Big Project"
const assets = [
  "./",
  "./index.html",
  "./gameAssets/bg.jpg",
  "./gameAssets/chooseShipBG.jpg",
  "./gameAssets/coin.svg",
  "./gameAssets/gameBG.png",
  "./gameAssets/instructionsBG.jpg",
  "./gameAssets/medKit.svg",
  "./gameAssets/meteor.svg",
  "./gameAssets/ship1.png",
  "./gameAssets/ship2.png",
  "./gameAssets/stars.png",
  "./masks/Helmet1.png",
  "./masks/Helmet2.png",
  "./masks/Helmet3.png",
  "./masks/Helmet4.png",
  "./img/icons/icon.png"
]

// event handler for the install event
self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

// event handler for the fetch event
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})