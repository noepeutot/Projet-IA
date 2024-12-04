export function aStar(maze) {
    const startCell = maze.getStartCell();
    const endCell = maze.getEndCell();

    // Calcul des scores de chaque cellule
    for (let row of maze.grid) {
      for (let cell of row) {
        if ((cell.y != startCell.y || cell.x != startCell.x) && (cell.y != endCell.y || cell.x != endCell.x)) {
          const g = Math.abs(startCell.x - cell.x) + Math.abs(startCell.y - cell.y);
          const h = Math.abs(endCell.x - cell.x) + Math.abs(endCell.y - cell.y);
          cell.value = g + h;
        }
      }
    }

    // Algorithme
    // const openList = [];
    // const closedList = [];
    // openList.push(maze[yStart][xStart]);
    // while (openList.length > 0) {
    //   openList.sort((a, b) => a.value - b.value);
    //   const current = openList.shift();
    //   closedList.push(current);
    //   if (current.x == xEnd && current.y == yEnd) {
    //     openList.clear();
    //   } else {
    //     if (current.x > 0 && !closedList.includes(maze[current.y][current.x - 1])) {
    //       openList.push(maze[current.y][current.x - 1]);
    //       maze[current.y][current.x - 1].parent = current;
    //     }
    //     if (current.y > 0 && !closedList.includes(maze[current.y - 1][current.x])) {
    //       openList.push(maze[current.y - 1][current.x]);
    //       maze[current.y - 1][current.x].parent = current;
    //     }
    //     if (current.x < maze[0].length - 1 && !closedList.includes(maze[current.y][current.x + 1])) {
    //       openList.push(maze[current.y][current.x + 1]);
    //       maze[current.y][current.x + 1].parent = current;
    //     }
    //     if (current.y < maze.length - 1 && !closedList.includes(maze[current.y + 1][current.x])) {
    //       openList.push(maze[current.y + 1][current.x]);
    //       maze[current.y + 1][current.x].parent = current;
    //     }
    //   }
    // }

    // console.log(openList)
    // console.log(closeList)

    maze.displayMaze();
}