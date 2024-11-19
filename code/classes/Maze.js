export default

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
        this.stack = [];
        this.currentCell = this.grid[0][0];
        this.currentCell.x = 0;
        this.currentCell.y = 0;
        this.visitedCells = 0;
        this.totalCells = width * height;
    }

    createGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push({
                    visited: false,
                    walls: { top: true, right: true, bottom: true, left: true }
                });
            }
            grid.push(row);
        }
        return grid;
    }

    generateMaze() {
        this.currentCell.visited = true;
        this.visitedCells++;
        this.stack.push(this.currentCell);

        while (this.visitedCells < this.totalCells) {
            const nextCell = this.getRandomAdjacentCell(this.currentCell);

            if (nextCell) {
                this.removeWall(this.currentCell, nextCell);
                this.stack.push(nextCell);
                this.currentCell = nextCell;
                this.currentCell.visited = true;
                this.visitedCells++;
            } else {
                this.currentCell = this.stack.pop();
            }
        }
    }

    getRandomAdjacentCell(cell) {
        const directions = [
            { dx: 0, dy: -1 }, // top
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // bottom
            { dx: -1, dy: 0 }  // left
        ];

        const unvisitedNeighbors = directions.map(dir => {
            const newX = cell.x + dir.dx;
            const newY = cell.y + dir.dy;

            if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                const neighbor = this.grid[newY][newX];
                neighbor.x = newX;
                neighbor.y = newY;
                return neighbor.visited ? null : neighbor;
            }
            return null;
        }).filter(Boolean);

        if (unvisitedNeighbors.length > 0) {
            return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
        }
        return null;
    }

    removeWall(current, next) {
        const dx = next.x - current.x;
        const dy = next.y - current.y;

        if (dx === 1) {
            current.walls.right = false;
            next.walls.left = false;
        } else if (dx === -1) {
            current.walls.left = false;
            next.walls.right = false;
        } else if (dy === 1) {
            current.walls.bottom = false;
            next.walls.top = false;
        } else if (dy === -1) {
            current.walls.top = false;
            next.walls.bottom = false;
        }
    }

    displayMaze() {
        for (let y = 0; y < this.height; y++) {
            let topLine = '';
            let middleLine = '';
            for (let x = 0; x < this.width; x++) {
                topLine += this.grid[y][x].walls.top ? '+---' : '+   ';
                middleLine += this.grid[y][x].walls.left ? '|   ' : '    ';
            }
            console.log(topLine + '+');
            console.log(middleLine + '|');
        }
        console.log('+---'.repeat(this.width) + '+');
    }
}

//TODO : Tests à supprimer
const maze = new Maze(10, 10);
console.log('Defaut maze');
console.log(maze.grid);

maze.generateMaze();
console.log('Generated maze');
maze.displayMaze();
