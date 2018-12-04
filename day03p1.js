const fs = require('fs')

const input = fs.readFileSync('day03input.txt', { encoding: 'utf8' }).split('\n')

const claims = input.map((x) => {
  const parts = x.match(/\#(\d*) \@ (\d*),(\d*)\: (\d*)x(\d*)/)

  return {
    id: parseInt(parts[1], 10),
    left: parseInt(parts[2], 10),
    top: parseInt(parts[3], 10),
    width: parseInt(parts[4], 10),
    height: parseInt(parts[5], 10)
  }
})

const space = []
for (let i = 0; i < 1000 * 1000; i++) {
  space[i] = 0;
}

claims.forEach((x) => {
  for (let i = 0; i < x.width; i++) {
    for (let j = 0; j < x.height; j++) {
      space[(x.top + j) * 1000 + (x.left + i)]++
    }
  }
})

const res = space.reduce((accum, x) => {
  if (x > 1) {
    return accum + 1
  }
  return accum
}, 0)

console.log(`p1 ${res}`)
