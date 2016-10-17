'use strict'

let roadtrip = require('./lib')
let fs = require('fs')

let filePath = './data/waypoints.json'
let provider = 'google'

function readFile(filename, enc) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, enc, function (err, res) {
      if (err) {
        reject(err)
      }
      else {
        resolve(res)
      }
    })
  })
}

function readJSON(filename) {
  return readFile(filename, 'utf8').then(function (res) {
    return JSON.parse(res)
  })
}

function processArgs(){

  if(process.argv.indexOf("-h") != -1){ //does our flag exist?

    console.log('Usage: node index -src <path> -p <provider>')
    console.log('-src Path to JSON file with waypoints')
    console.log('-p   "google" for distance calculations using Google Maps API, or "simple" for a math estimation')
    console.log('     "google" requires an environmental variable called GOOGLE_MAPS_API_KEY with a valid key as value')
    console.log('Example: node index -src ./data/waypoints.json -p google')
    process.exit(0)
  }

  if(process.argv.indexOf('-src') != -1){
    filePath = process.argv[process.argv.indexOf('-src') + 1]
  }

  if(process.argv.indexOf('-p') != -1){
    provider = process.argv[process.argv.indexOf('-p') + 1]

    if(provider != 'google' && provider != 'simple'){
      console.log('Invalid provider "' +provider+'". Use "google" or "simple".')
      process.exit(1)
    }
  }
}

// Process command line args
processArgs()

// Do the work
readJSON(filePath)
  .then((json)=> {
    console.log('Analyzing roadtrip "'+filePath+'" using "'+provider+'".')
    return roadtrip.analyze(json,provider)
  })
  .then((result)=> {
    console.log('RESULT:')
    console.log('Speeding Distance: ' + result.speeding.distance + ' meters')
    console.log('Speeding Duration: ' + result.speeding.duration+ ' seconds')
    console.log('Total Distance: ' + result.total.distance + ' meters')
    console.log('Total Duration: ' + result.total.duration+ ' seconds')
    process.exit(0)
  })
  .catch((err)=> {
    console.log('ERROR:')
    console.log('Failed processing roadtrip. ', err)
    process.exit(1)
  })