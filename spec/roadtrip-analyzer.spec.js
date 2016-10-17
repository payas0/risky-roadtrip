'use strict'

let sinon = require('sinon')
let chai = require('chai')
let expect = chai.expect

let RoadTripAnalyzer = require('../lib/roadtrip-analyzer')
let Leg = require('../lib/leg')

let waypoints = [{
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
  }];

describe('RoadtripAnalyzer', () => {

  it('returns sum without speeding', sinon.test(function (done) {

    const expectedResult = {
      total: {distance: 1,duration: 1 },
      speeding: {distance: 0,duration: 0}
    }

    this.stub(Leg.prototype, 'getStats', function () {
      return Promise.resolve({distance: 1, duration: 1000, speeding: false})
    })

    RoadTripAnalyzer.analyze(waypoints).then((data)=> {
      expect(data).to.eql(expectedResult)
      done()
    }).catch(err=> {
      assert.fail(err)
      done()
    })

  }))

  it('returns sum with speeding', sinon.test(function (done) {

    const expectedResult = {
      total: {distance: 1,duration: 1 },
      speeding: {distance: 1,duration: 1}
    }

    this.stub(Leg.prototype, 'getStats', function () {
      return Promise.resolve({distance: 1, duration: 1000, speeding: true})
    })

    RoadTripAnalyzer.analyze(waypoints,"google").then((data)=> {
      expect(data).to.eql(expectedResult)
      done()
    }).catch(err=> {
      assert.fail(err)
      done()
    })

  }))

  it('throws exception', sinon.test(function (done) {

    this.stub(Leg.prototype, 'getStats', function () {
      return Promise.reject()
    })

    RoadTripAnalyzer.analyze(waypoints).then((data)=> {
      assert.fail()
      done()
    }).catch(err=> {
      //expected
      done()
    })

  }))

})
