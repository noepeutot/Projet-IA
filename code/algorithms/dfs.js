import { reconstructPath } from "./path.js";

/**
 * Algorithme de recherche en profondeur (Depth-First Search)
 * @param {Maze} maze - Labyrinthe
 * @returns {Array} Chemin trouvé
 */
export function dfs(maze) {
    // Pile remplie des coordonnées des cellules à traiter
    const stack = [];

    // Map des parents des cellules
    const parents = new Map();

    // Coordonnées de la cellule de départ
    const startCell = maze.getStartCell();
    let x = startCell.x;
    let y = startCell.y;
    stack.push({ x: x, y: y });

    // Chemin trouvé
    let path = null;

    // Tant que la pile n'est pas vide et que le chemin n'est pas trouvé
    while (stack.length > 0 && !path) {
        // Récupérer la cellule à traiter
        const current = stack.pop();
        x = current.x;
        y = current.y;
        maze.grid[y][x].setVisited(true);

        // Si la cellule est la cellule de fin
        if (maze.grid[y][x] === maze.getEndCell()) {
            // Reconstruire le chemin
            path = reconstructPath(parents, startCell, { x, y });

            // Marquer les cellules du chemin
            path.forEach(pos => {
                maze.grid[pos.y][pos.x].setType("path");
            });

            return path;
        } else {
            // Vérifier le mur du haut et ajouter la cellule voisine dans la pile et ajouter le parent
            if (y > 0 && !maze.grid[y][x].walls.top && !maze.grid[y - 1][x].isVisited()) {
                stack.push({ x: x, y: y - 1 });
                maze.grid[y - 1][x].setVisited(true);
                parents.set(`${x},${y - 1}`, { x, y });
            }
            // Vérifier le mur de droite et ajouter la cellule voisine dans la pile et ajouter le parent
            if (x < maze.width - 1 && !maze.grid[y][x].walls.right && !maze.grid[y][x + 1].isVisited()) {
                stack.push({ x: x + 1, y: y });
                maze.grid[y][x + 1].setVisited(true);
                parents.set(`${x + 1},${y}`, { x, y });
            }
            // Vérifier le mur du bas et ajouter la cellule voisine dans la pile et ajouter le parent
            if (y < maze.height - 1 && !maze.grid[y][x].walls.bottom && !maze.grid[y + 1][x].isVisited()) {
                stack.push({ x: x, y: y + 1 });
                maze.grid[y + 1][x].setVisited(true);
                parents.set(`${x},${y + 1}`, { x, y });
            }
            // Vérifier le mur de gauche et ajouter la cellule voisine dans la pile et ajouter le parent    
            if (x > 0 && !maze.grid[y][x].walls.left && !maze.grid[y][x - 1].isVisited()) {
                stack.push({ x: x - 1, y: y });
                maze.grid[y][x - 1].setVisited(true);
                parents.set(`${x - 1},${y}`, { x, y });
            }
        }
    }

    // Réinitialiser les cellules visitées
    maze.resetVisitedCells();

    return path;
}
