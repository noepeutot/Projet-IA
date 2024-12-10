export function aStar(maze) {
    const startCell = maze.getStartCell();
    startCell.cout = 0;
    const endCell = maze.getEndCell();

    // // Calcul des scores de chaque cellule
    // for (let row of maze.grid) {
    //   for (let cell of row) {
    //     if ((cell.y != startCell.y || cell.x != startCell.x) && (cell.y != endCell.y || cell.x != endCell.x)) {
    //       const g = Math.abs(startCell.x - cell.x) + Math.abs(startCell.y - cell.y);
    //       const h = Math.abs(endCell.x - cell.x) + Math.abs(endCell.y - cell.y);
    //       cell.value = g + h;
    //     }
    //   } // ajouter nb de cellule parcourus
    // }

    // Algorithme
    const openList = [];
    const closedList = [];
    openList.push(startCell);

    while (openList.length > 0 && !closedList.includes(endCell)) {
      openList.sort((a, b) => a.value - b.value);
      const current = openList.shift();
      closedList.push(current);

      if (current != endCell) {
        if (current.x > 0 && !current.walls.left && !closedList.includes(maze[current.y][current.x - 1])) {
          cellGauche = maze[current.y][current.x - 1];

          const coutTransition = current.cout + 1;
          const heuristiqueTransition = maze.getDistanceBetweenCells(cellGauche, endCell);

          if (openList.includes(cellGauche) || closedList.includes(cellGauche) &&
              coutTransition + heuristiqueTransition < cellGauche.cout + cellGauche.heuristique) {
                cellGauche.cout = coutTransition;
                cellGauche.heuristique = heuristiqueTransition;
                cellGauche.value = cellGauche.cout + cellGauche.heuristique;
      
                openList.push(cellGauche);
                cellGauche.parent = current;
              }
        } 
        if (current.y > 0 && !current.walls.top && !closedList.includes(maze[current.y - 1][current.x])) {
          cellTop = maze[current.y - 1][current.x];

          const coutTransition = current.cout + 1;
          const heuristiqueTransition = maze.getDistanceBetweenCells(cellTop, endCell);

          if (openList.includes(cellTop) || closedList.includes(cellTop) &&
              coutTransition + heuristiqueTransition < cellTop.cout + cellTop.heuristique) {
                cellTop.cout = coutTransition;
                cellTop.heuristique = heuristiqueTransition;
                cellTop.value = cellTop.cout + cellTop.heuristique;
      
                openList.push(cellTop);
                cellTop.parent = current;
              }
        }
        if (current.x < maze[0].length - 1 && !closedList.includes(maze[current.y][current.x + 1])) {
          openList.push(maze[current.y][current.x + 1]);
          maze[current.y][current.x + 1].parent = current;
        }
        if (current.y < maze.length - 1 && !closedList.includes(maze[current.y + 1][current.x])) {
          openList.push(maze[current.y + 1][current.x]);
          maze[current.y + 1][current.x].parent = current;
        }
      }
    }



    // console.log(openList)
    // console.log(closeList)

    maze.displayMaze();
}