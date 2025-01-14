import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { Maze } from './classes/Maze.js';
import { Player } from './classes/Player.js';
import {Cell} from './classes/Cell.js';
import { aStar } from './algorithms/aStar.js';

console.log("-- Maze recursive backtracking --")
console.log("==============")
let maze_recursive = new Maze(10, 10, "recursive");
maze_recursive.displayMaze();
console.log("");

console.log("-- A* --")
aStar(maze_recursive);
maze_recursive.displayMaze();
maze_recursive.resetMaze();
console.log("")

console.log("-- BFS --")
bfs(maze_recursive);
maze_recursive.displayMaze();
maze_recursive.resetMaze();
console.log("")

console.log("-- DFS --")
dfs(maze_recursive);
maze_recursive.displayMaze();
maze_recursive.resetMaze();
console.log("")


console.log("==============")
console.log("")


console.log("-- Maze random --")
console.log("==============")
let maze_random = new Maze(10, 10, "random");
maze_random.displayMaze();
console.log("");

console.log("-- A* --")
let path_aStar = aStar(maze_random);
if(path_aStar) {
    console.log("Chemin trouvé : ");
    maze_random.displayMaze();
    maze_random.resetMaze();
} else {
    console.log("A* : Pas de chemin trouvé");
}
console.log("")

console.log("-- BFS --")
let path_bfs = bfs(maze_random);
if(path_bfs) {
    console.log("Chemin trouvé : ");
    maze_random.displayMaze();
    maze_random.resetMaze();
} else {
    console.log("BFS : Pas de chemin trouvé");
}
console.log("")

console.log("-- DFS --")
let path_dfs = dfs(maze_random);
if(path_dfs) {
    console.log("Chemin trouvé : ");
    maze_random.displayMaze();
    maze_random.resetMaze();
} else {
    console.log("DFS : Pas de chemin trouvé");
}
console.log("")

console.log("==============")
console.log("")


// console.log("-- Joueur --")
// console.log("==============")
// let player = new Player('Joueur 1');
// maze.addPlayer(player, maze.getStartCell());
//
// maze.movePlayer(player, "right");
//
// maze.displayMaze();
//
// console.log("Finished : " + maze.isFinished());
//
// console.log("==============");
// console.log("");