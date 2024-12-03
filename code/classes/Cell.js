export class Cell {
  queued = false;
  value;
  x;
  y;
  walls;
  visited; // Booléen indiquant si la cellule a été visitée (utilisé pour l'algorithme de génération de labyrinthe)
  type; // Type de la cellule (start, end, normal)

  constructor(x, y, value = 0) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
    this.setType("normal");
  }

  setType(type) {
    if (type === "start") {
      this.type = "start";
    } else if (type === "end") {
      this.type = "end";
    } else {
      this.type = "normal";
    }
  }

  setVisited() {
    this.visited = true;
  }

  isQueued() {
    return this.queued;
  }
}

