const fs = require('fs')

const input = fs.readFileSync('day02input.txt', { encoding: 'utf8' }).split('\n')

let twos = 0
let threes = 0

input.forEach((x) => {
  const count = {}

  for (let i = 0; i < x.length; i++) {
    if (!count[x.charAt(i)]) {
      count[x.charAt(i)] = 0
    }
    count[x.charAt(i)]++
  }

  let has2 = false
  let has3 = false

  Object.keys(count).forEach((x) => {
    if (count[x] === 2) {
      has2 = true
    } else if (count[x] === 3) {
      has3 = true
    }
  })

  if (has2) {
    twos++
  }
  if (has3) {
    threes++
  }
})

console.log(twos * threes)
