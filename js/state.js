export { state, getEmptyState, evaluateLines };

import { config } from "./config.js";
import { getNextPiece } from "./generation.js";
import { updateScore } from "./drawing.js";

let state = getEmptyState();

state.piece = getNextPiece();
state.nextPiece = getNextPiece();
state.score = 0;
state.value = 1;

function getEmptyState() {
  const state = [];
  for (let i = 0; i < config.rowCount; i++) {
    state.push(Array(config.columnCount).fill(0));
  }
  return state;
}

function evaluateLines() {
  let noLines = true;
  for (let i = 0; i < state.length; i++) {
    const row = state[i];
    if (row.every((cell) => cell !== 0)) {
      state.splice(i, 1);
      state.unshift(Array(10).fill(0));
      i--;
      state.score += state.value;
      state.value *= 2;
      noLines = false;
      updateScore();
    }
  }
  if (noLines && state.value > 1) {
    state.value -= Math.ceil(state.value / 4);
    updateScore();
  }
}
