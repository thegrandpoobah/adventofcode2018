const fs = require('fs')

const GRIDSIZE_X = 50
const GRIDSIZE_Y = 50

const startingGrid = fs.readFileSync('day18input.txt', { encoding: 'utf8' }).split('\n').join('').split('')

function at(grid, x, y) {
    if (x < 0 || x >= GRIDSIZE_X) return
    if (y < 0 || y >= GRIDSIZE_Y) return

    return grid[y * GRIDSIZE_X + x]
}

const stencilPoints = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
    {x: -1, y: 0}, {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
]

function stencil(grid, ox, oy) {
    const adjacents = {'.': 0, '|': 0, '#': 0}

    stencilPoints.forEach(({x, y}) => {
        const value = at(grid, ox + x, oy + y)
        if (value) {
            adjacents[value]++
        }
    })

    // console.log(adjacents)

    return adjacents
}

function testOpenToTrees(grid, x, y) {
    return stencil(grid, x, y)['|'] >= 3
}

function testTreesToLumberyard(grid, x, y) {
    return stencil(grid, x, y)['#'] >= 3
}

function testLumberyardToLumberyard(grid, x, y) {
    const s = stencil(grid, x, y)
    return s['|'] >= 1 && s['#'] >= 1
}

function evolve(grid) {
    newGrid = grid.map(x => x)

    let gPtr = 0
    for (let y = 0; y < GRIDSIZE_Y; y++) {
        for (let x = 0; x < GRIDSIZE_X; x++) {
            switch (grid[gPtr]) {
                case '.':
                    if (testOpenToTrees(grid, x, y)) {
                        newGrid[gPtr] = '|'
                    }

                    break
                case '|':
                    if (testTreesToLumberyard(grid, x, y)) {
                        newGrid[gPtr] = '#'
                    }

                    break
                case '#':
                    if (!testLumberyardToLumberyard(grid, x, y)) {
                        newGrid[gPtr] = '.'
                    }
                    break
            }

            gPtr++
        }
    }

    return newGrid
}

let grid = startingGrid

const haveIever = new Map()

out:
for (let t = 0; t < Infinity; t++) {
    const nextGrid = evolve(grid)

    if (haveIever.has(nextGrid.join(''))) {
        const from = haveIever.get(nextGrid.join('')) // the first time we saw this
        const to = t // the current time
        const period = to - from // the long before we hit the loop
        const left = (1000000000 - from) % period

        for (let i = 0; i < left; i++) {
            grid = evolve(grid)
        }

        break out
    }

    haveIever.set(nextGrid.join(''), t)

    grid = nextGrid
}

let lumber = 0, trees = 0
let gPtr = 0
for (let y = 0; y < GRIDSIZE_Y; y++) {
    for (let x = 0; x < GRIDSIZE_X; x++) {
        switch (grid[gPtr]) {
            case '|':
                lumber++
                break
            case '#':
                trees++
                break
        }

        gPtr++
    }
}

console.log(lumber * trees)