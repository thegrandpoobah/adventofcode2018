const CELL_TYPE_WALL = 1
const CELL_TYPE_EMPTY = 2
const CELL_TYPE_GOBLIN = 3
const CELL_TYPE_ELF = 4

const DEFAULT_ATTACK_POWER = 3
const DEFAULT_HITPOINTS = 200

const fs = require('fs')

// const input = fs.readFileSync('day15sample-5.txt', { encoding: 'utf8' }).split('\n')
const input = fs.readFileSync('day15input.txt', { encoding: 'utf8' }).split('\n')

function initialize (input) {
  return input.map((row, yIdx) => {
    return row.split('').map((c, xIdx) => {
      switch (c) {
        case '#':
          return {
            type: CELL_TYPE_WALL,
            x: xIdx,
            y: yIdx
          }
        case '.':
          return {
            type: CELL_TYPE_EMPTY,
            x: xIdx,
            y: yIdx
          }
        case 'G':
          return {
            type: CELL_TYPE_GOBLIN,
            attackPower: DEFAULT_ATTACK_POWER,
            hp: DEFAULT_HITPOINTS,
            x: xIdx,
            y: yIdx
          }
        case 'E':
          return {
            type: CELL_TYPE_ELF,
            attackPower: DEFAULT_ATTACK_POWER,
            hp: DEFAULT_HITPOINTS,
            x: xIdx,
            y: yIdx
          }
      }
    })
  })
}

function renderGrid (grid) {
  grid.forEach((row) => {
    row.forEach((c) => {
      switch (c.type) {
        case CELL_TYPE_EMPTY:
          process.stdout.write('.')
          break
        case CELL_TYPE_WALL:
          process.stdout.write('#')
          break
        case CELL_TYPE_GOBLIN:
          process.stdout.write('G')
          break
        case CELL_TYPE_ELF:
          process.stdout.write('E')
          break
      }
    })

    process.stdout.write('\n')
  })
}

function allPlayers (grid) {
  const players = []

  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.type === CELL_TYPE_ELF || cell.type === CELL_TYPE_GOBLIN) {
        players.push(cell)
      }
    })
  })

  return players
}

function allElves (grid) {
  return allPlayers(grid).filter((cell) => cell.type === CELL_TYPE_ELF)
}

function allGoblins (grid) {
  return allPlayers(grid).filter((cell) => cell.type === CELL_TYPE_GOBLIN)
}

function getCell (grid, x, y) {
  return grid[y][x]
}

function setCell (grid, x, y, v) {
  grid[y][x] = v
}

// find the shortest path from player p1 to player p2 on grid
function shortestPath (grid, p1, p2) {
  let shortestPath

  const memo = {}
  memo[`${p1.x}:${p1.y}`] = [] // the self square doesn't need a traveral path

  const searchStack = [
    { x: p1.x + 1, y: p1.y, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x - 1, y: p1.y, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x, y: p1.y + 1, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x, y: p1.y - 1, path: [{ x: p1.x, y: p1.y }] }
  ]

  while (searchStack.length > 0) {
    const elem = searchStack.shift()

    const cell = getCell(grid, elem.x, elem.y)

    if (cell.x === p2.x && cell.y === p2.y) {
      // found a way of getting to the target!

      if (!shortestPath || shortestPath.length > elem.path.length + 1) {
        // the path is shorter!
        shortestPath = [...elem.path, { x: p2.x, y: p2.y }]
      }
    }

    if (cell.type !== CELL_TYPE_EMPTY) {
      // only empty cells can be traversed
      // console.log('obstruction')
      continue
    }

    const memoVal = memo[`${elem.x}:${elem.y}`]
    if (!memoVal || memoVal.length > elem.path.length) {
      memo[`${elem.x}:${elem.y}`] = elem.path

      // console.log(`discovered shorter path to ${elem.x},${elem.y}`)
      // console.log(elem.path)

      // only if you found a shorter path to this cell should you continue
      // because otherwise, you've already built the shortest path and can stop
      searchStack.push(...[
        { x: elem.x - 1, y: elem.y, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x + 1, y: elem.y, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x, y: elem.y - 1, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x, y: elem.y + 1, path: [...elem.path, { x: elem.x, y: elem.y }] }
      ])
    }
  }

  return shortestPath
}

