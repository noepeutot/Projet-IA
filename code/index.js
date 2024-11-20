import {Cell} from './classes/Cell.js';
import {bfs} from './algorithms/bfs.js';
import {Maze} from './classes/Maze.js';

const maze = [
    [new Cell(0,0), new Cell(0,1), new Cell(0,2), new Cell(0,3), new Cell(0,4), new Cell(0,5)],
    [new Cell(1,0), new Cell(1,1), new Cell(1,2), new Cell(1,3), new Cell(1,4), new Cell(1,5)],
    [new Cell(2,0), new Cell(2,1), new Cell(2,2), new Cell(2,3), new Cell(2,4), new Cell(2,5)],
    [new Cell(3,0), new Cell(3,1), new Cell(3,2), new Cell(3,3), new Cell(3,4), new Cell(3,5)],
    [new Cell(4,0), new Cell(4,1), new Cell(4,2), new Cell(4,3), new Cell(4,4), new Cell(4,5)],
    [new Cell(5,0), new Cell(5,1), new Cell(5,2), new Cell(5,3), new Cell(5,4), new Cell(5,5)]
];

const mazeGenerated = new Maze(10, 10);
mazeGenerated.generateMaze();
mazeGenerated.displayMaze();

bfs(maze);