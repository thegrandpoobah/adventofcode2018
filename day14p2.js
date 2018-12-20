// const input = '864801'
const input = '59414'

const recipes = [3, 7]
let elf1Pos = 0
let elf2Pos = 1
let last6 = []

let iteration = 0

while (last6.join('') !== input) {
  iteration++
  if (iteration % 1000 === 0) {
    console.log(iteration)
  }

  const newScore = recipes[elf1Pos] + recipes[elf2Pos]
  if (newScore >= 10) {
    recipes.push(1)
    recipes.push(newScore - 10)
  } else {
    recipes.push(newScore)
  }

  last6 = recipes.slice(Math.max(recipes.length - input.length, 0))

  elf1Pos = (elf1Pos + 1 + recipes[elf1Pos]) % recipes.length
  elf2Pos = (elf2Pos + 1 + recipes[elf2Pos]) % recipes.length
}

console.log('p2', recipes.length - input.length)
