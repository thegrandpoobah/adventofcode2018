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

        let matches = 0
        for (let j = 0; j < ops.length; j++) {
            const [a1, b1, c1, d1] = ops[j](before, op.a, op.b, op.c)
            const [a2, b2, c2, d2] = after

            if (a1 === a2 && b1 === b2 && c1 === c2 && d1 === d2) {
                matches++
            }
        }

        if (matches >= 3) {
            threeOrMore++
        }

        for (let j = cpu[op.opcode].length - 1; j >= 0 ; j--) {
            const [a1, b1, c1, d1] = cpu[op.opcode][j](before, op.a, op.b, op.c)
            const [a2, b2, c2, d2] = after

            if (a1 !== a2 || b1 !== b2 || c1 !== c2 || d1 !== d2) {
                // they didn't match, so lets remove the opcode as a potential
                cpu[op.opcode].splice(j, 1)
            }
        }

        i+=3
    }
}

console.log('p1', threeOrMore)

function hasAmbigiousOpcode(cpu) {
    for (let i = 0; i < cpu.length; i++) {
        if (cpu[i].length > 1) {
            return true
        }
    }

    return false
}

function getTrueOpCodes(cpu) {
    const opcodes = []

    for (let i = 0; i < cpu.length; i++) {
        if (cpu[i].length === 1) {
            opcodes.push(cpu[i][0])
        }
    }

    return opcodes
}

while (hasAmbigiousOpcode(cpu)) {
    getTrueOpCodes(cpu).forEach((code) => {
        for (let i = 0; i < cpu.length; i++) {
            if (cpu[i].length > 1) {
                cpu[i] = cpu[i].filter((x) => x !== code)
            }
        }
    })
}

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
    registers = cpu[op.op][0](registers, op.a, op.b, op.c)
})

console.log('p2', registers[0])
