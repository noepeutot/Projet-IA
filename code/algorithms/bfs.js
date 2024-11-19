export function bfs(maze) {
  const queue = []; // File remplie des coordonnées des cellules à traiter
  // Sélection de coordonnées d'une cellule aléatoirement
  const randomRow = Math.floor(Math.random() * maze.length);
  const randomCol = Math.floor(Math.random() * maze[0].length);
  queue.push([randomRow, randomCol]);
  while (queue.length > 0) {
    const [x, y] = queue.shift();      
    maze[x][y].value = 1;

    if (x > 0 && maze[x - 1][y].value == 0 && !maze[x - 1][y].isQueued()){
        queue.push([x - 1, y]);
        maze[x - 1][y].queued = true;
    }
    if (y < maze[0].length - 1 && maze[x][y + 1].value == 0 && !maze[x][y + 1].isQueued()){
        queue.push([x, y + 1]);
        maze[x][y + 1].queued = true;
    }
    if (x < maze.length - 1 && maze[x + 1][y].value == 0 && !maze[x + 1][y].isQueued()){
        queue.push([x + 1, y]);
        maze[x + 1][y].queued = true;
    }
    if (y > 0 && maze[x][y - 1].value == 0 && !maze[x][y - 1].isQueued()){
        queue.push([x, y - 1]);
        maze[x][y - 1].queued = true;
    }

    // Affichage du labyrinthe à l'étape courante
    console.log("==============")
    for (const row of maze) {
      let rowStr = "[";
      for (const cell of row) {
        rowStr += cell.value + ", ";
      }
      rowStr += "]";
      console.log(rowStr);
    }
    console.log("==============")
  }
}
