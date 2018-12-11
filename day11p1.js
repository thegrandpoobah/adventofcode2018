const fs = require('fs')

const input = 9221

const grid = []

for (let y = 0; y < 300; y++) {
  for (let x = 0; x < 300; x++) {
    let value = (x + 10) * y + input
    value *= x + 10
    if (value < 100) {
      value = 0
    } else {
      value = '' + value
      value = parseInt(value.charAt(value.length - 3), 10)
    }
    value -= 5

    grid[y * 300 + x] = value
  }
}

let largestTotalPower = Number.MIN_SAFE_INTEGER
let coordX = 0
let coordY = 0
let size = 1

for (let s = 1; s < 300; s++) {
  console.log(s)

  for (let y = 0; y < 300 - (s - 1); y++) {
    for (let x = 0; x < 300 - (s - 1); x++) {
      sum = 0

      for (let pY = 0; pY < s; pY++) {
        for (let pX = 0; pX < s; pX++) {
          sum += grid[(y + pY) * 300 + (x + pX)]
        }
      }

      if (sum > largestTotalPower) {
        largestTotalPower = sum

        coordX = x
        coordY = y
        size = s
      }
    }
  }
}

console.log(`p1 ${coordX},${coordY},${size}`)
