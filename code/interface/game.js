import { dfs } from '../algorithms/dfs.js';
import { Maze } from '../classes/Maze.js';

const container = document.getElementById('maze-container');

const maze = new Maze(15, 15);

dfs(maze);

maze.renderMaze(container);