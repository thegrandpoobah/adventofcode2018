var r0 = 0, r1 = 0, r3 = 0, r4 = 0, r5 = 0

// if (p1) {
//     r5 = 955
//} else {
    r5 = 10551355
//}

// this finds the sum of all factors of r5
// just use Wolfram Alpha to get the factors and then manually add
for (r1 = 1; r1 <= r5; r1++) {
    for (r3 = 1; r3 <= r5; r3++) {
        r4 = r1 * r3
        if (r4 === r5) {
            r0 += r1
            console.log(r0)
        }
    }
}

console.log(r0)
