const fs = require('fs')

const input = fs.readFileSync('day05input.txt', { encoding: 'utf8' })
// const input = fs.readFileSync('day05sample.txt', { encoding: 'utf8' })

let working
let backBuffer = input

while (working !== backBuffer) {
  working = backBuffer
  backBuffer = ''

  for (let i = 0; i < working.length; i++) {
    if (i === working.length - 1) {
      backBuffer += working.charAt(i)

      continue
    }

    if (working.charAt(i).toLowerCase() === working.charAt(i + 1).toLowerCase() && working.charAt(i) !== working.charAt(i + 1)) {
      i++

      continue
    }

    backBuffer += working.charAt(i)
  }
}

console.log(backBuffer.length)
