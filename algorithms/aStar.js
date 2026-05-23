import { reconstructPath } from "./path.js";
import { DIRECTIONS } from "./directions.js";

/**
 * Algorithme A*. N'écrit pas sur les cellules : tout l'état (gScore, fScore, parents)
 * est stocké dans des Maps locales pour permettre des appels concurrents/répétés.
 * @param {Maze} maze
 * @param {Array} [exploredOrder] - rempli avec l'ordre d'exploration {x, y}
 * @param {boolean} [markPath=true]
 * @returns {Array|null}
 */
export function aStar(maze, exploredOrder, markPath = true) {
    const startCell = maze.getStartCell();
    const endCell = maze.getEndCell();

    const key = (x, y) => `${x},${y}`;
    const heuristic = (x, y) => Math.abs(x - endCell.x) + Math.abs(y - endCell.y);

    const gScore = new Map();
    const fScore = new Map();
    const parents = new Map();
    const closed = new Set();
    const open = [];
    const openSet = new Set();

    const startKey = key(startCell.x, startCell.y);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(startCell.x, startCell.y));
    open.push({ x: startCell.x, y: startCell.y });
    openSet.add(startKey);

    while (open.length > 0) {
        let bestIdx = 0;
        let bestF = fScore.get(key(open[0].x, open[0].y));
        for (let i = 1; i < open.length; i++) {
            const f = fScore.get(key(open[i].x, open[i].y));
            if (f < bestF) { bestF = f; bestIdx = i; }
        }
        const current = open.splice(bestIdx, 1)[0];
        const ck = key(current.x, current.y);
        openSet.delete(ck);
        closed.add(ck);
        if (exploredOrder) exploredOrder.push({ x: current.x, y: current.y, parent: parents.get(ck) || null });

        if (current.x === endCell.x && current.y === endCell.y) {
            const path = reconstructPath(parents, startCell, { x: current.x, y: current.y });
            if (markPath) {
                path.forEach(pos => maze.grid[pos.y][pos.x].setType("path"));
            }
            return path;
        }

        const cell = maze.grid[current.y][current.x];
        const tentativeG = gScore.get(ck) + 1;

        for (const { dx, dy, wall } of DIRECTIONS) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            if (nx < 0 || ny < 0 || nx >= maze.width || ny >= maze.height) continue;
            if (cell.walls[wall]) continue;

            const nk = key(nx, ny);
            if (closed.has(nk)) continue;

            const knownG = gScore.has(nk) ? gScore.get(nk) : Infinity;
            if (tentativeG >= knownG) continue;

            parents.set(nk, { x: current.x, y: current.y });
            gScore.set(nk, tentativeG);
            fScore.set(nk, tentativeG + heuristic(nx, ny));
            if (!openSet.has(nk)) {
                open.push({ x: nx, y: ny });
                openSet.add(nk);
            }
        }
    }

    return null;
}
