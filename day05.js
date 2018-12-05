const fs = require('fs')

const input = fs.readFileSync('day05input.txt', { encoding: 'utf8' })
// const input = fs.readFileSync('day05sample.txt', { encoding: 'utf8' })

function react (polymer) {
  let working
  let backBuffer = polymer

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

  return backBuffer.length
}

console.log('p1', react(input))

let shortest = input.length

for (let i = 0; i < 26; i++) {
  const lower = String.fromCharCode('a'.charCodeAt(0) + i)

  const modified = input.replace(new RegExp(`${lower}`, 'ig'), '')
  const reacted = react(modified)

  if (reacted < shortest) {
    shortest = reacted
  }
}

console.log('p2', shortest)
