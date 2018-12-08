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

while (stack.length > 0) {
  const item = stack.shift()

  let prerequisitesMet = true

  item.prerequisites.forEach((x) => {
    if (!seen.has(x)) {
      prerequisitesMet = false
    }
  })

  if (!seen.has(item.id) && prerequisitesMet) {
    process.stdout.write(item.id)
  } else {
    continue
  }

  seen.add(item.id)

  if (instructionGraph[item.id]) {
    instructionGraph[item.id].dependents.forEach((x) => stack.push(instructionGraph[x]))
  }

  stack.sort((a, b) => a.id.localeCompare(b.id))
}
