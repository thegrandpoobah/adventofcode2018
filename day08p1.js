const fs = require('fs')

// const input = fs.readFileSync('day08sample.txt', { encoding: 'utf8' }).split(' ').map(x => parseInt(x, 10))
const input = fs.readFileSync('day08input.txt', { encoding: 'utf8' }).split(' ').map(x => parseInt(x, 10))

let metadataSum = 0

function createSubTree (input, idx) {
  const childNodeCount = input[idx]
  const metadataEntries = input[idx + 1]

  const subtree = {
    children: [],
    metadata: []
  }

  idx += 2

  for (let i = 0; i < childNodeCount; i++) {
    const s = createSubTree(input, idx)
    subtree.children.push(s.children)
    idx = s.idx
  }

  for (let i = 0; i < metadataEntries; i++) {
    subtree.metadata.push(input[idx])
    metadataSum += input[idx]
    idx++
  }

  return {
    node: subtree,
    idx: idx
  }
}

createSubTree(input, 0)

console.log('p1', metadataSum)
