const CELL_TYPE_CLAY = 1
const CELL_TYPE_WATER = 2
const CELL_TYPE_EMPTY = 3

const FLOW_DIRECTION_DOWN = 1
const FLOW_DIRECTION_ACROSS = 2
const FLOW_DIRECTION_STABLE = 3

const fs = require('fs')

let xBoundaryMin = Number.MAX_SAFE_INTEGER
let yBoundaryMin = Number.MAX_SAFE_INTEGER
let xBoundaryMax = Number.MIN_SAFE_INTEGER
let yBoundaryMax = Number.MIN_SAFE_INTEGER

const input = fs.readFileSync('day17input.txt', { encoding: 'utf8' }).split('\n')
// const input = fs.readFileSync('day17sample.txt', { encoding: 'utf8' }).split('\n')

const clayCells = input.map((r) => {
  const parts = r.match(/([xy])\=(\d*), [xy]\=(\d*)\.\.(\d*)/)

  if (parts[1] === 'x') {
    return {
      x: parseInt(parts[2], 10),
      yStart: parseInt(parts[3], 10),
      yEnd: parseInt(parts[4], 10)
    }
  } else if (parts[1] === 'y') {
    return {
      y: parseInt(parts[2], 10),
      xStart: parseInt(parts[3], 10),
      xEnd: parseInt(parts[4], 10)
    }
  }
}).reduce((accum, vein) => {
  if (vein.x) {
    for (let y = vein.yStart; y < vein.yEnd + 1; y++) {
      accum.push({ x: vein.x, y, type: CELL_TYPE_CLAY })
    }
  } else if (vein.y) {
    for (let x = vein.xStart; x < vein.xEnd + 1; x++) {
      accum.push({ x, y: vein.y, type: CELL_TYPE_CLAY })
    }
  }

  return accum
}, [])

function setCell (obj, cell) {
  obj[`${cell.x}:${cell.y}`] = cell
}

function getCell (obj, x, y) {
  const k = obj[`${x}:${y}`]
  if (!k) {
    return { x, y, type: CELL_TYPE_EMPTY }
  }
  return k
}

let grid = {}

clayCells.forEach((cell) => {
  setCell(grid, cell)
})

function cellHasClay (x, y) {
  return getCell(grid, x, y).type === CELL_TYPE_CLAY
}

function cellHasWater (x, y) {
  return getCell(grid, x, y).type === CELL_TYPE_WATER
}

Object.keys(grid).forEach((key) => {
  const cell = grid[key]

  if (cell.x < xBoundaryMin) {
    xBoundaryMin = cell.x
  }
  if (cell.x > xBoundaryMax) {
    xBoundaryMax = cell.x
  }
  if (cell.y < yBoundaryMin) {
    yBoundaryMin = cell.y
  }
  if (cell.y > yBoundaryMax) {
    yBoundaryMax = cell.y
  }
})

setCell(grid, {
  x: 500,
  y: yBoundaryMin,
  type: CELL_TYPE_WATER,
  flowDirection: FLOW_DIRECTION_DOWN,
  overflow: true
})

function renderGrid (g) {
  for (let y = yBoundaryMin; y < yBoundaryMax + 1; y++) {
    for (let x = xBoundaryMin; x < xBoundaryMax + 1; x++) {
      const v = getCell(g, x, y)
      if (v.type === CELL_TYPE_EMPTY) {
        process.stdout.write('.')
      } else if (v.type === CELL_TYPE_CLAY) {
        process.stdout.write('#')
      } else if (v.type === CELL_TYPE_WATER && v.overflow) {
        process.stdout.write('|')
      } else if (v.type === CELL_TYPE_WATER) {
        process.stdout.write('~')
      }
    }
    process.stdout.write('\n')
  }
}

let backBuffer = [{ x: 500, y: yBoundaryMin }]
let workingSet = []

