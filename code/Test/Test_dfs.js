import { dfs } from '../algorithms/dfs.js'; // Importer depuis algorithms/dfs.js
import { Maze } from '../classes/Maze.js'; // Importer depuis classes/Maze.js
import { Cell } from '../classes/Cell.js'; // Importer depuis classes/Cell.js

// Mock de Maze et Cell pour les tests
class MockCell {
    constructor() {
        this.visited = false;
        this.walls = { top: false, right: false, bottom: false, left: false };
        this.type = null;
    }

    setVisited(value) {
        this.visited = value;
    }

    isVisited() {
        return this.visited;
    }

    setType(type) {
        this.type = type;
    }
}

class MockMaze {
    constructor(grid, start, end) {
        this.grid = grid;
        this.width = grid[0].length;
        this.height = grid.length;
        this.start = start;
        this.end = end;
    }

    getStartCell() {
        return this.start;
    }

    getEndCell() {
        return this.grid[this.end.row][this.end.col];
    }

    displayMaze() {
        // Simple représentation console pour le labyrinthe
        console.log(this.grid.map(row => row.map(cell => cell.type || '.').join(' ')).join('\n'));
    }

    resetVisitedCells() {
        this.grid.forEach(row => row.forEach(cell => cell.setVisited(false)));
    }
}

// Tests
function testDfs() {
    // Construire un labyrinthe simple
    const grid = [
        [new MockCell(), new MockCell(), new MockCell()],
        [new MockCell(), new MockCell(), new MockCell()],
        [new MockCell(), new MockCell(), new MockCell()]
    ];

    // Ajouter des murs
    grid[0][1].walls.bottom = true; // Mur entre (0,1) et (1,1)

    const start = { x: 0, y: 0 }; // Point de départ
    const end = { row: 2, col: 2 }; // Point d'arrivée

    const maze = new MockMaze(grid, start, end);

    console.log('Labyrinthe initial :');
    maze.displayMaze();

    // Appeler dfs
    const path = dfs(maze);

    console.log('Labyrinthe après DFS :');
    maze.displayMaze();

    // Vérifier que le chemin trouvé est correct
    console.assert(path !== null, 'Aucun chemin trouvé, ce qui est incorrect.');
    console.assert(
        path.length > 0 && path[0].row === start.y && path[0].col === start.x,
        'Le chemin doit commencer au point de départ.'
    );
    console.assert(
        path[path.length - 1].row === end.row && path[path.length - 1].col === end.col,
        'Le chemin doit se terminer au point d\'arrivée.'
    );

    console.log('Test terminé avec succès.');
}

testDfs();