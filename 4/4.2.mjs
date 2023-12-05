// @ts-check

import { readFileSync } from "fs";

const lines = readFileSync("./input.txt").toString().split("\n");

/** @typedef {{id: number, winning: number[], picked:number[]}} Card */

/**
 * @param {string} card
 * @returns {Card | null}
 */
const parse = (card) => {
    const cardRx = /Card\s+(\d+):(.*?)\|(.*?)$/.exec(card.trim());
    if (!cardRx) return null;
    const id = parseInt(cardRx[1]);
    if (isNaN(id)) return null;
    const [_1, _2, winningHalf, pickedHalf] = cardRx;

    const winning = [...winningHalf.matchAll(/\d+/g)]
        .flat()
        .map((n) => parseInt(n));
    const picked = [...pickedHalf.matchAll(/\d+/g)]
        .flat()
        .map((n) => parseInt(n));
    return { id, winning, picked };
};

/**
 * @type {Record<number,Card>}
 */
const cards = Object.fromEntries(
    lines
        .map(
            /** @returns {[string,Card]} */ (p) => {
                const parsed = parse(p);
                if (parsed) return [`${parsed.id}`, parsed];
                else return ["-1", { id: -1, winning: [], picked: [] }];
            }
        )
        .filter((c) => c[1] !== undefined)
);

let totalCards = 0;

/**
 * @param {Card} card
 */
const howManyWon = (card) => {
    return card.picked.reduce(
        (p, n) => p + (card.winning.includes(n) ? 1 : 0),
        0
    );
};

/**
 * @param {Card} card
 */
const calcTotalCardNum = (card) => {
    const won = howManyWon(card);
    if (!won) {
        totalCards += 1;
        return;
    } else {
        totalCards += 1;
        const copies = [...Array(won).keys()].map((x) => {
            return cards[card.id + x + 1];
        });
        copies.forEach((c) => calcTotalCardNum(c));
    }
};

console.time("time");

for (const id in cards) {
    if (id === "-1") continue;
    calcTotalCardNum(cards[id]);
}

console.timeEnd("time");

console.log(totalCards);
