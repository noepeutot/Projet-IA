class Cell {
  queued = false;
  value;

  constructor(value = 0) {
    this.value = value;
  }
}


const maze = [
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()]
];

bfs(maze);

function bfs(maze) {
    const queue = [];
    const randomRow = Math.floor(Math.random() * maze.length);
    const randomCol = Math.floor(Math.random() * maze[0].length);
    queue.push([randomRow, randomCol]);
    while (queue.length > 0) {
      let [x, y] = queue.shift();
      while (maze[x][y] == 1) {
        [x, y] = queue.shift();
      }
      
      maze[x][y] = 1;

      if (x > 0 && maze[x - 1][y] == 0){
          queue.push([x - 1, y]);
      }
      if (y < maze[0].length - 1 && maze[x][y + 1] == 0){
          queue.push([x, y + 1]);
      }
      if (x < maze.length - 1 && maze[x + 1][y] == 0){
          queue.push([x + 1, y]);
      }
      if (y > 0 && maze[x][y - 1] == 0){
          queue.push([x, y - 1]);
      }

      console.log("==============")
      for (const row of maze) {
        console.log(row);
      }
      console.log("==============")
    }
}

