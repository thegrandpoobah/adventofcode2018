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
    subtree.children.push(s.node)
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

function getNodeValue (node) {
  if (node.children.length > 0) {
    return node.metadata.reduce((accum, n) => {
      if (n - 1 < node.children.length) {
        return accum + getNodeValue(node.children[n - 1])
      } else {
        return accum
      }
    }, 0)
  } else {
    return node.metadata.reduce((accum, n) => accum + n)
  }
}

const { node } = createSubTree(input, 0)

const value = getNodeValue(node)

console.log('p1', metadataSum)
console.log('p2', value)