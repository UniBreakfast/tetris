export { draw, drawNext, updateScore };

import { config } from './config.js';
import { state } from './state.js';
import { colors } from './shapes.js';
import { cropShape } from './calculation.js';
import { 
  glass, next, scoreOutput, actualOutput, multiplier 
} from './elements.js';

glass.ctx = glass.getContext("2d");
next.ctx = next.getContext("2d");

onload = updateSizing;

onresize = updateSizing;

function updateSizing() {
  updateGlassSizing();
  updateNextSizing();
  drawNext();
  draw();
}

function updateGlassSizing() {
  config.blockSize = innerHeight / config.rowCount;
  glass.width = config.blockSize * config.columnCount;
  glass.height = config.blockSize * config.rowCount;
}

function updateNextSizing() {
  const { width, height } = cropShape(state.nextPiece.shape);
  next.width = config.blockSize * width;
  next.height = config.blockSize * height;
}

function draw() {
  glass.ctx.clearRect(0, 0, glass.width, glass.height);

  drawState();
  drawPiece();
}

function drawState() {
  const { blockSize } = config;

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (state[i][j]) {
        drawSquare(
          glass,
          j * blockSize,
          i * blockSize,
          blockSize,
          colors[state[i][j]]
        );
      }
    }
  }
}

function drawPiece() {
  const { blockSize } = config;
  const { piece } = state;

  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (piece.shape[i][j]) {
        drawSquare(
          glass,
          (piece.x + j) * blockSize,
          (piece.y + i) * blockSize,
          blockSize,
          colors[piece.shape[i][j]]
        )
      }
    }
  }
}

function drawNext() {
  const {shape} = cropShape(state.nextPiece.shape);
  const { blockSize } = config;

  updateNextSizing();

  next.ctx.clearRect(0, 0, next.width, next.height);

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) {
        drawSquare(
          next,
          j * blockSize,
          i * blockSize,
          blockSize,
          colors[shape[i][j]],
        )
      }
    }
  }
}

function drawSquare(canvas, x, y, size, color) {
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillRect(x, y, size, size);

  canvas.ctx.lineWidth = config.blockSize * config.lineRatio;
  canvas.ctx.strokeStyle = colors.line;
  canvas.ctx.strokeRect(x, y, size, size);
}

function updateScore() {
  scoreOutput.value = presentReadable(state.score);
  actualOutput.value = state.score;
  multiplier.value = presentReadable(state.value);
}

function presentReadable(score) {
  const units = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion', 'sexdecillion', 'septendecillion', 'octodecillion', 'novemdecillion', 'vigintillion'];
  const values = [1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33, 1e36, 1e39, 1e42, 1e45, 1e48, 1e51, 1e54, 1e57, 1e60];

  for (let i = values.length - 1; i >= 0; i--) {
    if (score >= values[i]) {
      return +(score / values[i]).toFixed(1) + ' ' + units[i];
    }
  }
  return score.toString();
}
