import { reconstructPath } from "./path.js";
import { DIRECTIONS } from "./directions.js";

/**
 * Algorithme de recherche en largeur (Breadth-First Search)
 * @param {Maze} maze - Labyrinthe
 * @param {Array} [exploredOrder] - Si fourni, rempli avec l'ordre d'exploration {x, y, parent}
 * @param {boolean} [markPath=true] - Si vrai, marque les cellules du chemin via setType("path")
 * @returns {Array|null} Chemin trouvé ou null
 */
export function bfs(maze, exploredOrder, markPath = true) {
    maze.resetVisitedCells();

    const queue = [];
    const parents = new Map();

    const startCell = maze.getStartCell();
    const endCell = maze.getEndCell();
    queue.push({ x: startCell.x, y: startCell.y });
    startCell.setVisited(true);

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        if (exploredOrder) exploredOrder.push({ x, y, parent: parents.get(`${x},${y}`) || null });

        if (x === endCell.x && y === endCell.y) {
            const path = reconstructPath(parents, startCell, { x, y });
            if (markPath) {
                path.forEach(pos => maze.grid[pos.y][pos.x].setType("path"));
            }
            return path;
        }

        const cell = maze.grid[y][x];
        for (const { dx, dy, wall } of DIRECTIONS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= maze.width || ny >= maze.height) continue;
            if (cell.walls[wall]) continue;
            const neighbor = maze.grid[ny][nx];
            if (neighbor.isVisited()) continue;

            neighbor.setVisited(true);
            queue.push({ x: nx, y: ny });
            parents.set(`${nx},${ny}`, { x, y });
        }
    }

    return null;
}
