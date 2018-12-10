const fs = require('fs')

const input = fs.readFileSync('day10input.txt', { encoding: 'utf8' }).split('\n')

const pointCloud = input.map((x) => {
  const parts = x.match(/position=\<([- ]\d*), ([- ]\d*)\> velocity=\<([- ]\d*), ([- ]\d*)/)

  return {
    px: parseInt(parts[1], 10),
    py: parseInt(parts[2], 10),
    vx: parseInt(parts[3], 10),
    vy: parseInt(parts[4], 10)
  }
})

let canvasXSizeMin = Number.MAX_SAFE_INTEGER
let canvasYSizeMin = Number.MAX_SAFE_INTEGER

for (let i = 0; ; i++) {
  pointCloud.forEach((pt) => {
    pt.px += pt.vx
    pt.py += pt.vy
  })

  const minX = Math.min(...pointCloud.map((pt) => pt.px))
  const maxX = Math.max(...pointCloud.map((pt) => pt.px))
  const minY = Math.min(...pointCloud.map((pt) => pt.py))
  const maxY = Math.max(...pointCloud.map((pt) => pt.py))

  let shrinking = true

  if (maxX - minX < canvasXSizeMin) {
    canvasXSizeMin = maxX - minX
  } else {
    shrinking = false
  }

  if (maxY - minY < canvasYSizeMin) {
    canvasYSizeMin = maxY - minY
  } else {
    shrinking = false
  }

  if (!shrinking) {
    pointCloud.forEach((pt) => {
      pt.px -= pt.vx
      pt.py -= pt.vy
    })

    console.log('---------START-----: ', i)
    const field = []
    for (let y = minY; y < maxY + 1; y++) {
      row = []
      for (let x = minX; x < maxX + 1; x++) {
        row.push('.')
      }

      field.push(row)
    }

    pointCloud.forEach((pt) => {
      field[pt.py - minY][pt.px - minX] = '#'
    })

    field.forEach((row) => {
      console.log(row.join(''))
    })

    console.log('---------END-----: ', i)

    break
  }
}