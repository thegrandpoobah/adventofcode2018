const fs = require('fs')

const input = fs.readFileSync('day01input.txt', { encoding: 'utf8' }).split('\n')

let val = 0
const didIsee = {}
let found = false

for (; ;) {
  input.forEach((x) => {
    if (x.charAt(0) === '+') {
      val += parseInt(x.substr(1), 10)
    } else if (x.charAt(0) === '-') {
      val -= parseInt(x.substr(1), 10)
    }

    if (!didIsee[val]) {
      didIsee[val] = true
    } else if (!found) {
      console.log(val)

      found = true
    }
  })

  if (found) {
    break
  }
}
