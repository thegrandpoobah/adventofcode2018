const input = 864801
// const input = 2018

const recipes = [3, 7]
let elf1Pos = 0
let elf2Pos = 1

while (recipes.length < input + 10) {
  const newScore = recipes[elf1Pos] + recipes[elf2Pos]
  if (newScore >= 10) {
    recipes.push(1)
    recipes.push(newScore - 10)
  } else {
    recipes.push(newScore)
  }

  elf1Pos = (elf1Pos + 1 + recipes[elf1Pos]) % recipes.length
  elf2Pos = (elf2Pos + 1 + recipes[elf2Pos]) % recipes.length

  // console.log(recipes)
}

console.log('p1', recipes.slice(input).join(''))
