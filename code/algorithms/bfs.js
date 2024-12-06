import {reconstructPath} from "./path.js";

export function bfs(maze) {
    // File remplie des coordonnées des cellules à traiter
    const queue = [];

    // Map des parents des cellules
    const parents = new Map();

    // Coordonnées de la cellule de départ
    const startCell = maze.getStartCell();
    let row = startCell.y;
    let col = startCell.x;
    queue.push({row: row, col: col});

    // Tant que la file n'est pas vide
    while (queue.length > 0) {
        // Récupérer la cellule à traiter
        const current = queue.shift();
        row = current.row;
        col = current.col;
        maze.grid[row][col].setVisited(true);

        // Vérifier si la cellule voisine en haut est valide et non visitée et ajouter à la file et ajouter le parent
        if (row > 0 && !maze.grid[row][col].walls.top && !maze.grid[row - 1][col].isVisited()) {
            queue.push({row: row - 1, col: col});
            maze.grid[row - 1][col].setVisited(true);
            parents.set(`${row - 1},${col}`, {row, col});
        }
        // Vérifier si la cellule voisine à droite est valide et non visitée et ajouter à la file et ajouter le parent
        if (col < maze.width - 1 && !maze.grid[row][col].walls.right && !maze.grid[row][col + 1].isVisited()) {
            queue.push({row: row, col: col + 1});
            maze.grid[row][col + 1].setVisited(true);
            parents.set(`${row},${col + 1}`, {row, col});
        }
        // Vérifier si la cellule voisine en bas est valide et non visitée et ajouter à la file et ajouter le parent
        if (row < maze.height - 1 && !maze.grid[row][col].walls.bottom && !maze.grid[row + 1][col].isVisited()) {
            queue.push({row: row + 1, col: col});
            maze.grid[row + 1][col].setVisited(true);
            parents.set(`${row + 1},${col}`, {row, col});
        }
        // Vérifier si la cellule voisine à gauche est valide et non visitée et ajouter à la file et ajouter le parent
        if (col > 0 && !maze.grid[row][col].walls.left && !maze.grid[row][col - 1].isVisited()) {
            queue.push({row: row, col: col - 1});
            maze.grid[row][col - 1].setVisited(true);
            parents.set(`${row},${col - 1}`, {row, col});
        }

        // Affichage du labyrinthe à l'étape courante avec les cellules visitées
        /* maze.displayMaze(); 
        console.log(''); // Ligne vide pour séparer les étapes */

        // Si la cellule est la cellule de fin
        if (maze.grid[row][col] === maze.getEndCell()) {
            // Reconstruire le chemin
            const path = reconstructPath(parents, startCell, {row, col});

            // Marquer les cellules du chemin
            path.forEach(pos => {
                maze.grid[pos.row][pos.col].setType("path");
            });

            // Afficher le labyrinthe avec le chemin
            maze.displayMaze();
            return path;
        }
    }

    // Réinitialiser les cellules visitées
    maze.resetVisitedCells();

    return null;
}
