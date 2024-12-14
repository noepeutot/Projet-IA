export class Player {
    name;
    x;
    y;

    constructor(name = 'Player') {
        this.setName(name);
        this.setPosition(0, 0);
    }

    /**
     * Définit le nom du joueur
     * @param {string} name - Nom du joueur
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Définit la position du joueur
     * @param {number} x - Position en x
     * @param {number} y - Position en y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Obtient la position du joueur
     * @returns {Object} - La position du joueur {column, row}
     */
    getPosition() {
        return { row: this.y, column: this.x };
    }
}