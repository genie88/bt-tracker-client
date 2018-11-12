# bt-tracker-client [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/allex/bt-tracker-client/master.svg
[travis-url]: https://travis-ci.org/allex/bt-tracker-client
[npm-image]: https://img.shields.io/npm/v/bt-tracker-client.svg
[npm-url]: https://npmjs.org/package/bt-tracker-client
[downloads-image]: https://img.shields.io/npm/dm/bt-tracker-client.svg
[downloads-url]: https://npmjs.org/package/bt-tracker-client
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

#### Simple, robust, BitTorrent tracker (client) implementation

Node.js implementation of a [BitTorrent tracker](https://wiki.theory.org/BitTorrentSpecification#Tracker_HTTP.2FHTTPS_Protocol), client and server.

A **BitTorrent tracker** is a web service which responds to requests from BitTorrent
clients. The requests include metrics from clients that help the tracker keep overall
statistics about the torrent. The response includes a peer list that helps the client
participate in the torrent swarm.

## features

- Includes client implementations
- Supports all mainstream tracker types:
  - HTTP trackers
  - UDP trackers ([BEP 15](http://www.bittorrent.org/beps/bep_0015.html))
  - WebTorrent trackers ([BEP forthcoming](http://webtorrent.io))
- Supports ipv4 & ipv6
- Supports tracker "scrape" extension
- Robust and well-tested
  - Comprehensive test suite (runs entirely offline, so it's reliable)
  - Used by popular clients: [WebTorrent](http://webtorrent.io), [peerflix](https://www.npmjs.com/package/peerflix), and [playback](https://mafintosh.github.io/playback/)

Also see [bittorrent-dht](https://www.npmjs.com/package/bittorrent-dht).

## install

```
npm install bt-tracker-client
```

## usage

### client

To connect to a tracker, just do this:

```js
var Client = require('bt-tracker-client')

var requiredOpts = {
  infoHash: new Buffer('012345678901234567890'), // hex string or Buffer
  peerId: new Buffer('01234567890123456789'), // hex string or Buffer
  announce: [], // list of tracker server urls
  port: 6881 // torrent client port, (in browser, optional)
}

var optionalOpts = {
  getAnnounceOpts: function () {
    // Provide a callback that will be called whenever announce() is called
    // internally (on timer), or by the user
    return {
      uploaded: 0,
      downloaded: 0,
      left: 0,
      customParam: 'blah' // custom parameters supported
    }
  },
  // RTCPeerConnection config object (only used in browser)
  rtcConfig: {},
  // User-Agent header for http requests
  userAgent: '',
  // Custom webrtc impl, useful in node to specify [wrtc](https://npmjs.com/package/wrtc)
  wrtc: {},
}

var client = new Client(requiredOpts)

client.on('error', function (err) {
  // fatal client error!
  console.log(err.message)
})

client.on('warning', function (err) {
  // a tracker was unavailable or sent bad data to the client. you can probably ignore it
  console.log(err.message)
})

// start getting peers from the tracker
client.start()

client.on('update', function (data) {
  console.log('got an announce response from tracker: ' + data.announce)
  console.log('number of seeders in the swarm: ' + data.complete)
  console.log('number of leechers in the swarm: ' + data.incomplete)
})

client.once('peer', function (addr) {
  console.log('found a peer: ' + addr) // 85.10.239.191:48623
})

// announce that download has completed (and you are now a seeder)
client.complete()

// force a tracker announce. will trigger more 'update' events and maybe more 'peer' events
client.update()

// provide parameters to the tracker
client.update({
  uploaded: 0,
  downloaded: 0,
  left: 0,
  customParam: 'blah' // custom parameters supported
})

// stop getting peers from the tracker, gracefully leave the swarm
client.stop()

// ungracefully leave the swarm (without sending final 'stop' message)
client.destroy()

// scrape
client.scrape()

client.on('scrape', function (data) {
  console.log('got a scrape response from tracker: ' + data.announce)
  console.log('number of seeders in the swarm: ' + data.complete)
  console.log('number of leechers in the swarm: ' + data.incomplete)
  console.log('number of total downloads of this torrent: ' + data.downloaded)
})
```

## multi scrape

Scraping multiple torrent info is possible with a static `Client.scrape` method:

```js
var Client = require('bt-tracker-client')
Client.scrape({ announce: announceUrl, infoHash: [ infoHash1, infoHash2 ]}, function (err, results) {
  results[infoHash1].announce
  results[infoHash1].infoHash
  results[infoHash1].complete
  results[infoHash1].incomplete
  results[infoHash1].downloaded

  // ...
})
````

## license

MIT. Copyright (c) [Feross Aboukhadijeh](https://feross.org) and [WebTorrent, LLC](https://webtorrent.io).
