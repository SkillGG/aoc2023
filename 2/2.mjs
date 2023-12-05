// @ts-check
import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString().split("\n");

const maxCubes = {
    red: 12,
    green: 13,
    blue: 14,
};

/**
 * @param {string} str
 * @returns {Record<string, number>}
 */
const gameToCubeDic = (str) => {
    const cubes = str.trim().split(",");
    console.log(str);
    return Object.fromEntries(
        cubes.map((x) => {
            const z = x.trim().split(" ");
            console.log(z);
            return [z[1], parseInt(z[0])];
        })
    );
};

/**
 * @param {string} str
 */
const calcMinimumCubesForGame = (str) => {
    if (!str) return null;
    const rxV = /Game (\d+): (.*)/.exec(str);
    if (!rxV) return 0;
    const [_, id, data] = rxV;
    const games = data.split(";").map((s) => s.trim());
    const dic = { green: 0, red: 0, blue: 0 };
    for (const game of games) {
        const cubes = gameToCubeDic(game);
        for (const color in cubes) {
            if (dic[color] < cubes[color]) dic[color] = cubes[color];
        }
    }
    console.log(dic);
    return dic;
};

/**
 * @param {string} str
 * @returns {number}
 */
const checkIfGameIsPossible = (str) => {
    const rxV = /Game (\d+): (.*)/.exec(str);
    if (!rxV) return 0;
    const [_, id, data] = rxV;
    const games = data.split(";");
    const idAsNum = parseInt(id);
    // console.log(idAsNum, games);
    for (const game of games) {
        const cubeDic = gameToCubeDic(game);
        console.log("for game", game, "cubedic", cubeDic);
        for (const color in cubeDic) {
            if (cubeDic[color] > maxCubes[color]) return 0;
        }
    }
    return idAsNum;
};

console.log(
    "Sum:" +
        lines.reduce((p, n) => {
            const mins = calcMinimumCubesForGame(n);
            if (!mins) return p;
            let power = 1;
            for (const color in mins) {
                power *= mins[color];
            }
            return p + power;
        }, 0)
);
