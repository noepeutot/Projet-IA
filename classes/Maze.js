import { Cell } from './Cell.js';
import { generatePrim } from '../algorithms/prim.js';
import { generateKruskal } from '../algorithms/kruskal.js';

const GENERATORS = {
    recursive: (m) => m.generateRecursiveMaze(),
    random: (m) => m.generateRandomMaze(),
    prim: (m) => generatePrim(m),
    kruskal: (m) => generateKruskal(m)
};

export class Maze {
    constructor(width, height, type) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
        this.stack = [];
        this.visitedCells = 0;
        this.totalCells = width * height;
        this.setStartCell(this.grid[0][0]);
        this.setEndCell(this.grid[height - 1][width - 1]);

        const generator = GENERATORS[type];
        if (generator) generator(this);
        this.buildVisGrid();
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


    // ===========================
    // ===== Getter & Setter =====
    // ===========================

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


    // ================================================
    // ===== Generation en Recursive Backtracking =====
    // ================================================

    /**
     * Génère le labyrinthe en utilisant l'algorithme de recursive backtracking
     */
    generateRecursiveMaze() {
        this.currentCell = this.grid[this.getRandomInt(this.height)][this.getRandomInt(this.width)];
        this.currentCell.visited = true;
        this.visitedCells++;
        this.stack.push(this.currentCell);

        while (this.visitedCells < this.totalCells) {
            const nextCell = this.getRandomAdjacentCell(this.currentCell);

            if (nextCell) {
                this.removeWall(this.currentCell, nextCell);
                this.stack.push(nextCell);
                this.currentCell = nextCell;
                this.currentCell.visited = true;
                this.visitedCells++;
            } else {
                this.currentCell = this.stack.pop();
            }
        }

        this.resetVisitedCells();
    }

