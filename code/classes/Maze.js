import { Cell } from './Cell.js';

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

    getDistanceBetweenCells(cell1, cell2) {
        return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y);
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
     * Réinitialise le labyrinthe et le joueur
     */
    resetMaze() {
        // Replacer le joueur à la case départ
        this.player.setPosition(this.start.x, this.start.y);

        // Enlever tous les chemins
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.getType() === "path") {
                    cell.setType("normal");
                }
                cell.setVisited(false);
            });
        });
    }

    /**
     * Ajoute un joueur au labyrinthe
     * @param {Player} player - Le joueur à ajouter
     * @param {Cell} startCell - La cellule de départ du joueur
     */
    addPlayer(player, startCell) {
        this.player = player;
        this.player.setPosition(startCell.x, startCell.y);
    }

    /**
     * Déplace le joueur dans le labyrinthe
     * @param {Player} player - Le joueur à déplacer
     * @param {string} direction - La direction du mouvement ('up', 'right', 'down', 'left')
     * @returns {boolean} - True si le mouvement est possible, False sinon
     */
    movePlayer(player, direction) {
        // Obtenir la position actuelle du joueur
        const currentX = player.x;
        const currentY = player.y;
        const currentCell = this.grid[currentY][currentX];

        // Définir les mouvements possibles
        const moves = {
            'up': {
                possible: !currentCell.walls.top && currentY > 0,
                newX: currentX,
                newY: currentY - 1
            },
            'right': {
                possible: !currentCell.walls.right && currentX < this.width - 1,
                newX: currentX + 1,
                newY: currentY
            },
            'down': {
                possible: !currentCell.walls.bottom && currentY < this.height - 1,
                newX: currentX,
                newY: currentY + 1
            },
            'left': {
                possible: !currentCell.walls.left && currentX > 0,
                newX: currentX - 1,
                newY: currentY
            }
        };

        // Si le mouvement est possible dans la direction donnée
        if (moves[direction] && moves[direction].possible) {
            player.setPosition(moves[direction].newX, moves[direction].newY);
            return true;
        }

        return false;
    }

    /**
     * Définit la position du joueur
     * @param {number} column - Position en x
     * @param {number} row - Position en y
     */
    setPlayerPosition(column, row) {
        this.player.setPosition(column, row);
    }

    /**
     * Vérifie si le joueur a atteint la cellule de fin
     * @returns {boolean} - True si le joueur a atteint la cellule de fin, False sinon
     */
    isFinished() {
        return this.player.getPosition().column === this.end.x && this.player.getPosition().row === this.end.y;
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

                // Vérifier si un joueur est sur cette cellule
                if (this.player && this.player.getPosition().column === x && this.player.getPosition().row === y) {
                    cellChar = 'P';
                }

                middleLine += cell.walls.left ? `| ${cellChar} ` : `  ${cellChar} `;
            }
            console.log(topLine + '+');
            console.log(middleLine + '|');
        }
        console.log('+---'.repeat(this.width) + '+');
    }

    /**
     * Rend le labyrinthe en HTML
     * @param {HTMLElement} container - L'élément conteneur où afficher le labyrinthe
     */
    renderMaze(container) {
        container.innerHTML = '';
        const mazeElement = document.createElement('div');
        mazeElement.className = 'maze';

        // Définir la grille CSS en fonction de la taille du labyrinthe
        mazeElement.style.display = 'grid';
        mazeElement.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        mazeElement.style.gap = '0';

        // Créer chaque cellule
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';

                // Ajouter les classes pour les murs
                if (cell.walls.top) cellElement.classList.add('wall-top');
                if (cell.walls.right) cellElement.classList.add('wall-right');
                if (cell.walls.bottom) cellElement.classList.add('wall-bottom');
                if (cell.walls.left) cellElement.classList.add('wall-left');

                // Ajouter les classes pour les types spéciaux
                if (cell === this.start) cellElement.classList.add('start');
                if (cell === this.end) cellElement.classList.add('end');
                if (cell.getType() === "path") cellElement.classList.add('path');

                // Ajouter le joueur s'il est sur cette cellule
                if (this.player && this.player.getPosition().column === x && this.player.getPosition().row === y) {
                    cellElement.classList.add('player');
                }

                mazeElement.appendChild(cellElement);
            }
        }

        container.appendChild(mazeElement);
    }
}
