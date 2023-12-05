// @ts-check

import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString();

console.time("setup / parse");

/**
 * Object of this class will take a number and map it to other number
 */
class AlmanacMap {
    sourceStart: number;
    destinationStart: number;
    length: number;
    constructor(dest = NaN, source = NaN, len = NaN) {
        if (isNaN(source) || isNaN(dest) || isNaN(len))
            throw "Empty Almanac Map";
        this.sourceStart = source;
        this.destinationStart = dest;
        this.length = len;
    }
    /** Map the number */
    map(n: number) {
        if (n < this.sourceStart || n > this.sourceStart + this.length)
            return null;
        return this.destinationStart + n - this.sourceStart;
    }
}

/**
 * This is data returned after parsing the file
 */
type SeedMapData = {
    seeds: number[];
    /** The "layers" that number has to go through */
    steps: Record<Exclude<keyof typeof mapDic, "seeds">, AlmanacMap[]>;
};

/** This is the list of all shortcuts for given mappings (i - seeds / input, r - location / return) */
const mapDic = {
    i2s: "seed-to-soil",
    s2f: "soil-to-fertilizer",
    f2w: "fertilizer-to-water",
    w2l: "water-to-light",
    l2t: "light-to-temperature",
    t2h: "temperature-to-humidity",
    h2r: "humidity-to-location",
} as const;

const getSeedMap = (lines: string): null | SeedMapData => {
    // find all the seeds
    const rxSeeds = /seeds:\s+((?:\d+\s+)+)\r\n/i.exec(lines);
    if (!rxSeeds) {
        return null;
    }
    const seeds = rxSeeds[1].split(" ").map((r) => parseInt(r));

    const retAlmanacs: SeedMapData = {
        seeds,
        // the order of steps here is the order that the maps will be executed
        steps: {
            i2s: [],
            s2f: [],
            f2w: [],
            w2l: [],
            l2t: [],
            t2h: [],
            h2r: [],
        },
    };

    for (const k in mapDic) {
        const key = k as keyof typeof mapDic;
        const str = mapDic[key];

        const rx = new RegExp(
            `${str} map:[\\s\\n]+((?:\\d+(?:\\s|$)+)+)(?:\\r\\n){0,2}`,
            "ig"
        );
        const ex = rx.exec(lines);
        if (!ex) {
            console.error("null", rx, ex);
            continue;
        }

        const mapLines = ex[1].trim().split("\r\n");

        for (const mapLine of mapLines) {
            const nums = mapLine.split(" ").map((r) => parseInt(r.trim()));
            retAlmanacs.steps[key].push(
                new AlmanacMap(nums[0], nums[1], nums[2])
            );
        }
    }

    return retAlmanacs;
};

const data = getSeedMap(lines);
if (!data) throw "Data is empty";

/** This function takes number and passes it through all Almanacs in a map layer */
const executeAStep = (
    step: keyof SeedMapData["steps"],
    num: number
): number => {
    for (const almanac of data.steps[step]) {
        const mappedNum = almanac.map(num);
        if (mappedNum) return mappedNum;
    }
    return num;
};

/** This function takes number and passes it through all AlmanacMaps in order */
const executeAllStepsForANumber = (number: number) => {
    let ret = number;
    for (const step in data.steps) {
        const key = step as keyof SeedMapData["steps"];
        const rt = executeAStep(key, ret);
        ret = rt;
    }
    return ret;
};

console.timeEnd("setup / parse");
// start timing
console.time("brute force");

let lowest: number = Infinity;

for (let i = 0; i < data.seeds.length; i += 2) {
    const place = data.seeds[i];
    const seednum = data.seeds[i + 1];
    console.log(place, seednum, (i / data.seeds.length) * 100 + "%");

    for (let seed = place; seed < place + seednum; seed++) {
        const loc = executeAllStepsForANumber(seed);
        if (loc < lowest) lowest = loc;
    }
}
console.timeEnd("brute force");

console.log("lowest", lowest);
