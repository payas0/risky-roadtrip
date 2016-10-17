'use strict'

let sinon = require('sinon')
let expect = require('chai').expect

let SimpleDistanceProvider = require('../lib/simple-distance-provider')
let GoogleMapsDistanceProvider = require('../lib/googlemaps-distance-provider')

let GoogleMaps = require('@google/maps')

//according to wikipedia
const TELLUS_CIRCUMFERENCE_METERS = 40075017
const EXPECTED_VALUE = 45
const EXPECTED_RESPONSE = {
  "json": {
    "routes": [{
        "legs": [{
            "distance": {"value": EXPECTED_VALUE}
          }]
      }]
  }
}

describe('SimpleDistanceProvider', function () {

  it('returns distance', function (done) {

    var result = SimpleDistanceProvider.getDistanceBetween({latitude: 0, longitude: 0}, {latitude: 0, longitude: 180})

    result.then((data) => {
      console.log("Length = ", data);

      var diff = Math.abs(TELLUS_CIRCUMFERENCE_METERS / 2 - data)

      expect(diff).to.be.lessThan(500) //500m acceptable inaccuracy on half the globe
      done();
    })
      .catch((err)=> {
        assert.fail(err)
        done()
      })
  })

})

describe('GoogleMapsDistanceProvider', function () {

  it('returns distance', sinon.test(function (done) {

    let client = GoogleMaps.createClient({
      'Promise': Promise
    })

    this.stub(client, 'directions', function () {
      return {
        asPromise: function () {
          return Promise.resolve(EXPECTED_RESPONSE)
        }
      }
    })

    this.stub(GoogleMaps, 'createClient', function () {
      return client
    })

    let result = GoogleMapsDistanceProvider
      .getDistanceBetween({latitude: 0, longitude: 0}, {latitude: 0, longitude: 180});

    //assertions
    result.then((data) => {
      expect(data).to.be.equal(EXPECTED_VALUE)
      done()
    })
      .catch((err)=> {
        assert.fail(err)
        done()
      })
  }))

  it('throws exception', sinon.test(function (done) {

    let client = GoogleMaps.createClient({
      'Promise': Promise
    })

    this.stub(client, 'directions', function () {
      return {
        asPromise: function () {
          return Promise.resolve({})
        }
      }
    })

    this.stub(GoogleMaps, 'createClient', function () {
      return client
    })

    let result = GoogleMapsDistanceProvider.getDistanceBetween({latitude: 0, longitude: 0}, {
      latitude: 0,
      longitude: 180
    })

    //call the function we're testing

    //assertions
    result.then((data) => {
      assert.fail()
      done()
    })
      .catch((err)=> {
        //expected
        done()
      })

  }))
})