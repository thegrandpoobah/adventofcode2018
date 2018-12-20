const CELL_TYPE_WALL = 1
const CELL_TYPE_EMPTY = 2
const CELL_TYPE_GOBLIN = 3
const CELL_TYPE_ELF = 4

const DEFAULT_ATTACK_POWER = 3
const DEFAULT_HITPOINTS = 200

const fs = require('fs')

function anyKey () {
  var fd = fs.openSync("/dev/stdin", "rs")
  fs.readSync(fd, new Buffer(1), 0, 1)
  fs.closeSync(fd)
}

// const input = fs.readFileSync('day15sample-5.txt', { encoding: 'utf8' }).split('\n')
const input = fs.readFileSync(process.argv[2], { encoding: 'utf8' }).split('\n')

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
    const players = []

    row.forEach((c) => {
      switch (c.type) {
        case CELL_TYPE_EMPTY:
          process.stdout.write('.')
          break
        case CELL_TYPE_WALL:
          process.stdout.write('#')
          break
        case CELL_TYPE_GOBLIN:
          players.push(`G(${c.hp})`)
          process.stdout.write('G')
          break
        case CELL_TYPE_ELF:
          players.push(`E(${c.hp})`)
          process.stdout.write('E')
          break
      }
    })

    process.stdout.write('\t')
    process.stdout.write(players.join(','))

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

function pathSortFunction (p1, p2) {
  let c = p1.length - p2.length
  if (c === 0) {
    let offset
    if (p1.length === 1) {
      offset = 1
    } else {
      offset = 2
    }
    c = p1[p1.length - offset].y - p2[p2.length - offset].y
    if (c === 0) {
      c = p1[p1.length - offset].x - p2[p2.length - offset].x
      if (c === 0) {
        c = p1[0].y - p2[0].y
        if (c === 0) {
          c = p1[0].x - p2[0].x
        }
      }
    }
  }
  return c
}

// find the shortest path from player p1 to player p2 on grid
function shortestPath (grid, p1, p2) {
  let paths = []

  const memo = {}
  memo[`${p1.x}:${p1.y}`] = [] // the self square doesn't need a traversal path

  const searchQueue = [
    { x: p1.x, y: p1.y - 1, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x - 1, y: p1.y, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x + 1, y: p1.y, path: [{ x: p1.x, y: p1.y }] },
    { x: p1.x, y: p1.y + 1, path: [{ x: p1.x, y: p1.y }] }
  ]

  while (searchQueue.length > 0) {
    const elem = searchQueue.shift()

    const cell = getCell(grid, elem.x, elem.y)

    if (cell.x === p2.x && cell.y === p2.y) {
      // found a way of getting to the target!
      paths.push([...elem.path, { x: p2.x, y: p2.y }])
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
      searchQueue.push(...[
        { x: elem.x, y: elem.y - 1, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x - 1, y: elem.y, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x + 1, y: elem.y, path: [...elem.path, { x: elem.x, y: elem.y }] },
        { x: elem.x, y: elem.y + 1, path: [...elem.path, { x: elem.x, y: elem.y }] }
      ])
    }
  }

  paths.sort(pathSortFunction)

  return paths[0]
}

function computeScore (input, deadElvesOkay = true, attackPowerBoost = 0) {
  const grid = initialize(input)

  // renderGrid(grid)

  let stoppedAt
  let deadElves = 0

  for (let iteration = 0; /*iteration < 3*/; iteration++) {
    // console.log(`iteration ${iteration + 1}`)

    // console.log(allGoblins(grid))
    // console.log(allElves(grid))

    allPlayers(grid).forEach((p1) => {
      function findClosestFoe (p1) {
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
        paths.sort(pathSortFunction)

        return paths[0]
      }

      if (p1.hp <= 0) {
        // this player ended up dying this round before its turn could come up
        return
      }

      let traversalPath = findClosestFoe(p1)

      if (!traversalPath) {
        // this player has no action at this point
        // console.log(p1, 'cannot do anything')

        return
      }

      if (traversalPath.length > 2) {
        // we need to move
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

        // console.log(`move ${p1Coords.x}:${p1Coords.y} to ${targetCoords.x}:${targetCoords.y}`)

        traversalPath.shift()
      }

      if (traversalPath.length === 2) {
        // player is adjecent to an enemy for sure
        // but it might need to re-evaluate who to fight
        const playerCoords = traversalPath[0]

        const player = getCell(grid, playerCoords.x, playerCoords.y)

        let enemy = { hp: Number.MAX_SAFE_INTEGER }

        let q = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
        q.forEach((offset) => {
          const candidate = getCell(grid, playerCoords.x + offset.x, playerCoords.y + offset.y)

          if ((player.type === CELL_TYPE_ELF && candidate.type === CELL_TYPE_GOBLIN) ||
            (player.type === CELL_TYPE_GOBLIN && candidate.type === CELL_TYPE_ELF)) {
            if (candidate.hp < enemy.hp) {
              enemy = candidate
            }
          }
        })

        //console.log(`battle ${player.x},${player.y} with ${enemy.x},${enemy.y}`)

        enemy.hp -= player.attackPower
        if (player.type === CELL_TYPE_ELF) {
          enemy.hp -= attackPowerBoost
        }

        //console.log('hp at', enemy.hp, player.attackPower)

        if (enemy.hp <= 0) {
          if (enemy.type === CELL_TYPE_ELF && !deadElvesOkay) {
            deadElves++
            console.log('an elf has died. unacceptable')
          }

          enemy.type = CELL_TYPE_EMPTY
        }
      }
    })

    if (stoppedAt || deadElves !== 0) {
      break
    }

    // renderGrid(grid)

    // anyKey()
    // movements.forEach((movement) => {
    //   const [p1Coords, targetCoords] = traversalPath

    //   setCell(grid, p1Coords.x, p1Coords.y)
    // })
  }

  return {
    iterations: stoppedAt,
    sumHp: allPlayers(grid).reduce((accum, player) => {
      return accum + player.hp
    }, 0),
    deadElves
  }
}

const p1Results = computeScore(input)
console.log('p1', p1Results.iterations * p1Results.sumHp)

for (let attackPowerBoost = 0; ; attackPowerBoost++) {
  console.log('boosting attack power by', attackPowerBoost)

  const p2Results = computeScore(input, false, attackPowerBoost)
  if (p2Results.deadElves === 0) {
    console.log(p2Results)
    console.log('p2', p2Results.iterations * p2Results.sumHp)

    break
  }
}
