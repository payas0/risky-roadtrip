'use strict'

let GoogleMaps = require('@google/maps')

function GoogleMapsDistanceProvider() {
}

GoogleMapsDistanceProvider.getDistanceBetween = function (origin, destination) {

  let GoogleMapsClient = GoogleMaps.createClient({
    'Promise': Promise
  })

  var query = {
    origin: origin,
    destination: destination
  }

  return GoogleMapsClient.directions(query)
    .asPromise()
    .then((resp)=> {
      return resp.json.routes[0].legs[0].distance.value
    }).catch((err)=> {
      throw err
    })

}

module.exports = GoogleMapsDistanceProvider
