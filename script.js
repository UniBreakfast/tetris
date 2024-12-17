const score = document.getElementById("score");
const glass = document.getElementById("glass");
const reward = document.getElementById("reward");
const multiplier = document.getElementById("multiplier");
const pauseCover = document.getElementById("pause");

let columnCount = 10;
let rowCount = 20;
const colors = ['', 'cyan', 'yellow', 'magenta', 'blue', 'orange', 'lime', 'red', 'purple', 'green', 'lightgreen', 'gray', 'brown', 'pink', 'turquoise', 'lightblue', 'seagreen', 'darkkhaki', 'chocolate', 'salmon', 'navy', 'gold', 'deeppink', 'springgreen', 'tomato', 'plum'];
colors[-1] = 'black';
colors.line = '#777';

const shapes = [
  [ // I
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [ // O
    [2, 2],
    [2, 2],
  ],
  [ // T
    [0, 0, 0],
    [3, 3, 3],
    [0, 3, 0],
  ],
  [ // J
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
  ],
  [ // L
    [0, 5, 0],
    [0, 5, 0],
    [0, 5, 5],
  ],
  [ // S
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  [ // Z
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];
const rareShapes = [
  [ // dot
    [8],
  ],
  [ // plus
    [0, 9, 0],
    [9, 9, 9],
    [0, 9, 0],
  ],
  [ // dash
    [10, 10],
    [0, 0],
  ],
  [ // corner
    [11, 0],
    [11, 11],
  ],
  [ // minus
    [0, 12, 0],
    [0, 12, 0],
    [0, 12, 0],
  ],
  [ // C 
    [0, 13, 13],
    [0, 13, 0],
    [0, 13, 13],
  ],
  [ // T
    [14, 14, 14],
    [0, 14, 0],
    [0, 14, 0],
  ],
  [ // Z
    [15, 15, 0],
    [0, 15, 0],
    [0, 15, 15],
  ],
  [ // bar
    [16, 16, 16],
    [16, 16, 16],
    [0, 0, 0],
  ],
  [ // big corner
    [17, 0, 0],
    [17, 0, 0],
    [17, 17, 17],
  ],
  [ // left key
    [0, 18, 0],
    [18, 18, 18],
    [18, 0, 0],
  ],
  [ // right key
    [0, 19, 0],
    [19, 19, 19],
    [0, 0, 19],
  ],
  [ // long line
    [0, 0, 20, 0, 0],
    [0, 0, 20, 0, 0],
    [0, 0, 20, 0, 0],
    [0, 0, 20, 0, 0],
    [0, 0, 20, 0, 0],
  ],
  [ // long L
    [0, 21, 0, 0],
    [0, 21, 0, 0],
    [0, 21, 0, 0],
    [0, 21, 21, 0],
  ],
  [ // long J
    [0, 0, 22, 0],
    [0, 0, 22, 0],
    [0, 0, 22, 0],
    [0, 22, 22, 0],
  ],
  [ // left drop
    [0, 23, 0],
    [0, 23, 23],
    [0, 23, 23],
  ],
  [ // right drop
    [0, 24, 0],
    [24, 24, 0],
    [24, 24, 0],
  ],
  [
    // triangle
    [25, 0, 0],
    [25, 25, 0],
    [25, 25, 25],
  ]
];
const mole = [[-1]];
const lineRatio = 1/30;
let piece = getNextPiece();
let state = getEmptyState();
let nextPiece = getNextPiece();

let blockSize
let stepInterval = 400;
let intervalId = null;
let value = 1;

glass.ctx = glass.getContext("2d");
next.ctx = next.getContext("2d");

onresize = updateSizing;
onkeydown = handleKeyDown;

updateSizing();
start();

function updateSizing() {
  updateGlassSizing();
  updateNextSizing();
  drawNext();
  draw();
}

function updateGlassSizing() {
  blockSize = innerHeight / rowCount;
  glass.width = blockSize * columnCount;
  glass.height = blockSize * rowCount;
}

function updateNextSizing() {
  const { width, height } = cropShape(nextPiece.shape);
  next.width = blockSize * width;
  next.height = blockSize * height;
}

function handleKeyDown(e) {
  if (e.key === "ArrowLeft" && canShift("left")) {
    move("left");
  } else if (e.key === "ArrowRight" && canShift("right")) {
    move("right");
  } else if (e.key === "ArrowDown" && canShift("down")) {
    move("down");
  } else if (e.key === "ArrowUp") {
    const requiredShift = canRotate();

    if (requiredShift) {
      rotate(requiredShift);
    }
  } else if (e.key === "Space" || e.key === ' ') {
    drop();
  } else if (e.key === "Escape" || e.code === 'KeyP') {
    togglePause();
  } else {
    return;
  }

  draw();
}

function start() {
  intervalId = setInterval(tick, stepInterval);
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

function end() {
  clearInterval(intervalId);
}

function getEmptyState() {
  const state = [];
  for (let i = 0; i < rowCount; i++) {
    state.push(Array(columnCount).fill(0));
  }
  return state;
}

function tick() {
  if (canShift("down") || piece.shape === mole && canBurrow()) {
    move("down");
  } else {
    if (!piece.moved) return end();

    freeze();
    evaluateLines();
    piece = nextPiece;
    nextPiece = getNextPiece();
    drawNext();
  }

  draw();
}

function evaluateLines() {
  let noLines = true;
  for (let i = 0; i < state.length; i++) {
    const row = state[i];
    if (row.every((cell) => cell !== 0)) {
      state.splice(i, 1);
      state.unshift(Array(10).fill(0));
      i--;
      score.value = Number(score.value) + value;
      value *= 2;
      multiplier.value = value;
      noLines = false;
    }
  }
  if (noLines && value > 1) {
    value -= Math.ceil(value / 4);
    multiplier.value = value;
  }
}

function cropShape(shape) {
  const width = getActualWidth(shape);
  const height = getActualHeight(shape);
  const xShift = getStartXShift(shape);
  const yShift = getStartYShift(shape);

  return {
    width, height,
    shape: shape.slice(yShift, yShift + height)
      .map(row => row.slice(xShift, xShift + width)),
  }
}

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

function getInitialX(shape) {
  const round = Math.random() < 0.5 ? Math.floor : Math.ceil;
  const shift = getStartXShift(shape);

  return round((10 - getActualWidth(shape)) / 2) - shift;
}

function getInitialY(shape) {
  return -getStartYShift(shape);
}

function getActualWidth(shape) {
  let width = shape[0].length;

  out: for (let i = 0; i < shape[0].length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[j][i]) break out;
    }
    width--;

    if (width === 0) return width;
  }

  out: for (let i = shape[0].length - 1; i >= 0; i--) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[j][i]) break out;
    }
    width--;
  }

  return width;
}

