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

let region = 0

for (let y = minYVal; y < maxYVal + 1; y++) {
  for (let x = minXVal; x < maxXVal + 1; x++) {
    const distance = points.reduce((accum, pt) => {
      return accum + (Math.abs(x - pt.x) + Math.abs(y - pt.y))
    }, 0)

    if (distance < 10000) {
      region++
    }
  }
}

console.log('p2', region)