    /**
     * Obtient la distance entre deux cellules
     * @param {Cell} cell1 
     * @param {Cell} cell2 
     * @returns {number}
     */
    getDistanceBetweenCells(cell1, cell2) {
        return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y);
    }

    /**
     * Obtient une cellule adjacente aléatoire
     * @param {Cell} cell 
     * @returns {Cell}
     */
    getRandomAdjacentCell(cell) {
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];

        const unvisitedNeighbors = directions.map(dir => {
            const newX = cell.x + dir.dx;
            const newY = cell.y + dir.dy;

            if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                const neighbor = this.grid[newY][newX];
                return neighbor.visited ? null : neighbor;
            }
            return null;
        }).filter(Boolean);

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
        const dx = next.x - current.x;
        const dy = next.y - current.y;

        if (dx === 1) {
            current.walls.right = false;
            next.walls.left = false;
        } else if (dx === -1) {
            current.walls.left = false;
            next.walls.right = false;
        } else if (dy === 1) {
            current.walls.bottom = false;
            next.walls.top = false;
        } else if (dy === -1) {
            current.walls.top = false;
            next.walls.bottom = false;
        }
    }

    // ================================
    // ===== Generation en Random =====
    // ================================

    /**
     * Génère le labyrinthe en utilisant l'algorithme de random
     */
    generateRandomMaze() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];

                cell.walls.top = (y === 0) ? true : Math.random() < 0.33;
                cell.walls.right = (x === this.width - 1) ? true : Math.random() < 0.33;
                cell.walls.bottom = (y === this.height - 1) ? true : Math.random() < 0.33;
                cell.walls.left = (x === 0) ? true : Math.random() < 0.33;

                if (y > 0) this.grid[y-1][x].walls.bottom = cell.walls.top;
                if (x > 0) this.grid[y][x-1].walls.right = cell.walls.left;
            }
        }

        this.start.walls.right = false;
        this.grid[0][1].walls.left = false;
        this.end.walls.left = false;
        this.grid[this.height-1][this.width-2].walls.right = false;
    }

    // =======================
    // ===== Utilitaires =====
    // =======================

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
        if (this.player) this.player.setPosition(this.start.x * 2 + 1, this.start.y * 2 + 1);
        if (this.aiPlayer) this.aiPlayer.setPosition(this.start.x * 2 + 1, this.start.y * 2 + 1);
        this.resetPath();
    }

    /**
     * Réinitialise les chemins
     */
    resetPath() {
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
     * Cache le chemin
     */
    hidePath() {
        this.grid.forEach(row => {
            row.forEach(cell => cell.setType("normal"));
        });
    }


    // ===================
    // ===== Joueurs =====
    // ===================

    /**
     * Ajoute un joueur au labyrinthe
     * @param {Player} player - Le joueur à ajouter
     * @param {Cell} startCell - La cellule de départ du joueur
     */
    addPlayer(player, startCell) {
        this.player = player;
        this.player.setPosition(startCell.x * 2 + 1, startCell.y * 2 + 1);
    }

    /**
     * Ajoute un joueur IA au labyrinthe
     * @param {Player} aiPlayer - Le joueur IA à ajouter
     * @param {Cell} startCell - La cellule de départ du joueur IA
     */
    addAIPlayer(aiPlayer, startCell) {
        this.aiPlayer = aiPlayer;
        this.aiPlayer.setPosition(startCell.x * 2 + 1, startCell.y * 2 + 1);
    }

    /**
     * Construit la grille visuelle (2N+1)×(2N+1)
     * Stocke le type de chaque bloc : 'wall', 'room' ou 'passage'
     */
    buildVisGrid() {
        const visWidth = this.width * 2 + 1;
        const visHeight = this.height * 2 + 1;
        this.visGrid = Array(visHeight).fill(null).map(() => Array(visWidth).fill('wall'));

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const vx = x * 2 + 1;
                const vy = y * 2 + 1;
                const cell = this.grid[y][x];

                this.visGrid[vy][vx] = 'room';
                if (!cell.walls.top)    this.visGrid[vy - 1][vx] = 'passage';
                if (!cell.walls.right)  this.visGrid[vy][vx + 1] = 'passage';
                if (!cell.walls.bottom) this.visGrid[vy + 1][vx] = 'passage';
                if (!cell.walls.left)   this.visGrid[vy][vx - 1] = 'passage';
            }
        }
    }

    /**
     * Déplace le joueur d'un bloc visuel dans la grille (2N+1)
     * @param {Player} player - Le joueur à déplacer
     * @param {string} direction - La direction ('up', 'right', 'down', 'left')
     * @returns {boolean} - True si le mouvement est possible
     */
    movePlayerVisual(player, direction) {
        const cx = player.x;
        const cy = player.y;

        const deltas = {
            'up':    { dx: 0, dy: -1 },
            'right': { dx: 1, dy: 0 },
            'down':  { dx: 0, dy: 1 },
            'left':  { dx: -1, dy: 0 }
        };

        const delta = deltas[direction];
        if (!delta) return false;

        const nx = cx + delta.dx;
        const ny = cy + delta.dy;

        const visWidth = this.width * 2 + 1;
        const visHeight = this.height * 2 + 1;

        if (nx < 0 || ny < 0 || nx >= visWidth || ny >= visHeight) return false;
        if (this.visGrid[ny][nx] === 'wall') return false;

        player.setPosition(nx, ny);
        return true;
    }

    /**
     * Définit la position du joueur
     * @param {number} column - Position en x
     * @param {number} row - Position en y
     */
    setPlayerPosition(column, row) {
        this.player.setPosition(column, row);
    }


    // =========================
    // ===== Vérifications =====
    // =========================

    /**
     * Vérifie si le joueur a atteint la cellule de fin
     * @returns {boolean} - True si le joueur a atteint la cellule de fin, False sinon
     */
    isFinished() {
        const endVx = this.end.x * 2 + 1;
        const endVy = this.end.y * 2 + 1;
        return this.player.x === endVx && this.player.y === endVy;
    }

    /**
     * Vérifie si le joueur IA a atteint la cellule de fin
     * @returns {boolean} - True si le joueur IA a atteint la cellule de fin, False sinon
     */
    isAIFinished() {
        if (!this.aiPlayer) return false;
        const endVx = this.end.x * 2 + 1;
        const endVy = this.end.y * 2 + 1;
        return this.aiPlayer.x === endVx && this.aiPlayer.y === endVy;
    }


    // =====================
    // ===== Affichage =====
    // =====================

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

}
