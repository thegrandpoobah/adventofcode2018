const fs = require('fs')

const input = require('./day12input.json')
// const input = require('./day12sample.json')

let workingSet = ''
let backbuffer = input['initial state']
let zeroPos = 0

for (let i = 0; i < 20; i++) {
  workingSet = backbuffer
  backbuffer = ''

  for (let x = -2; x < workingSet.length + 2; x++) {
    let rule = workingSet.substr(Math.max(x - 2, 0), 5 + Math.min(x - 2, 0))
    if (x < 2) {
      for (let y = 0; y < -(x - 2); y++) {
        rule = '.' + rule
      }
    } else if (x >= workingSet.length - 2) {
      for (let y = 0; y < 3 - workingSet.length + x; y++) {
        rule = rule + '.'
      }
    }

    if (input.productions[rule]) {
      backbuffer += input.productions[rule]
    } else {
      backbuffer += '.'
    }
  }

  if (backbuffer.substr(0, 2) === '..') {
    backbuffer = backbuffer.substr(2)
  } else if (backbuffer.substr(0, 1) === '.') {
    backbuffer = backbuffer.substr(1)
    zeroPos--
  } else {
    zeroPos -= 2
  }

  if (backbuffer.substr(backbuffer.length - 2) === '..') {
    backbuffer = backbuffer.substr(0, backbuffer.length - 2)
  } else if (backbuffer.substr(backbuffer.length - 1) === '.') {
    backbuffer = backbuffer.substr(0, backbuffer.length - 1)
  }
}

workingSet = backbuffer

let sum = 0

for (let x = 0; x < workingSet.length; x++) {
  if (workingSet.charAt(x) === '#') {
    sum += x + zeroPos
  }
}

console.log('p1', sum)
