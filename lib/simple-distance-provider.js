'use strict'

function SimpleDistanceProvider() {
}

/*
 * Haversine copied from
 * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 *
 * Minimal alteration from mean radius 6371 to equatorial 6378 and switched unit to meters
 */
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  var R = 6378 * 1000// Radius of the earth in m
  var dLat = deg2rad(lat2 - lat1) // deg2rad below
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c// Distance in m
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

SimpleDistanceProvider.getDistanceBetween = function (origin, destination) {

  return Promise.resolve(
    getDistanceFromLatLonInMeters(origin.latitude, origin.longitude, destination.latitude, destination.longitude)
  )

}

module.exports = SimpleDistanceProvider
