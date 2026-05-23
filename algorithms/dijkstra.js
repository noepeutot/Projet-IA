import { reconstructPath } from "./path.js";
import { DIRECTIONS } from "./directions.js";

/**
 * Algorithme de Dijkstra (plus court chemin avec coût uniforme = 1).
 * @param {Maze} maze
 * @param {Array} [exploredOrder]
 * @param {boolean} [markPath=true]
 * @returns {Array|null}
 */
export function dijkstra(maze, exploredOrder, markPath = true) {
    const startCell = maze.getStartCell();
    const endCell = maze.getEndCell();

    const key = (x, y) => `${x},${y}`;
    const dist = new Map();
    const parents = new Map();
    const visited = new Set();
    const open = [{ x: startCell.x, y: startCell.y }];
    dist.set(key(startCell.x, startCell.y), 0);

    while (open.length > 0) {
        let bestIdx = 0;
        let bestD = dist.get(key(open[0].x, open[0].y));
        for (let i = 1; i < open.length; i++) {
            const d = dist.get(key(open[i].x, open[i].y));
            if (d < bestD) { bestD = d; bestIdx = i; }
        }
        const current = open.splice(bestIdx, 1)[0];
        const ck = key(current.x, current.y);

        if (visited.has(ck)) continue;
        visited.add(ck);
        if (exploredOrder) exploredOrder.push({ x: current.x, y: current.y, parent: parents.get(ck) || null });

        if (current.x === endCell.x && current.y === endCell.y) {
            const path = reconstructPath(parents, startCell, { x: current.x, y: current.y });
            if (markPath) {
                path.forEach(pos => maze.grid[pos.y][pos.x].setType("path"));
            }
            return path;
        }

        const cell = maze.grid[current.y][current.x];
        for (const { dx, dy, wall } of DIRECTIONS) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            if (nx < 0 || ny < 0 || nx >= maze.width || ny >= maze.height) continue;
            if (cell.walls[wall]) continue;

            const nk = key(nx, ny);
            if (visited.has(nk)) continue;

            const newDist = bestD + 1;
            const knownDist = dist.has(nk) ? dist.get(nk) : Infinity;
            if (newDist < knownDist) {
                dist.set(nk, newDist);
                parents.set(nk, { x: current.x, y: current.y });
                open.push({ x: nx, y: ny });
            }
        }
    }

    return null;
}
