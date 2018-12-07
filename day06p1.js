const fs = require('fs')

const input = fs.readFileSync('day06input.txt', { encoding: 'utf8' }).split('\n')
// const input = fs.readFileSync('day06sample-2.txt', { encoding: 'utf8' }).split('\n')

const points = input.map((x) => {
  const parts = x.match(/(\d*), (\d*)/)

  return {
    x: parseInt(parts[1], 10),
    y: parseInt(parts[2], 10)
  }
})

let minXVal = Number.MAX_SAFE_INTEGER
let maxXVal = Number.MIN_SAFE_INTEGER
let minYVal = Number.MAX_SAFE_INTEGER
let maxYVal = Number.MIN_SAFE_INTEGER

points.forEach((pt) => {
  if (pt.x < minXVal) {
    minXVal = pt.x
  }
  if (pt.x > maxXVal) {
    maxXVal = pt.x
  }

  if (pt.y < minYVal) {
    minYVal = pt.y
  }
  if (pt.y > maxYVal) {
    maxYVal = pt.y
  }
})

const winners = []

for (let i = 0; i < points.length; i++) {
  winners[i] = 0
}

for (let y = minYVal; y < maxYVal + 1; y++) {
  for (let x = minXVal; x < maxXVal + 1; x++) {
    const dists = points.map((pt, idx) => {
      return {
        index: idx,
        distance: Math.abs(x - pt.x) + Math.abs(y - pt.y)
      }
    }).sort((a, b) => a.distance - b.distance)

    if (dists[0].distance === dists[1].distance) {
      continue
    }

    if (x === minXVal || x === maxXVal || y === minYVal || y === maxYVal) {
      points[dists[0].index].infinite = true

      winners[dists[0].index] = 0
    }

    if (points[dists[0].index].infinite) {
      continue
    }

    winners[dists[0].index]++
  }
}

console.log('p1', Math.max(...winners))
