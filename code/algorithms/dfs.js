export function dfs(maze) {
  const stack = []; // Pile remplie des coordonnées des cellules à traiter
  // Sélection de coordonnées d'une cellule aléatoirement
  const randomRow = Math.floor(Math.random() * maze.length);
  const randomCol = Math.floor(Math.random() * maze[0].length);
  stack.push([randomRow, randomCol]);
  while (stack.length > 0) {
    const [x, y] = stack.pop();      
    maze[x][y].value = 1;

    if (x > 0 && maze[x - 1][y].value == 0 && !maze[x - 1][y].isQueued()){
        stack.push([x - 1, y]);
        maze[x - 1][y].queued = true;
    }
    if (y < maze[0].length - 1 && maze[x][y + 1].value == 0 && !maze[x][y + 1].isQueued()){
        stack.push([x, y + 1]);
        maze[x][y + 1].queued = true;
    }
    if (x < maze.length - 1 && maze[x + 1][y].value == 0 && !maze[x + 1][y].isQueued()){
        stack.push([x + 1, y]);
        maze[x + 1][y].queued = true;
    }
    if (y > 0 && maze[x][y - 1].value == 0 && !maze[x][y - 1].isQueued()){
        stack.push([x, y - 1]);
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