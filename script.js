let colors = ['', 'cyan', 'yellow', 'magenta', 'blue', 'orange', 'lime', 'red', 'purple', 'green', 'black', 'gray', 'brown', 'pink', 'turquoise', 'lightblue', 'seagreen', 'darkkhaki', 'chocolate', 'salmon', 'navy', 'gold', 'deeppink', 'springgreen', 'tomato', 'plum']
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
let piece = getNextPiece();
let state = getEmptyState();

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let blockSize = 40;
let stepInterval = 400;
let intervalId = null;

canvas.width = blockSize * 10;
canvas.height = blockSize * 20;
canvas.style = `
  display: block;
  margin: 30px auto;
  border: 1px solid black;
`;
body.append(canvas);

onkeydown = handleKeyDown;

start();

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
  } else {
    return;
  }

  draw();
}

function start() {
  intervalId = setInterval(tick, stepInterval);
}

function end() {
  clearInterval(intervalId);
}

function getEmptyState() {
  const state = [];
  for (let i = 0; i < 20; i++) {
    state.push(Array(10).fill(0));
  }
  return state;
}

function tick() {
  if (canShift("down")) {
    move("down");
  } else {
    if (!piece.moved) return end();

    freeze();
    evaluateLines();
    piece = getNextPiece();
  }

  draw();
}

function evaluateLines() {
  for (let i = 0; i < state.length; i++) {
    const row = state[i];
    if (row.every((cell) => cell !== 0)) {
      state.splice(i, 1);
      state.unshift(Array(10).fill(0));
      i--;
    }
  }
}

function getNextPiece() {
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

function move(direction) {
  const { x, y } = getShift(direction);
  piece.x += x;
  piece.y += y;
  piece.moved = true;
}

function rotate(shift) {
  piece.x += shift.x;
  piece.y += shift.y;
  piece.shape = rotateShape(piece.shape);
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
  const s = blockSize;
  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (piece.shape[i][j]) {
        ctx.fillStyle = colors[piece.shape[i][j]];
        ctx.fillRect((piece.x + j) * s, (piece.y + i) * s, s, s);
      }
    }
  }
}

function drawState() {
  const s = blockSize;
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (state[i][j]) {
        ctx.fillStyle = colors[state[i][j]];
        ctx.fillRect(j * s, i * s, s, s);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawState();
  drawPiece();
}