const grid = initialize(input)

let stoppedAt
for (let iteration = 0; ; iteration++) {
  console.log(`iteration ${iteration}`)

  renderGrid(grid)

  let anyActions = false

  console.log(allGoblins(grid))
  console.log(allElves(grid))

  allPlayers(grid).forEach((p1) => {
    let paths
    let foes

    if (p1.type === CELL_TYPE_ELF) {
      foes = allGoblins(grid)
    } else if (p1.type === CELL_TYPE_GOBLIN) {
      foes = allElves(grid)
    } else {
      // this player died mid-round
      return
    }

    if (foes.length === 0) {
      stoppedAt = iteration

      return
    }

    paths = foes.map((p2) => shortestPath(grid, p1, p2))

    if (!paths) {
      console.log('no more enemies', iteration)

      return
    }

    const traversalPath = paths.reduce((accum, path) => {
      if (!path) {
        // no way to get to this enemy, so just return whatever we have right now
        return accum
      }

      if (!accum) {
        // don't have an enemy considered right now, so lets just return this one
        return path
      }

      if (path.length < accum.length) {
        // this enemy is closer, so lets use this one
        return path
      }

      if (path.length === 2 && path.length === accum.length) {
        // the enemies are the same distance, so lets use HP tie breaker
        // console.log('tie breaker', accum, path)
        const enemy1Coords = accum[accum.length - 1]
        const enemy2Coords = path[path.length - 1]

        const enemy1 = getCell(grid, enemy1Coords.x, enemy1Coords.y)
        const enemy2 = getCell(grid, enemy2Coords.x, enemy2Coords.y)
        console.log(enemy1, enemy2)

        if (enemy2.hp < enemy1.hp) {
          return path
        }
      }

      // the current enemy is closer or has fewer hit points, so lets just use that one
      return accum
    }, undefined)

    if (!traversalPath) {
      // this player has no action at this point
      console.log(p1, 'cannot do anything')

      return
    }

    if (traversalPath.length > 2) {
      // we need to move
      // movements.push(traversalPath)

      const [p1Coords, targetCoords] = traversalPath
      const player = getCell(grid, p1Coords.x, p1Coords.y)

      setCell(grid, p1Coords.x, p1Coords.y, {
        x: p1Coords.x,
        y: p1Coords.y,
        type: CELL_TYPE_EMPTY
      })

      player.x = targetCoords.x
      player.y = targetCoords.y
      setCell(grid, targetCoords.x, targetCoords.y, player)

      traversalPath.shift()
    }

    if (traversalPath.length === 2) {
      // traversalPath[0] fights traveralPath[1]
      const [p1Coords, p2Coords] = traversalPath

      console.log(`battle ${p1Coords.x},${p1Coords.y} with ${p2Coords.x},${p2Coords.y}`)

      const p1 = getCell(grid, p1Coords.x, p1Coords.y)
      const p2 = getCell(grid, p2Coords.x, p2Coords.y)

      p2.hp -= p1.attackPower

      console.log('hp at', p2.hp, p1.attackPower)

      if (p2.hp < 0) {
        p2.type = CELL_TYPE_EMPTY
      }
    }
  })

  if (stoppedAt) {
    break
  }
  // movements.forEach((movement) => {
  //   const [p1Coords, targetCoords] = traversalPath

  //   setCell(grid, p1Coords.x, p1Coords.y)
  // })
}

console.log('stopped at', stoppedAt)
let sumHp = allPlayers(grid).reduce((accum, player) => {
  return accum + player.hp
}, 0)
console.log('sum hp', sumHp)
console.log(sumHp * stoppedAt)
