'use strict'

let Leg = require('./leg')
let SimpleDistanceProvider = require('./simple-distance-provider')
let GoogleMapsDistanceProvider = require('./googlemaps-distance-provider')

function RoadtripAnalyzer() {
}

function addLeg(sum,leg){
  sum.total.distance += leg.distance
  sum.total.duration += leg.duration

  if (leg.speeding) {
    sum.speeding.distance += leg.distance
    sum.speeding.duration += leg.duration
  }
}

function formatResult(sum){
  sum.total.distance = Math.round(sum.total.distance)
  sum.total.duration = sum.total.duration/1000
  sum.speeding.distance = Math.round(sum.speeding.distance)
  sum.speeding.duration = sum.speeding.duration/1000
  return sum
}

RoadtripAnalyzer.analyze = function (waypoints, providerType) {

  return new Promise((resolve, reject) => {

    let provider = SimpleDistanceProvider
    if(providerType === 'google'){
      provider = GoogleMapsDistanceProvider
    }

    let stats = {
      total: {
        distance: 0,
        duration: 0
      },
      speeding: {
        distance: 0,
        duration: 0
      }
    }

    let legStats = []

    waypoints.reduce((prev, curr) => {
      let leg = new Leg(prev, curr)
      legStats.push(leg.getStats(provider))
      return curr
    })

    Promise.all(legStats).then(values => {

      values.reduce((total, curr) => {
        addLeg(total, curr)
        return total
      }, stats)

      resolve(formatResult(stats))

    }).catch((err) => {
      reject(err)
    })

  })

}

module.exports = RoadtripAnalyzer