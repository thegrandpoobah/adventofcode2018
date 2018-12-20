const input = '864801'
// const input = '59414'

const recipes = [3, 7]
let elf1Pos = 0
let elf2Pos = 1
let last6 = [0, 0, 0, 0, 0, 0]

let iteration = 0

function updateLastSix () {
  last6[0] = recipes[Math.max(recipes.length - input.length, 0)]
  last6[1] = recipes[Math.max(recipes.length - input.length + 1, 0)]
  last6[2] = recipes[Math.max(recipes.length - input.length + 2, 0)]
  last6[3] = recipes[Math.max(recipes.length - input.length + 3, 0)]
  last6[4] = recipes[Math.max(recipes.length - input.length + 4, 0)]
  last6[5] = recipes[Math.max(recipes.length - input.length + 5, 0)]
}

while (last6.join('') !== input) {
  iteration++

  const newScore = recipes[elf1Pos] + recipes[elf2Pos]
  if (newScore >= 10) {
    recipes.push(1)

    updateLastSix()
    if (last6.join('') === input) {
      break
    }

    recipes.push(newScore - 10)
  } else {
    recipes.push(newScore)
  }

  updateLastSix()

  elf1Pos = (elf1Pos + 1 + recipes[elf1Pos]) % recipes.length
  elf2Pos = (elf2Pos + 1 + recipes[elf2Pos]) % recipes.length
}

console.log('p2', recipes.length - input.length)
