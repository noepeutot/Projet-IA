import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { Maze } from './classes/Maze.js';
import { Player } from './classes/Player.js';

console.log("-- Maze --")
console.log("==============")
let maze = new Maze(10, 10);
maze.displayMaze();
console.log("==============")
console.log("")

// console.log("-- BFS --")
// console.log("==============")
// bfs(maze);
// console.log("")


console.log("-- DFS --")
console.log("==============")
let path = dfs(maze);
console.log(path);
console.log("")

console.log("-- Joueur --")
console.log("==============")
let player = new Player('Joueur 1');
maze.addPlayer(player, maze.getStartCell());

maze.movePlayer(player, "right");

maze.displayMaze();

console.log("Finished : " + maze.isFinished());

console.log("==============");
console.log("");

