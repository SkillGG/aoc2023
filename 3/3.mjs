// @ts-check

import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString().split("\n");

/**
 * @param {string} line
 */
const tokenize = (line) => {
    const tokens = {
        /** @type {{start:number,end:number,value:number}[]}*/ nums: [],
        /** @type {{s:number,e:number,v:string}[]} */ chars: [],
        /**
         * @param {{s:number,e:number}} range
         */
        isCharInRange(range) {
            return this.chars.reduce(
                (p, n) => (p ? p : n.s < range.e && n.e > range.s),
                false
            );
        },
    };
    const numMatches = line.matchAll(/\d+/g);
    const charMatches = line.matchAll(/[^a-z0-9.]/g);
    for (const nM of numMatches) {
        if (nM.index === undefined) throw "WTF JS";
        tokens.nums.push({
            start: nM.index,
            end: nM.index + nM[0].length,
            value: parseInt(nM[0]),
        });
    }
    for (const cM of charMatches) {
        if (cM.index === undefined) throw "WTF JS";
        tokens.chars.push({ s: cM.index, e: cM.index + 1, v: cM[0] });
    }
    return tokens;
};

const tokens = lines.map((line) => tokenize(line));

let sum = 0;

for (let i = 0; i < tokens.length; i++) {
    const prev = i === 0 ? null : tokens[i - 1];
    const next = i === tokens.length - 1 ? null : tokens[i + 1];
    const cur = tokens[i];

    // ....
    // .23.
    // ....

    const numsWithChars = cur.nums.filter((f) => {
        const boundingBox = { s: f.start - 1, e: f.end + 1 };
        return (
            prev?.isCharInRange(boundingBox) ||
            next?.isCharInRange(boundingBox) ||
            cur.isCharInRange(boundingBox)
        );
    });

    sum += numsWithChars.reduce((p, n) => p + n.value, 0);
}

console.log(sum);
