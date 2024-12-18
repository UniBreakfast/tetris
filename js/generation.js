export { getNextPiece };

import { shapes, rareShapes } from "./shapes.js";
import { rotateShape } from "./manipulation.js";
import { mole } from "./shapes.js";
import { getInitialX, getInitialY } from "./calculation.js";

function getNextPiece() {
  const isMole = Math.random() < 0.02;

  if (isMole) {
    const shape = mole;
    return { shape, x: getInitialX(shape), y: getInitialY(shape), moved: false };
  }
  const isRare = Math.random() < 0.1;
  const pool = isRare ? rareShapes : shapes;
  const index = Math.floor(Math.random() * pool.length);
  let shape = pool[index];
  const rotations = Math.floor(Math.random() * 4);

  for (let i = 0; i < rotations; i++) {
    shape = rotateShape(shape);
  }
  return { shape, x: getInitialX(shape), y: getInitialY(shape), moved: false };
}
