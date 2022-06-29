// const express = require("express")

let requestStore = {}
// { ip : { minuteFloor: count } } 
const LIMIT = 2

function getBucket(ip, window) {
  if (!requestStore[ip] || !requestStore[ip][window]) {
    initializeBucket(ip, window)
  }
  return requestStore[ip][window]
}

function initializeBucket(ip, window) {
  if (!requestStore[ip] || !requestStore[ip][window]) {
    if (!requestStore[ip]) {
      let bucket = {}
      bucket[window] = 0
      requestStore[ip] = bucket
    }
    else requestStore[ip][window] = 0
  }
}

function addRequest(ip, window) {
  // return false
  requestStore[ip][window]++
}
// function verifyRate(req) {}

// module.exports = rateLimiter;

function slidingWindow(ip, now) {
  // floor = minuteBucket
  // current allowance at Now = 
  //      LIMIT - (proportion of prev (getMinutes - 1 || 0) + current)
  const minuteBucket = now.getMinutes()
  const prevProportion = 1 - ((1 + now.getSeconds()) / 60)
  const prevReqCount = getBucket(ip, minuteBucket - 1)
  const currentReqCount = getBucket(ip, minuteBucket)
  const currentAllocation = LIMIT - (prevProportion * prevReqCount) - currentReqCount

  console.log(currentAllocation)
  if (currentAllocation > 0) return true
  return false
}

exports.rateLimiter = (req, res, next) => {
  const ip = req.ip
  const now = new Date()

  const valid = slidingWindow(ip, now)
  console.log(requestStore)
  
  if (!valid) {
    return res.status('404').send("bad request")
  } 
  addRequest(ip, now.getMinutes())
  next()
}