export { move, freeze, rotateShape, rotate, getShift };

import { pauseCover } from "./elements.js";
import { state } from "./state.js";
import { canShift, canRotate } from "./checks.js";
import { draw } from "./drawing.js";

onkeydown = handleKeyDown;

function handleKeyDown(e) {
  const keyMap = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowUp: "up",
    Space: "space",
    Escape: "escape",
    KeyP: "escape",
    KeyW: "up",
    KeyS: "down",
    KeyA: "left",
    KeyD: "right",
  };

  const action = keyMap[e.key] || keyMap[e.code];

  if (action === "left" && canShift("left")) {
    if (!pauseCover.hidden) togglePause();

    move("left");
    
  } else if (action === "right" && canShift("right")) {
    if (!pauseCover.hidden) togglePause();

    move("right");

  } else if (action === "down" && canShift("down")) {
    if (!pauseCover.hidden) togglePause();

    move("down");

  } else if (action === "up") {
    if (!pauseCover.hidden) togglePause();

    const requiredShift = canRotate();

    if (requiredShift) rotate(requiredShift);

  } else if (action === "space") {
    if (!pauseCover.hidden) togglePause();
    else drop();
    
  } else if (action === "escape") {
    togglePause();
  } else {
    return;
  }

  draw();
}

function move(direction) {
  const { piece } = state;
  const { x, y } = getShift(direction);
  piece.x += x;
  piece.y += y;
  piece.moved = true;
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

function drop() {
  while (canShift("down")) move("down");
}

function rotate(shift) {
  const { piece } = state;

  piece.x += shift.x;
  piece.y += shift.y;
  piece.shape = rotateShape(piece.shape);
  piece.moved = true;
}

function freeze() {
  const { piece } = state;

  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[0].length; j++) {
      if (piece.shape[i][j]) {
        state[piece.y + i][piece.x + j] = piece.shape[i][j];
      }
    }
  }
}
