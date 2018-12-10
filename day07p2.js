const STEP_PREFIX_TIME = 60
const WORKER_COUNT = 5
// const STEP_PREFIX_TIME = 0
// const WORKER_COUNT = 2

const fs = require('fs')

const input = fs.readFileSync('day07input.txt', { encoding: 'utf8' }).split('\n')
// const input = fs.readFileSync('day07sample.txt', { encoding: 'utf8' }).split('\n')

const instructionGraph = {}
const nodes = new Set()

input.forEach((x) => {
  const split = x.match(/Step (.*) must be finished before step (.*) can begin\./)

  if (!instructionGraph[split[1]]) {
    instructionGraph[split[1]] = {
      id: split[1],
      dependents: new Set(),
      prerequisites: new Set()
    }
  }

  if (!instructionGraph[split[2]]) {
    instructionGraph[split[2]] = {
      id: split[2],
      dependents: new Set(),
      prerequisites: new Set()
    }
  }

  instructionGraph[split[1]].dependents.add(split[2])
  instructionGraph[split[2]].prerequisites.add(split[1])

  nodes.add(split[1])
  nodes.add(split[2])
})

// find the node that doesn't have any pointers to it
const hasNoReference = new Set()

Object.keys(instructionGraph).forEach((key) => {
  if (instructionGraph[key].prerequisites.size === 0) {
    hasNoReference.add(instructionGraph[key])
  }
})

const stack = Array(...hasNoReference)
stack.sort((a, b) => a.id.localeCompare(b.id))

const seen = new Set()

const workers = []
for (let i = 0; i < WORKER_COUNT; i++) {
  workers.push({
    ttl: 0,
    item: null
  })
}

const finished = new Set()

let i
for (i = 0; finished.size !== nodes.size; i++) {
  workers.forEach((worker) => {
    worker.ttl--

    if (worker.ttl === 0 && worker.item !== null) {
      // process.stdout.write(item.id)
      finished.add(worker.item.id)

      if (instructionGraph[worker.item.id]) {
        instructionGraph[worker.item.id].dependents.forEach((x) => stack.push(instructionGraph[x]))
      }

      worker.item = null
    }
  })

  let stackPosition = 0
  for (; ;) {
    const inactiveWorkerIndex = workers.findIndex((worker) => worker.ttl <= 0)
    if (inactiveWorkerIndex === -1 || stack.length <= stackPosition) {
      // if you can't find any inactive workers or if there is no work, increment time
      break
    }

    const item = stack[stackPosition]

    let prerequisitesMet = true

    item.prerequisites.forEach((x) => {
      if (!finished.has(x)) {
        prerequisitesMet = false
      }
    })

    if (seen.has(item.id)) {
      stack.shift()
    } else if (!seen.has(item.id) && prerequisitesMet) {
      workers[inactiveWorkerIndex] = {
        ttl: STEP_PREFIX_TIME + 1 + item.id.charCodeAt(0) - 'A'.charCodeAt(0),
        item: item
      }

      seen.add(item.id)

      stack.shift()
    } else {
      stackPosition++
    }
  }

  const w = workers.map((x) => {
    if (x.item) {
      return x.item.id + ':' + x.ttl
    } else {
      return '.:0'
    }
  })

  const f = []
  finished.forEach((q) => f.push(q))
  console.log(i, w.join(','), f.join(''))
  console.log(stack)
}

console.log(i)