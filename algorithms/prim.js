/**
 * Génération d'un labyrinthe avec l'algorithme de Prim aléatoire.
 * @param {Maze} maze
 */
export function generatePrim(maze) {
    const width = maze.width;
    const height = maze.height;

    maze.grid.forEach(row => row.forEach(c => c.setVisited(false)));

    const startCell = maze.grid[0][0];
    startCell.setVisited(true);

    const directions = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
    ];

    const frontier = [];
    const pushNeighbors = (cell) => {
        for (const dir of directions) {
            const nx = cell.x + dir.dx;
            const ny = cell.y + dir.dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                const neighbor = maze.grid[ny][nx];
                if (!neighbor.isVisited()) {
                    frontier.push({ from: cell, to: neighbor });
                }
            }
        }
    };

    pushNeighbors(startCell);

    while (frontier.length > 0) {
        const idx = Math.floor(Math.random() * frontier.length);
        const wall = frontier.splice(idx, 1)[0];

        if (wall.to.isVisited()) continue;

        maze.removeWall(wall.from, wall.to);
        wall.to.setVisited(true);
        pushNeighbors(wall.to);
    }

    maze.resetVisitedCells();
}
