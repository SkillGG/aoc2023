// @ts-check

import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString().split("\n");
/**
 * @param {string} line
 */
const tokenize = (line) => {
    const tokens = {
        /** @type {{start:number,end:number,value:number}[]}*/ nums: [],
        /** @type {{start:number,end:number,value:string}[]} */ chars: [],
        /**
         * @param {{start:number,end:number}} range
         */
        isCharInRange(range) {
            for (const char of this.chars) {
                if (char.start < range.end && char.end > range.start)
                    return true;
            }
            return false;
        },
        /**
         * @param {{start:number,end:number}} range
         */ numsInRange(range) {
            return this.nums.filter(
                (n) => n.start < range.end && n.end > range.start
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
        tokens.chars.push({ start: cM.index, end: cM.index + 1, value: cM[0] });
    }
    return tokens;
};

const tokens = lines.map((line) => tokenize(line));

let sum = 0;

for (let i = 0; i < tokens.length; i++) {
    const prev = i === 0 ? null : tokens[i - 1];
    const next = i === tokens.length - 1 ? null : tokens[i + 1];
    const cur = tokens[i];

    cur.chars
        .filter(({ value }) => value === "*")
        .forEach((q) => {
            const boundingBox = { start: q.start - 1, end: q.end + 1 };
            const nums = [
                ...(prev?.numsInRange(boundingBox) || []),
                ...(next?.numsInRange(boundingBox) || []),
                ...cur.numsInRange(boundingBox),
            ];
            if (nums.length === 2) {
                sum += nums[0].value * nums[1].value;
            }
        });
}

console.log(sum);
