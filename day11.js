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

function calcGrid (size) {
  let largestTotalPower = Number.MIN_SAFE_INTEGER
  let coordX = 0
  let coordY = 0

  for (let y = 0; y < 300 - (size - 1); y++) {
    for (let x = 0; x < 300 - (size - 1); x++) {
      sum = 0

      for (let pY = 0; pY < size; pY++) {
        for (let pX = 0; pX < size; pX++) {
          sum += grid[(y + pY) * 300 + (x + pX)]
        }
      }

      if (sum > largestTotalPower) {
        largestTotalPower = sum

        coordX = x
        coordY = y
      }
    }
  }

  return {
    x: coordX,
    y: coordY,
    largestTotalPower: largestTotalPower
  }
}

const p1 = calcGrid(3)

console.log(`p1 ${p1.x},${p1.y}`)

let largestTotalPower = Number.MIN_SAFE_INTEGER
let coordX = 0
let coordY = 0
let size = 0

for (let s = 1; s < 300; s++) {
  console.log(s)

  const p2 = calcGrid(s)

  if (p2.largestTotalPower > largestTotalPower) {
    largestTotalPower = p2.largestTotalPower
    coordX = p2.x
    coordY = p2.y
    size = s
  }
}

console.log(`p2 ${coordX},${coordY},${size}`)
