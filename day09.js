const fs = require('fs')

const P2MULIPLIER = 100 // use 1 to solve part 1, 100 to solve part 2

const input = {
  players: 418,
  marbles: 71339 * P2MULIPLIER
}
// const input = {
//   players: 10,
//   marbles: 1618
// }

function addMarble (f, value) {
  const c = {
    next: null,
    prev: null,
    value: value
  }

  const a = f
  const b = f.next

  a.next = c

  c.prev = a
  c.next = b
  b.prev = c

  return c
}

function removeMarble (f) {
  a = f.prev
  b = f
  c = f.next

  a.next = c
  c.prev = a

  return c
}

const field = {
  next: null,
  prev: null,
  value: 0
}
field.next = field
field.prev = field

const playerScores = []
for (let i = 0; i < input.players; i++) {
  playerScores[i] = 0
}

let currentPlayer = 0
let currentMarblePtr = field

for (let i = 1; i < input.marbles + 1; i++) {
  if (i % 23 === 0) {
    for (let j = 0; j < 7; j++) {
      currentMarblePtr = currentMarblePtr.prev
    }

    playerScores[currentPlayer] += i + currentMarblePtr.value

    currentMarblePtr = removeMarble(currentMarblePtr)
  } else {
    currentMarblePtr = currentMarblePtr.next

    currentMarblePtr = addMarble(currentMarblePtr, i)
  }

  currentPlayer = (currentPlayer + 1) % input.players
}

console.log(Math.max(...playerScores))
