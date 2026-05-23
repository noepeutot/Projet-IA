export class Cell {
  x;
  y;
  walls;
  visited;
  type;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.setVisited(false);
    this.setType("normal");
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
    this.type = (type === "start" || type === "end" || type === "path") ? type : "normal";
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
   * @param {Boolean} bool
   */
  setVisited(bool = true) {
    this.visited = bool;
  }

  /**
   * Retourne si la cellule a été visitée
   * @returns {Boolean}
   */
  isVisited() {
    return this.visited;
  }
}
