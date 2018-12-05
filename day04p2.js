const BEGIN_SHIFT = 1
const FALLS_ASLEEP = 2
const WAKES_UP = 3

const fs = require('fs')

const input = fs.readFileSync('day04input.txt', { encoding: 'utf8' }).split('\n')

const events = input.map((x) => {
  const matches = x.match(/\[1518\-(\d*)\-(\d*) (\d*)\:(\d*)\] ((wakes up)|(falls asleep)|(Guard \#(\d*) (begins shift)))/)

  let event
  if (matches[10]) {
    event = BEGIN_SHIFT
  } else if (matches[7]) {
    event = FALLS_ASLEEP
  } else if (matches[6]) {
    event = WAKES_UP
  }

  return {
    guardId: parseInt(matches[9], 10),
    month: parseInt(matches[1], 10),
    day: parseInt(matches[2], 10),
    hour: parseInt(matches[3], 10),
    minute: parseInt(matches[4], 10),
    event
  }
})

events.sort((a, b) => {
  if (a.month === b.month) {
    return (a.minute + a.hour * 60 + a.day * 1440) - (b.minute + b.hour * 60 + b.day * 1440)
  } else {
    return a.month - b.month
  }
})

// back fill ids
let guardId = 0
events.forEach((x) => {
  if (x.event === BEGIN_SHIFT) {
    guardId = x.guardId
  } else {
    x.guardId = guardId
  }
})

const guardSleepTime = events.reduce((accum, x) => {
  switch (x.event) {
    case BEGIN_SHIFT:
      if (!accum[x.guardId]) {
        accum[x.guardId] = []
      }

      break
    case FALLS_ASLEEP:
      accum[x.guardId].push({
        asleep: x,
      })

      break
    case WAKES_UP:
      accum[x.guardId][accum[x.guardId].length - 1].awake = x

      break
  }

  return accum
}, {})

const sleepTracker = []
for (let i = 0; i < 60; i++) {
  sleepTracker[i] = {}
}

Object.keys(guardSleepTime).forEach((x) => {
  guardSleepTime[x].forEach((y) => {
    for (let z = y.asleep.minute; z < y.awake.minute; z++) {
      if (!sleepTracker[z][y.asleep.guardId]) {
        sleepTracker[z][y.asleep.guardId] = 0
      }
      sleepTracker[z][y.asleep.guardId]++
    }
  })
})

const { guardId: sleepyGuardId, minute } = sleepTracker.map((x) => {
  return Object.keys(x).reduce((accum, guardId) => {
    if (x[guardId] > accum.max) {
      accum.max = x[guardId]
      accum.guardId = guardId
    }

    return accum
  }, { guardId: 0, max: 0 })
}).reduce((accum, x, idx) => {
  if (x.max > accum.max) {
    accum.guardId = x.guardId
    accum.minute = idx
    accum.max = x.max
  }

  return accum
}, { guardId: 0, max: 0, minute: 0 })

console.log('p2', sleepyGuardId * minute)
