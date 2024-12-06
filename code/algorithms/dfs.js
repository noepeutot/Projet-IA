import { reconstructPath } from "./path.js";

export function dfs(maze) {
    // Pile remplie des coordonnées des cellules à traiter
    const stack = [];

    // Map des parents des cellules
    const parents = new Map();

    // Coordonnées de la cellule de départ
    const startCell = maze.getStartCell();
    let row = startCell.y;
    let col = startCell.x;
    stack.push({ row: row, col: col });

    // Tant que la pile n'est pas vide
    while (stack.length > 0) {
        // Récupérer la cellule à traiter
        const current = stack.pop();
        row = current.row;
        col = current.col;
        maze.grid[row][col].setVisited(true);

        // Vérifier le mur du haut et ajouter la cellule voisine dans la pile et ajouter le parent
        if (row > 0 && !maze.grid[row][col].walls.top && !maze.grid[row - 1][col].isVisited()) {
            stack.push({ row: row - 1, col: col });
            maze.grid[row - 1][col].setVisited(true);
            parents.set(`${row - 1},${col}`, { row, col });
        }
        // Vérifier le mur de droite et ajouter la cellule voisine dans la pile et ajouter le parent
        if (col < maze.width - 1 && !maze.grid[row][col].walls.right && !maze.grid[row][col + 1].isVisited()) {
            stack.push({ row: row, col: col + 1 });
            maze.grid[row][col + 1].setVisited(true);
            parents.set(`${row},${col + 1}`, { row, col });
        }
        // Vérifier le mur du bas et ajouter la cellule voisine dans la pile et ajouter le parent
        if (row < maze.height - 1 && !maze.grid[row][col].walls.bottom && !maze.grid[row + 1][col].isVisited()) {
            stack.push({ row: row + 1, col: col });
            maze.grid[row + 1][col].setVisited(true);
            parents.set(`${row + 1},${col}`, { row, col });
        }
        // Vérifier le mur de gauche et ajouter la cellule voisine dans la pile et ajouter le parent    
        if (col > 0 && !maze.grid[row][col].walls.left && !maze.grid[row][col - 1].isVisited()) {
            stack.push({ row: row, col: col - 1 });
            maze.grid[row][col - 1].setVisited(true);
            parents.set(`${row},${col - 1}`, { row, col });
        }

        // Affichage du labyrinthe à l'étape courante avec les cellules visitées
        /* maze.displayMaze();
        console.log(''); // Ligne vide pour séparer les étapes */

        // Si la cellule est la cellule de fin
        if (maze.grid[row][col] === maze.getEndCell()) {
            // Reconstruire le chemin
            const path = reconstructPath(parents, startCell, { row, col });

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
