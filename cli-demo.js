/**
 * Démo CLI : génère un labyrinthe avec chaque algorithme de génération
 * et le résout avec chaque solveur. Lancer avec `node code/cli-demo.js`.
 */
import { bfs, dfs, aStar, dijkstra } from './algorithms/index.js';
import { Maze } from './classes/Maze.js';

const generators = ['recursive', 'random', 'prim', 'kruskal'];
const solvers = [
    { name: 'A*', fn: aStar },
    { name: 'BFS', fn: bfs },
    { name: 'DFS', fn: dfs },
    { name: 'Dijkstra', fn: dijkstra }
];

for (const gen of generators) {
    console.log(`\n-- Maze ${gen} --`);
    console.log('==============');
    const maze = new Maze(10, 10, gen);
    maze.displayMaze();

    for (const { name, fn } of solvers) {
        console.log(`\n-- ${name} --`);
        const path = fn(maze);
        if (path) {
            console.log('Chemin trouvé :');
            maze.displayMaze();
        } else {
            console.log(`${name} : Pas de chemin trouvé`);
        }
        maze.resetMaze();
    }

    console.log('==============\n');
}