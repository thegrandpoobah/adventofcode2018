const fs = require('fs')

const programText = fs.readFileSync('day19input.txt', { encoding: 'utf8' }).split('\n')

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

const ops = {
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
}

let memory = [1, 0, 0, 0, 0, 0]

const ipBinding = parseInt(programText.shift().replace('#ip ', ''), 10)
const program = programText.map(x => {
    const [, opcode, register, a, b ] = x.match(/(.*) (\d*) (\d*) (\d*)/)
    return {
        opcode,
        a: parseInt(register, 10),
        b: parseInt(a, 10),
        c: parseInt(b, 10)
    }
})

for ( ;; memory[ipBinding]++) {
    const instruction = program[memory[ipBinding]]

    memory = ops[instruction.opcode](memory, instruction.a, instruction.b, instruction.c)

    if (memory[ipBinding] < 0 || memory[ipBinding] >= program.length - 1) { 
        break
    }
}

console.log(memory[0])
