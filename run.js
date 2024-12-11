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


function getNextPiece() {
  const index = Math.floor(Math.random() * pieces.length);
  let shape = pieces[index];
  const rotations = Math.floor(Math.random() * 4);

  for (let i = 0; i < rotations; i++) {
    shape = rotate(shape);
  }
  return { shape, x: getInitialX(shape), y: getInitialY(shape) };
}

function getInitialX(shape) {
  const round = Math.random() < 0.5 ? Math.floor : Math.ceil;
  const shift = getStartXShift(shape);

  return round((10 - getActualWidth(shape)) / 2) - shift;
}

function getInitialY(shape) {
  return 0 - getStartYShift(shape);
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

function show(shape) {
  return shape.map((row) => row.join("")).join("\n") + "\n";
}


for (let i = 0; i < 30; i++) {
  const {shape, ...piece} = getNextPiece();
  console.log(show(shape), piece, '\n\n');
}
