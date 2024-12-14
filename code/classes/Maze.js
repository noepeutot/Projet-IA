import {Cell} from './Cell.js';

export class Maze {
    constructor(width, height) {
        this.width = width; // Largeur du labyrinthe
        this.height = height; // Hauteur du labyrinthe
        this.grid = this.createGrid(); // Grille de cellules
        this.stack = []; // Pile pour l'algorithme de backtracking
        this.currentCell = this.grid[this.getRandomInt(width)][this.getRandomInt(height)]; // Cellule de départ aléatoire
        this.visitedCells = 0; // Nombre de cellules visitées
        this.totalCells = width * height; // Nombre total de cellules
        this.setStartCell(this.grid[0][0]); // Cellule de départ du labyrinthe
        this.setEndCell(this.grid[height - 1][width - 1]); // Cellule de fin du labyrinthe
        this.generateMaze(); // Génération du labyrinthe
    }

    /**
     * Crée une grille de cellules
     * @returns {Array}
     */
    createGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(
                    new Cell(x, y)
                );
            }
            grid.push(row);
        }
        return grid;
    }

    /**
     * Obtient la cellule de départ
     * @returns {Cell}
     */
    getStartCell() {
        return this.start;
    }

    /**
     * Obtient la cellule de fin
     * @returns {Cell}
     */
    getEndCell() {
        return this.end;
    }

    /**
     * Définit la cellule de départ
     * @param {Cell} cell 
     */
    setStartCell(cell) {
        this.start = cell;
        cell.setType("start");
    }

    /**
     * Définit la cellule de fin
     * @param {Cell} cell 
     */
    setEndCell(cell) {
        this.end = cell;
        cell.setType("end");
    }

    /**
     * Génère le labyrinthe en utilisant l'algorithme de recursive backtracking
     */
    generateMaze() {
        // Marque la cellule courante comme visitée
        this.currentCell.visited = true;
        this.visitedCells++;
        this.stack.push(this.currentCell);

        // Continue tant qu'il reste des cellules non visitées
        while (this.visitedCells < this.totalCells) {
            // Trouve une cellule adjacente non visitée
            const nextCell = this.getRandomAdjacentCell(this.currentCell);

            if (nextCell) {
                // Si trouvée, casse le mur et avance
                this.removeWall(this.currentCell, nextCell);
                this.stack.push(nextCell);
                this.currentCell = nextCell;
                this.currentCell.visited = true;
                this.visitedCells++;
            } else {
                // Sinon retourne à la cellule précédente
                this.currentCell = this.stack.pop();
            }
        }

        // Réinitialise les cellules visitées
        this.resetVisitedCells();
    }

    /**
     * Obtient une cellule adjacente aléatoire
     * @param {Cell} cell 
     * @returns {Cell}
     */
    getRandomAdjacentCell(cell) {
        // Définit les directions possibles
        const directions = [
            { dx: 0, dy: -1 }, // Haut
            { dx: 1, dy: 0 },  // Droite
            { dx: 0, dy: 1 },  // Bas
            { dx: -1, dy: 0 }  // Gauche
        ];

        // Map les directions pour obtenir les cellules voisines
        const unvisitedNeighbors = directions.map(dir => {
            const newX = cell.x + dir.dx;
            const newY = cell.y + dir.dy;

            // Vérifie si la cellule est dans les limites de la grille
            if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                // Obtient la cellule voisine
                const neighbor = this.grid[newY][newX];

                // Définit les coordonnées de la cellule voisine
                neighbor.x = newX;
                neighbor.y = newY;

                // Retourne la cellule voisine si elle n'a pas été visitée
                return neighbor.visited ? null : neighbor;
            }
            return null;
        }).filter(Boolean);

        // Si des cellules voisines non visitées sont trouvées, retourne une aléatoirement
        if (unvisitedNeighbors.length > 0) {
            return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
        }
        return null;
    }

    /**
     * Supprime le mur entre deux cellules
     * @param {Cell} current 
     * @param {Cell} next 
     */
    removeWall(current, next) {
        // Calcule la différence de position entre les cellules
        const dx = next.x - current.x;
        const dy = next.y - current.y;

        // Si la cellule suivante est à droite, casse le mur droit de la cellule courante et inversement
        if (dx === 1) {
            current.walls.right = false;
            next.walls.left = false;
        } 
        // Si la cellule suivante est à gauche, casse le mur gauche de la cellule courante et inversement
        else if (dx === -1) {
            current.walls.left = false;
            next.walls.right = false;
        }
        // Si la cellule suivante est en bas, casse le mur bas de la cellule courante et inversement
        else if (dy === 1) {
            current.walls.bottom = false;
            next.walls.top = false;
        }
        // Si la cellule suivante est en haut, casse le mur haut de la cellule courante et inversement  
        else if (dy === -1) {
            current.walls.top = false;
            next.walls.bottom = false;
        }
    }

    /**
     * Obtient un nombre aléatoire entier
     * @param {number} max 
     * @returns {number}
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    

    /**
     * Réinitialise les cellules visitées
     */
    resetVisitedCells() {
        this.visitedCells = 0;
        this.grid.forEach(row => {
            row.forEach(cell => cell.setVisited(false));
        });
    }

    /**
     * Affiche le labyrinthe
     */
    displayMaze() {
        for (let y = 0; y < this.height; y++) {
            let topLine = '';
            let middleLine = '';
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                topLine += cell.walls.top ? '+---' : '+   ';
                
                // Définir le caractère à afficher selon le type de cellule
                let cellChar = ' ';
                if (cell === this.getStartCell()) {
                    cellChar = 'E';
                } else if (cell === this.getEndCell()) {
                    cellChar = 'S';
                } else if (cell.getType() === "path") {
                    cellChar = '●';
                } else if (cell.isVisited()) {
                    cellChar = 'x';
                }
                
                middleLine += cell.walls.left ? `| ${cellChar} ` : `  ${cellChar} `;
            }
            console.log(topLine + '+');
            console.log(middleLine + '|');
        }
        console.log('+---'.repeat(this.width) + '+');
    }
}
