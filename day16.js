const fs = require('fs')

const watch = fs.readFileSync('day16watch.txt', { encoding: 'utf8' }).split('\n')

function unpack(input) {
    let [opcode, a, b, c] = input.split(' ').map(x => parseInt(x, 10))

    return {
        opcode,
        a,
        b,
        c
    }
}

function addr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] + clone[b]
    return clone  
}

function addi (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] + b
    return clone  
}

function mulr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] * clone[b]
    return clone  
}

function muli (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] * b
    return clone  
}

function banr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] & clone[b]
    return clone  
}

function bani (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] & b
    return clone  
}

function borr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] | clone[b]
    return clone  
}

function bori (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] | b
    return clone  
}

function setr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a]
    return clone  
}

function seti (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = a
    return clone  
}

function gtir (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = a > clone[b] ? 1 : 0
    return clone  
}

function gtii (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] > b ? 1 : 0
    return clone  
}

function gtrr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] > clone[b] ? 1 : 0
    return clone  
}

function gtir (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = a > clone[b] ? 1 : 0
    return clone  
}

function gtri (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] > b ? 1 : 0
    return clone  
}

function gtrr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] > clone[b] ? 1 : 0
    return clone  
}

function eqir (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = a === clone[b] ? 1 : 0
    return clone  
}

function eqri (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] === b ? 1 : 0
    return clone  
}

function eqrr (memory, a, b, c) {
    const clone = memory.map(x => x)
    clone[c] = clone[a] === clone[b] ? 1 : 0
    return clone  
}

const ops = [
    addr,
    addi,
    mulr,
    muli,
    banr,
    bani,
    borr,
    bori,
    setr,
    seti,
    gtir,
    gtri,
    gtrr,
    eqir,
    eqri,
    eqrr
]

let threeOrMore = 0

const cpu = []

for (let i = 0; i < ops.length; i++) {
    cpu.push(ops.map(x => x))
}

for (let i = 0; i < watch.length; i++) {
    if (watch[i].startsWith('Before')) {
        let before = eval(watch[i].replace('Before: ', ''))
        let op = unpack(watch[i + 1])
        let after = eval(watch[i + 2].replace('After: ', ''))

        for (let j = cpu[op.opcode].length - 1; j >= 0 ; j--) {
            const [a1, b1, c1, d1] = cpu[op.opcode][j](before, op.a, op.b, op.c)
            const [a2, b2, c2, d2] = after

            if (a1 !== a2 || b1 !== b2 || c1 !== c2 || d1 !== d2) {
                // they didn't match, so lets remove the opcode as a potential
                cpu[op.opcode].splice(j, 1)
            }
        }

        if (cpu[op.opcode].length >= 3) {
            threeOrMore++
        }

        i+=3
    }
}

console.log('p1', threeOrMore)

const realCpu = [
    addr,
    eqri,
    eqir,
    eqrr,
    gtir,
    addi,
    banr,
    gtri,
    bori,
    muli,
    seti,
    gtrr,
    setr,
    borr,
    mulr,
    bani
]

const input = fs.readFileSync('day16input.txt', { encoding: 'utf8' }).split('\n').map(x => {
    const [op, a, b, c] = x.split(' ').map(y => parseInt(y, 10))

    return {
        op,
        a,
        b,
        c
    }
})

let registers = [0, 0, 0, 0]

input.forEach(op => {
    registers = realCpu[op.op](registers, op.a, op.b, op.c)
})

console.log('p2', registers[0])