function getActualHeight(shape) {
  let height = shape.length;

  out: for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) break out;
    }
    height--;

    if (height === 0) return height;
  }

  out: for (let i = shape.length - 1; i >= 0; i--) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) break out;
    }
    height--;
  }

  return height;
}

function getStartXShift(shape) {
  let shift = 0;

  for (let i = 0; i < shape[0].length; i++) {
    for (let j = 0; j < shape.length; j++) {
      if (shape[j][i]) return shift;
    }

    shift++;
  }

  return shift;
}

function getStartYShift(shape) {
  let shift = 0;

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) return shift;
    }

    shift++;
  }

  return shift;
}

function rotateShape(shape) {
  const rotated = [];
  for (let i = 0; i < shape[0].length; i++) {
    rotated.push([]);
    for (let j = shape.length - 1; j >= 0; j--) {
      rotated[i].push(shape[j][i]);
    }
  }
  return rotated;
}

function getShift(direction) {
  switch (direction) {
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "down":
      return { x: 0, y: 1 };
    case "up":
      return { x: 0, y: -1 };
  }
}

function canShift(direction) {
  try {
    const { x, y } = getShift(direction);
    const pieceProjection = getPieceProjection(piece.shape, piece.x + x, piece.y + y);
    return !doesIntersect(pieceProjection, state);
  } catch (error) {
    return false;
  }
}

function canRotate() {
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
  return state.slice(piece.y + 1).map(row => row[piece.x])
    .some(filled => !filled);
}

function move(direction) {
  const { x, y } = getShift(direction);
  piece.x += x;
  piece.y += y;
  piece.moved = true;
}

function drop() {
  while (canShift("down")) move("down");
}

function rotate(shift) {
  piece.x += shift.x;
  piece.y += shift.y;
  piece.shape = rotateShape(piece.shape);
  piece.moved = true;
}

function freeze() {
  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (piece.shape[i][j]) {
        state[piece.y + i][piece.x + j] = piece.shape[i][j];
      }
    }
  }
}

function getPieceProjection(shape, x, y) {
  const projection = getEmptyState();

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) {
        projection[y + i][x + j] = shape[i][j];

        if (x + j < 0 || x + j >= 10) throw new Error("Out of bounds");
      }
    }
  }
  return projection;
}

function doesIntersect(projection, state) {
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (projection[i][j] && state[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function drawPiece() {
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

function drawSquare(canvas, x, y, size, color) {
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillRect(x, y, size, size);

  canvas.ctx.lineWidth = blockSize * lineRatio;
  canvas.ctx.strokeStyle = colors.line;
  canvas.ctx.strokeRect(x, y, size, size);
}

function drawState() {
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

function draw() {
  glass.ctx.clearRect(0, 0, glass.width, glass.height);

  drawState();
  drawPiece();
}

function drawNext() {
  const {shape} = cropShape(nextPiece.shape);

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
