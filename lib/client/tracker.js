module.exports = Tracker

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var debug = require('debug')('bittorrent-tracker:tracker')

inherits(Tracker, EventEmitter)

function Tracker (client, announceUrl) {
  var self = this
  EventEmitter.call(self)
  self.client = client
  self.announceUrl = announceUrl

  self.interval = null
  self.destroyed = false
}

Tracker.prototype.setInterval = function (intervalMs) {
  var self = this
  if (intervalMs === undefined || intervalMs === null) intervalMs = self.DEFAULT_ANNOUNCE_INTERVAL

  clearInterval(self.interval)

  debug('setInterval %d', intervalMs)
  if (intervalMs) {
    self.interval = setInterval(function () {
      self.announce(self.client._defaultAnnounceOpts())
    }, intervalMs)
    if (self.interval.unref) self.interval.unref()
  }
}
