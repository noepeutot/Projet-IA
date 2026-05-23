/**
 * Rend un labyrinthe en HTML dans un conteneur DOM.
 * Cette fonction vit côté UI pour garder classes/Maze.js pur (sans dépendance navigateur).
 *
 * @param {Maze} maze - Instance de Maze
 * @param {HTMLElement} container - Élément où afficher le labyrinthe
 */
export function renderMaze(maze, container) {
    container.innerHTML = '';
    const mazeElement = document.createElement('div');
    mazeElement.className = 'maze';

    const visWidth = maze.width * 2 + 1;
    const visHeight = maze.height * 2 + 1;

    mazeElement.style.display = 'grid';
    mazeElement.style.gridTemplateColumns = `repeat(${visWidth}, 1fr)`;
    mazeElement.style.gap = '0';

    for (let vy = 0; vy < visHeight; vy++) {
        for (let vx = 0; vx < visWidth; vx++) {
            const type = maze.visGrid[vy][vx];
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.dataset.vx = vx;
            cellElement.dataset.vy = vy;

            if (type === 'wall') {
                cellElement.classList.add('wall-block');
                mazeElement.appendChild(cellElement);
                continue;
            }

            cellElement.classList.add('path-block');

            if (type === 'room') {
                const cell = maze.grid[(vy - 1) / 2][(vx - 1) / 2];
                if (cell === maze.start) cellElement.classList.add('start');
                if (cell === maze.end) cellElement.classList.add('end');
                if (cell.getType() === 'path') cellElement.classList.add('path');
                if (cell.isVisited()) cellElement.classList.add('path--visited');
            } else {
                let cellA = null;
                let cellB = null;
                if (vx % 2 === 0) {
                    cellA = maze.grid[(vy - 1) / 2][vx / 2 - 1];
                    cellB = maze.grid[(vy - 1) / 2][vx / 2];
                } else {
                    cellA = maze.grid[vy / 2 - 1][(vx - 1) / 2];
                    cellB = maze.grid[vy / 2][(vx - 1) / 2];
                }
                if (cellA && cellB) {
                    if (cellA.getType() === 'path' && cellB.getType() === 'path') {
                        cellElement.classList.add('path');
                    }
                    if (cellA.isVisited() && cellB.isVisited()) {
                        cellElement.classList.add('path--visited');
                    }
                }
            }

            if (maze.player && maze.player.x === vx && maze.player.y === vy) {
                cellElement.classList.add('player');
            }
            if (maze.aiPlayer && maze.aiPlayer.x === vx && maze.aiPlayer.y === vy) {
                cellElement.classList.add('ai-player');
            }

            mazeElement.appendChild(cellElement);
        }
    }

    container.appendChild(mazeElement);
}
