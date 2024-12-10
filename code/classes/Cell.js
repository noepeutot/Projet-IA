export class Cell {
  queued = false; // Booléen indiquant si la cellule est dans la pile (utilisé pour l'algorithme DFS)
  x; // Coordonnée x de la cellule
  y; // Coordonnée y de la cellule
  cout; // Coût de la cellule (utilisé pour l'algorithme A*)
  heuristique; // Heuristique de la cellule (utilisé pour l'algorithme A*)
  value; // Valeur de la cellule
  walls; // Objets contenant les murs de la cellule
  visited; // Booléen indiquant si la cellule a été visitée (utilisé pour l'algorithme de génération de labyrinthe et les algorithmes de recherche)
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
      this.value = "E"
    } else if (type === "end") {
      this.type = "end";
      this.value = "S"
    } else {
      this.type = "normal";
    }
  }

  setVisited(bool = true) {
    this.visited = bool;
  }

  isVisited() {
    return this.visited;
  }

  isQueued() {
    return this.queued;
  }
}

