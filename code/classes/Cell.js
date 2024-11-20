export class Cell {
  queued = false;
  value;
  x;
  y;
  walls;
  visited;

  constructor(x, y, value = 0) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }

  isQueued() {
    return this.queued;
  }
}