for (let i = 0; backBuffer.length > 0; i++) {
  workingSet = backBuffer
  backBuffer = []

  workingSet.forEach((waterCell) => {
    const thisCell = grid[`${waterCell.x}:${waterCell.y}`]

    switch (thisCell.flowDirection) {
      case FLOW_DIRECTION_DOWN:
        if (thisCell.y > yBoundaryMax) {
          // out of bounds in the bottom direction
          stopFlag = true
          break
        }

        if (cellHasClay(thisCell.x, thisCell.y + 1)) {
          // if there is clay beneath, then the water needs to go across
          setCell(grid, {
            x: thisCell.x,
            y: thisCell.y,
            type: CELL_TYPE_WATER,
            flowDirection: FLOW_DIRECTION_ACROSS,
            overflow: true
          })

          backBuffer.push({ x: thisCell.x, y: thisCell.y })
        } else {
          setCell(grid, {
            x: thisCell.x,
            y: thisCell.y,
            type: CELL_TYPE_WATER,
            flowDirection: FLOW_DIRECTION_DOWN,
            overflow: true
          })

          setCell(grid, {
            x: thisCell.x,
            y: thisCell.y + 1,
            type: CELL_TYPE_WATER,
            flowDirection: FLOW_DIRECTION_DOWN,
            overflow: true
          })

          backBuffer.push({ x: thisCell.x, y: thisCell.y + 1 })
        }

        break
      case FLOW_DIRECTION_ACROSS:
        const addedAcross = [{ x: thisCell.x, y: thisCell.y }]

        setCell(grid, {
          x: thisCell.x,
          y: thisCell.y,
          type: CELL_TYPE_WATER,
          flowDirection: FLOW_DIRECTION_STABLE
        })

        let hasLeftBorder = false
        for (let nx = thisCell.x - 1; nx > xBoundaryMin - 10; nx--) {
          if (cellHasClay(nx, thisCell.y)) {
            hasLeftBorder = true

            break
          }

          const { type, flowDirection } = getCell(grid, nx, thisCell.y + 1)

          if (type === CELL_TYPE_CLAY || (type === CELL_TYPE_WATER && flowDirection !== FLOW_DIRECTION_DOWN)) {
            // if there is clay or water underneath, then keep going across
            setCell(grid, {
              x: nx,
              y: thisCell.y,
              type: CELL_TYPE_WATER,
              flowDirection: FLOW_DIRECTION_ACROSS
            })

            addedAcross.push({ x: nx, y: thisCell.y })
          } else {
            // nothing underneath, so now go down
            setCell(grid, {
              x: nx,
              y: thisCell.y,
              type: CELL_TYPE_WATER,
              flowDirection: FLOW_DIRECTION_DOWN
            })

            backBuffer.push({ x: nx, y: thisCell.y })
            addedAcross.push({ x: nx, y: thisCell.y })

            break
          }
        }

        let hasRightBorder = false
        for (let nx = thisCell.x + 1; nx < xBoundaryMax + 10; nx++) {
          if (cellHasClay(nx, thisCell.y)) {
            hasRightBorder = true

            break
          }

          const { type, flowDirection } = getCell(grid, nx, thisCell.y + 1)

          if (type === CELL_TYPE_CLAY || (type === CELL_TYPE_WATER && flowDirection !== FLOW_DIRECTION_DOWN)) {
            // if there is clay underneath, then keep going across
            setCell(grid, {
              x: nx,
              y: thisCell.y,
              type: CELL_TYPE_WATER,
              flowDirection: FLOW_DIRECTION_ACROSS
            })
            addedAcross.push({ x: nx, y: thisCell.y })
          } else {
            // nothing underneath, so now go down
            setCell(grid, {
              x: nx,
              y: thisCell.y,
              type: CELL_TYPE_WATER,
              flowDirection: FLOW_DIRECTION_DOWN
            })

            backBuffer.push({ x: nx, y: thisCell.y })
            addedAcross.push({ x: nx, y: thisCell.y })

            break
          }
        }

        if (hasLeftBorder && hasRightBorder) {
          setCell(grid, {
            x: thisCell.x,
            y: thisCell.y - 1,
            type: CELL_TYPE_WATER,
            flowDirection: FLOW_DIRECTION_ACROSS
          })

          backBuffer.push({ x: thisCell.x, y: thisCell.y - 1 })
        } else {
          addedAcross.forEach((c) => {
            grid[`${c.x}:${c.y}`].overflow = true
          })
        }

        break
    }
  })
}

const waterCells = Object.keys(grid).reduce((accum, key) => {
  if (grid[key].type === CELL_TYPE_WATER) {
    if (grid[key].y < yBoundaryMin || grid[key].y > yBoundaryMax) {
      return accum
    }

    return accum + 1
  }
  return accum
}, 0)

console.log('p1', waterCells)

const pooledCells = Object.keys(grid).reduce((accum, key) => {
  if (grid[key].type === CELL_TYPE_WATER && !grid[key].overflow) {
    if (grid[key].y < yBoundaryMin || grid[key].y > yBoundaryMax) {
      return accum
    }

    return accum + 1
  }
  return accum
}, 0)

console.log('p2', pooledCells)
