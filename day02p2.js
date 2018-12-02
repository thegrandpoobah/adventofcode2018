const fs = require('fs')

const input = fs.readFileSync('day02input.txt', { encoding: 'utf8' }).split('\n')

for (let i = 0; i < input.length; i++) {
  for (let j = i + 1; j < input.length; j++) {
    const a = input[i]
    const b = input[j]

    let differences = 0
    for (let x = 0; x < a.length; x++) {
      if (a[x] !== b[x]) {
        differences++
      }
    }

    if (differences === 1) {
      let same = ''
      for (let x = 0; x < a.length; x++) {
        if (a[x] === b[x]) {
          same += a[x]
        }
      }
      console.log(same)
    }
  }
}