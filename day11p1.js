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

for (let y = 0; y < 297; y++) {
  for (let x = 0; x < 297; x++) {
    sum = grid[y * 300 + x] +
      grid[y * 300 + (x + 1)] +
      grid[y * 300 + (x + 2)] +
      grid[(y + 1) * 300 + x] +
      grid[(y + 1) * 300 + (x + 1)] +
      grid[(y + 1) * 300 + (x + 2)] +
      grid[(y + 2) * 300 + x] +
      grid[(y + 2) * 300 + (x + 1)] +
      grid[(y + 2) * 300 + (x + 2)]

    if (sum > largestTotalPower) {
      largestTotalPower = sum

      coordX = x
      coordY = y
    }
  }
}

console.log(`p1 ${coordX},${coordY}`)
