const ITERATIONS = 50000000000

// through trial and error, we see that after the 120th iteration
// this pattern is what is repeated with an offset of 49 + (ITERATIONS - 120) characters from position 0
let workingSet = '#...............#.........................#....#....#.......#.......#....#.....#....#.......#.......#.......#.....#....#....#.......#....#.......#.......#.......#.....#'

let sum = 0
for (let x = 0; x < workingSet.length; x++) {
  if (workingSet.charAt(x) === '#') {
    sum += x + 49 + (ITERATIONS - 120)
  }
}

console.log('p2', sum)
