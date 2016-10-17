"use strict"

let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')

let Leg = require('../lib/leg')
let SimpleDistanceProvider = require('../lib/simple-distance-provider')

const FAKE_DISTANCE_VALUE = 42

describe('Leg', function () {

  it('calculates duration', () => {

    let leg = new Leg({
        "timestamp": "2016-06-21T12:00:00.000Z",
        "position": {
          "latitude": 59.334,
          "longitude": 18.0667
        },
        "speed": 9,
        "speed_limit": 8.33
      },
      {
        "timestamp": "2016-06-21T12:00:25.000Z",
        "position": {
          "latitude": 59.3337,
          "longitude": 18.0662
        },
        "speed": 9.4,
        "speed_limit": 8.33
      })

    expect(leg.getDuration()).to.equal(25 * 1000);

  })

  it('determines speeding correctly', () => {

    let leg = new Leg({
        "timestamp": "2016-06-21T12:00:00.000Z",
        "position": {
          "latitude": 59.334,
          "longitude": 18.0667
        },
        "speed": 9,
        "speed_limit": 8.33
      },
      {
        "timestamp": "2016-06-21T12:00:25.000Z",
        "position": {
          "latitude": 59.3337,
          "longitude": 18.0662
        },
        "speed": 9.4,
        "speed_limit": 8.33
      })

    expect(leg.isSpeeding()).to.be.true
  })

  it('determines none-speeding correctly', () => {

    let leg = new Leg({
        "timestamp": "2016-06-21T12:00:00.000Z",
        "position": {
          "latitude": 59.334,
          "longitude": 18.0667
        },
        "speed": 8,
        "speed_limit": 8.33
      },
      {
        "timestamp": "2016-06-21T12:00:25.000Z",
        "position": {
          "latitude": 59.3337,
          "longitude": 18.0662
        },
        "speed": 8,
        "speed_limit": 8.33
      })

    expect(leg.isSpeeding()).to.be.false

  })

  it('calculates distance', sinon.test(function(){

    let leg = new Leg({
        "timestamp": "2016-06-21T12:00:00.000Z",
        "position": {
          "latitude": 59.334,
          "longitude": 18.0667
        },
        "speed": 8,
        "speed_limit": 8.33
      },
      {
        "timestamp": "2016-06-21T12:00:25.000Z",
        "position": {
          "latitude": 59.3337,
          "longitude": 18.0662
        },
        "speed": 8,
        "speed_limit": 8.33
      })


    this.stub(SimpleDistanceProvider, 'getDistanceBetween', function () {
      return Promise.resolve(FAKE_DISTANCE_VALUE)
    })

    leg.getStats(SimpleDistanceProvider).then(function (data) {
      //console.log("Length = ",data);
      expect(data.distance).to.equal(FAKE_DISTANCE_VALUE)
      expect(data.duration).to.equal(25 * 1000)
      expect(data.speeding).to.be.false
      done()
    }, function (error) {
      assert.fail(error)
      done()
    })
  }))

})
