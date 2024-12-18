import { config } from './js/config.js';
import { canShift, canBurrow } from './js/checks.js';
import { state, evaluateLines } from './js/state.js';
import { mole } from './js/shapes.js';
import { move, freeze } from './js/manipulation.js';
import { draw, drawNext } from './js/drawing.js';
import { getNextPiece } from './js/generation.js';

let intervalId = null;

start();

function start() {
  intervalId = setInterval(tick, config.stepInterval);
}

function togglePause() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  } else {
    start();
  }
  pauseCover.toggleAttribute('hidden');
}

function tick() {
  if (
    canShift("down")
    || state.piece.shape === mole && canBurrow()
  ) {
    move("down");
  } else {
    if (!state.piece.moved) return end();

    freeze();
    evaluateLines();
    state.piece = state.nextPiece;
    state.nextPiece = getNextPiece();
    drawNext();
  }

  draw();
}

function end() {
  clearInterval(intervalId);

  onkeydown = null;
}
