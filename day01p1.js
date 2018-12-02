const fs = require('fs')

const input = fs.readFileSync('day01input.txt', { encoding: 'utf8' }).split('\n')

let start = 0

input.forEach((x) => {
  if (x.charAt(0) === '+') {
    start += parseInt(x.substr(1), 10)
  } else if (x.charAt(0) === '-') {
    start -= parseInt(x.substr(1), 10)
  }
})

console.log(`${start}`)
