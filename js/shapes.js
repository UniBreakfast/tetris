export { colors, shapes, rareShapes, mole };

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
