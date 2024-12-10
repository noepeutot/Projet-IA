import {Cell} from './classes/Cell.js';
import {bfs} from './algorithms/bfs.js';
import {dfs} from './algorithms/dfs.js';
import {Maze} from './classes/Maze.js';
import { aStar } from './algorithms/aStar.js';

console.log("-- Maze --")
console.log("==============")
let maze = new Maze(5, 5);
maze.displayMaze();
console.log("==============")
console.log("")

/* console.log("-- BFS --")
console.log("==============")
bfs(maze);
console.log("") */

// console.log("-- DFS --")
// console.log("==============")
// dfs(maze)
// console.log("")

// aStar(maze)