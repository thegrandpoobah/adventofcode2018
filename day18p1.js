const fs = require('fs')

const GRIDSIZE_X = 50
const GRIDSIZE_Y = 50

const startingGrid = fs.readFileSync('day18input.txt', { encoding: 'utf8' }).split('\n').map(x => x.split(''))

function at(grid, x, y) {
    if (x < 0 || x >= GRIDSIZE_X) return
    if (y < 0 || y >= GRIDSIZE_Y) return

    return grid[y][x]
}

function stencil(grid, x, y) {
    arr = [
        at(grid, x - 1, y - 1),
        at(grid, x, y - 1),
        at(grid, x + 1, y - 1),
        at(grid, x - 1, y),
        at(grid, x + 1, y),
        at(grid, x - 1, y + 1),
        at(grid, x, y + 1),
        at(grid, x + 1, y + 1)
    ]

    return arr.filter(x => x !== undefined).reduce((accum, x) => {
        if (!accum[x]) {
            accum[x] = 0
        }
        accum[x]++

        return accum
    }, {})
}

function testOpenToTrees(grid, x, y) {
    return stencil(grid, x, y)['|'] >= 3
}

function testTreesToLumberyard(grid, x, y) {
    return stencil(grid, x, y)['#'] >= 3
}

function testLumberyardToLumberyard(grid, x, y) {
    return stencil(grid, x, y)['|'] >= 1 && stencil(grid, x, y)['#'] >= 1
}

function evolve(grid) {
    const newGrid = []

    for (let y = 0; y < GRIDSIZE_Y; y++) {
        newGrid.push([])

        for (let x = 0; x < GRIDSIZE_X; x++) {
            switch (grid[y][x]) {
                case '.':
                    if (testOpenToTrees(grid, x, y)) {
                        newGrid[y][x] = '|'
                    } else {
                        newGrid[y][x] = '.'
                    }

                    break
                case '|':
                    if (testTreesToLumberyard(grid, x, y)) {
                        newGrid[y][x] = '#'
                    } else {
                        newGrid[y][x] = '|'
                    }

                    break
                case '#':
                    if (testLumberyardToLumberyard(grid, x, y)) {
                        newGrid[y][x] = '#'
                    } else {
                        newGrid[y][x] = '.'
                    }

                    break
            }
        }
    }

    return newGrid
}

let workingGrid = startingGrid

for (let t = 0; t < 10; t++) {
    workingGrid = evolve(workingGrid)    
}

let lumber = 0, trees = 0

for (let y = 0; y < GRIDSIZE_Y; y++) {
    for (let x = 0; x < GRIDSIZE_X; x++) {
        switch (workingGrid[y][x]) {
            case '|':
                lumber++
                break
            case '#':
                trees++
                break
        }
    }
}

console.log(lumber * trees)