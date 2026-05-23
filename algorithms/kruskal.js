/**
 * Génération d'un labyrinthe avec l'algorithme de Kruskal (union-find).
 * @param {Maze} maze
 */
export function generateKruskal(maze) {
    const width = maze.width;
    const height = maze.height;

    const parent = new Array(width * height);
    const rank = new Array(width * height).fill(0);
    for (let i = 0; i < parent.length; i++) parent[i] = i;

    const idx = (x, y) => y * width + x;

    function find(a) {
        while (parent[a] !== a) {
            parent[a] = parent[parent[a]];
            a = parent[a];
        }
        return a;
    }

    function union(a, b) {
        const ra = find(a);
        const rb = find(b);
        if (ra === rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
        return true;
    }

    const walls = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x + 1 < width)  walls.push({ a: maze.grid[y][x], b: maze.grid[y][x + 1] });
            if (y + 1 < height) walls.push({ a: maze.grid[y][x], b: maze.grid[y + 1][x] });
        }
    }

    for (let i = walls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [walls[i], walls[j]] = [walls[j], walls[i]];
    }

    for (const { a, b } of walls) {
        if (union(idx(a.x, a.y), idx(b.x, b.y))) {
            maze.removeWall(a, b);
        }
    }

    maze.resetVisitedCells();
}
