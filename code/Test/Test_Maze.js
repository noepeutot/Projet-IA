import { Maze } from '../classes/Maze.js';
import { Cell } from '../classes/Cell.js';

function testMaze() {
    // Créer un labyrinthe de test
    const width = 4;
    const height = 4;
    const maze = new Maze(width, height);

    console.log('Labyrinthe généré :');
    maze.displayMaze();

    // Vérifications de base sur le labyrinthe

    // Vérifier la taille de la grille
    console.assert(
        maze.grid.length === height && maze.grid[0].length === width,
        `Erreur : La grille devrait être de taille ${width}x${height}`
    );

    // Vérifier que la cellule de départ est marquée correctement
    const startCell = maze.getStartCell();
    console.assert(
        startCell.getType() === 'start',
        'Erreur : La cellule de départ n\'est pas marquée correctement.'
);

    // Vérifier que la cellule de fin est marquée correctement
    const endCell = maze.getEndCell();
    console.assert(
        endCell.getType() === 'end',
        'Erreur : La cellule de fin n\'est pas marquée correctement.'
);

    // Vérifier que les cellules sont connectées sans murs bloquants
    let allCellsVisited = true;
    maze.grid.forEach(row => {
        row.forEach(cell => {
            if (!cell.isVisited()) {
                allCellsVisited = false;
            }
        });
    });
    console.assert(
        allCellsVisited,
        'Erreur : Toutes les cellules du labyrinthe devraient être accessibles après génération.'
    );

    console.log('Test de Maze terminé avec succès.');
}

testMaze();