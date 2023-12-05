// @ts-check
import { readFileSync } from "fs";

const file = readFileSync("./input.txt").toString().split("\n");

const numDic = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    zero: 0,
};

/**
 * @param {string} str
 * @param {number} i
 * @returns {number}
 */
const parseSplice = (str, i) => {
    if (!isNaN(parseInt(str[i]))) return parseInt(str[i]);
    for (const strNum in numDic) {
        if (str.substring(i).startsWith(strNum)) {
            return numDic[strNum];
        }
    }
    return NaN;
};

/**
 * @param {string} str
 */
const findNum = (str) => {
    if (!str) return 0;
    if (!/\d/.exec(str)) return 0;
    let left = -1;
    let right = -1;
    for (let i = 0; i < str.length; i++) {
        const val = parseSplice(str, i);
        if (!isNaN(val)) {
            console.log("found number", val);
            if (left < 0) {
                left = right = val;
            } else right = val;
        }
    }
    const ret = left * 10 + right;
    console.log("returning", ret);
    return ret;
};

let sum = 0;

for (const line of file) {
    console.log("\nin line", line);
    sum += findNum(line);
}

console.log(sum);