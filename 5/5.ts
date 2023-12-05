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
    // get data from file
    for (const k in mapDic) {
        const key = k as keyof typeof mapDic;
        const str = mapDic[key];
        // create regex /${str} map:[\s\n]+((?:\d+(?:\s|$)+)+)(?:\r\n){0,2}/
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

        // get the number values and create an AlmanacMap
        for (const mapLine of mapLines) {
            const nums = mapLine.split(" ").map((r) => parseInt(r.trim()));
            retAlmanacs.steps[key].push(new AlmanacMap(...nums));
        }
    }
    return retAlmanacs;
};

const data = getSeedMap(lines);
if (!data) throw "Data is empty";

console.time("brute force");

// get all new seed locations
const seedLocations = data?.seeds.map((m) => {
    console.log();
    console.log("number:", m);
    const executeStep = (
        almanac: keyof SeedMapData["steps"],
        num: number
    ): number => {
        return (
            data.steps[almanac].reduce<number | null>(
                (p, n) => (p ? p : n.map(num)),
                null
            ) || num
        );
    };

    let ret = m;

    for (const almanac in data.steps) {
        const key = almanac as keyof SeedMapData["steps"];
        const rt = executeStep(key, ret);
        console.log("applying", key, ret, "=>", rt);
        ret = rt;
    }

    return ret;
});

if (seedLocations) console.log(Math.min(...seedLocations));
console.timeEnd("brute force");
