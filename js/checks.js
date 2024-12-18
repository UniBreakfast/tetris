export { canShift, canRotate, canBurrow };

import { state } from './state.js';
import { getShift, rotateShape } from './manipulation.js';
import {
  getPieceProjection, doesIntersect
} from './calculation.js';

const shifts = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: 2, y: 0 },
  { x: -2, y: 0 },
]

function canShift(direction) {
  const { piece } = state;
  
  try {
    const { x, y } = getShift(direction);
    const pieceProjection = getPieceProjection(piece.shape, piece.x + x, piece.y + y);
    return !doesIntersect(pieceProjection, state);
  } catch (error) {
    return false;
  }
}

function canRotate() {
  const { piece } = state;
  const rotatedShape = rotateShape(piece.shape);

  for (const shift of shifts) {
    try {
      const pieceProjection = getPieceProjection(
        rotatedShape,
        piece.x + shift.x,
        piece.y + shift.y
      );
      if (!doesIntersect(pieceProjection, state)) return shift;
    } catch { }
  }
  return false;
}

function canBurrow() {
  const { piece } = state;
  
  return state.slice(piece.y + 1).map(row => row[piece.x])
    .some(filled => !filled);
}
