export class Cell {
  queued = false; // Booléen indiquant si la cellule est dans la pile (utilisé pour l'algorithme DFS)
  x; // Coordonnée x de la cellule
  y; // Coordonnée y de la cellule
  walls; // Objets contenant les murs de la cellule
  visited; // Booléen indiquant si la cellule a été visitée (utilisé pour l'algorithme de génération de labyrinthe et les algorithmes de recherche)
  type; // Type de la cellule (start, end, normal, path)

  constructor(x, y, value = 0) {
    this.value = value; 
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.setVisited(false);
    this.setType("normal");
    this.isOnPath = false;
  }

  /**
   * Définit le type de la cellule
   * start : cellule de départ
   * end : cellule de fin
   * path : cellule sur le chemin
   * normal : cellule normale
   * @param {String} type - Type de la cellule
   */
  setType(type) {
    if (type === "start") {
      this.type = "start";
    } else if (type === "end") {
      this.type = "end";
    } else if (type === "path") {
      this.type = "path";
    } else {
      this.type = "normal";
    }
  }

  /**
   * Retourne le type de la cellule
   * @returns {String} - Type de la cellule
   */
  getType() {
    return this.type;
  }

  /**
   * Définit si la cellule a été visitée
   * true : la cellule a été visitée
   * false : la cellule n'a pas été visitée
   * @param {Boolean} bool 
   */
  setVisited(bool = true) {
    this.visited = bool;
  }

  /**
   * Retourne si la cellule a été visitée
   * @returns {Boolean} - Booléen indiquant si la cellule a été visitée
   */
  isVisited() {
    return this.visited;
  }

  /**
   * Retourne si la cellule est dans la file
   * @returns {Boolean} - Booléen indiquant si la cellule est dans la file
   */
  isQueued() {
    return this.queued;
  }
}

