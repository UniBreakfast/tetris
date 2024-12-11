let colors = ['', 'cyan', 'yellow', 'magenta', 'blue', 'orange', 'lime', 'red'];
let pieces = [
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
    piece = { ...piece, shape: rotate(piece.shape) };
  }
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
    piece = getNextPiece();
  }

  draw();
}

function getNextPiece() {
  const index = Math.floor(Math.random() * pieces.length);
  let shape = pieces[index];
  const rotations = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < rotations; i++) {
    shape = rotate(shape);
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

function rotate(shape) {
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
    const {x, y} = getShift(direction);
    const pieceProjection = getPieceProjection(piece.shape, piece.x + x, piece.y + y);
    return !doesIntersect(pieceProjection, state);
  } catch (error) {
    return false;
  }
}

function move(direction) {
  const { x, y } = getShift(direction);
  piece.x += x;
  piece.y += y;
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
