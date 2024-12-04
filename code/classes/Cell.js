export class Cell {
  queued = false;
  visited = false;
  value;
  x;
  y;

  constructor(x, y, value = 0) {
    this.value = value;
    this.x = x;
    this.y = y;
  }

  isQueued() {
    return this.queued;
  }
}

