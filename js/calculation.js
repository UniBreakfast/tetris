export {
  getInitialX, getInitialY,
  getPieceProjection, doesIntersect,
  cropShape,
};

  import { config } from "./config.js";
import { getEmptyState } from "./state.js";

function getInitialX(shape) {
  const round = Math.random() < 0.5 ? Math.floor : Math.ceil;
  const shift = getStartXShift(shape);

  return round((10 - getActualWidth(shape)) / 2) - shift;
}

function getInitialY(shape) {
  return -getStartYShift(shape);
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

function getPieceProjection(shape, x, y) {
  const projection = getEmptyState();

  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) {
        if (
          x + j < 0 
          || x + j >= config.columnCount 
          || y + i < 0 
          || y + i >= config.rowCount
        ) throw new Error("Out of bounds");
        
        projection[y + i][x + j] = shape[i][j];

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
