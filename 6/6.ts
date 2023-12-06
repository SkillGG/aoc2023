import { readFileSync } from "fs";

const input = readFileSync("./input.txt").toString();

const races: { time: number; distance: number }[] = [];

input.split("\r\n").reduce((p, n, i) => {
  console.log("line ", i);
  const newP = [...p];
  const numRx = /(\d+)/g;
  let rx: RegExpExecArray | null;
  let numstr = "";
  while ((rx = numRx.exec(n))) {
    numstr += rx[0];
  }
  const num = parseInt(numstr);
  if (i === 0) {
    newP.push({ time: num });
  } else {
    races.push({ ...newP[0], distance: num });
    newP[0] = { ...newP[0] };
  }
  return newP;
}, [] as { time: number }[]);

console.log(races);

let sum = 1;

for (const race of races) {
  let faster = 0;
  const { time, distance: record } = race;
  for (let mil = 0; mil < time; mil++) {
    const runtime = time - mil;
    if (runtime * mil > record) faster++;
  }
  sum *= faster;
}

console.log(sum);
