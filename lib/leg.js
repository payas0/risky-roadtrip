'use strict'

function Leg(origin, destination) {
  this.origin = origin
  this.destination = destination
}

Leg.prototype.getDuration = function () {

  let startDate = new Date(this.origin.timestamp)
  let endDate = new Date(this.destination.timestamp)

  let duration = endDate - startDate

  return duration

}

Leg.prototype.isSpeeding = function () {
  return (this.origin.speed > this.origin.speed_limit)
}

Leg.prototype.getStats = function (distanceProvider) {

  let duration = this.getDuration()
  let speeding = this.isSpeeding()

  return distanceProvider.getDistanceBetween(this.origin.position, this.destination.position)
    .then((dist)=> {
      return {
        distance: dist,
        duration: duration,
        speeding: speeding
      }
    })
}

module.exports = Leg