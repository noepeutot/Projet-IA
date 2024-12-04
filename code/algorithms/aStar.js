export function aStar(maze) {
    // Sélection de coordonnées d'une cellule de départ et d'arrivée aléatoirement, située en bordure
    const yStart = Math.floor(Math.random() * maze.length);
    let xStart = Math.floor(Math.random() * maze[0].length);

    let yEnd, xEnd

    if (yStart > 0 || yStart < maze.length - 1) {
      xStart = xStart <= 0.5 ? 0 : maze[0].length - 1;
      xEnd = xStart == 0 ? maze[0].length - 1 : 0;
      yEnd = Math.floor(Math.random() * maze.length);
    } else {
      yEnd = yStart == 0 ? maze.length - 1 : 0;
      xEnd = Math.floor(Math.random() * maze[0].length);
    }

    maze[yStart][xStart].value = 'O';
    maze[yEnd][xEnd].value = 'X';

    // Calcul des scores de chaque cellule
    for (let x = 0 ; x < maze.length; x++) {
      for (let y = 0 ; y < maze[0].length; y++) {
        if ((y != yStart || x != xStart) && (y != yEnd || x != xEnd)) {
          const g = Math.abs(xStart - x) + Math.abs(yStart - y);
          const h = Math.abs(xEnd - x) + Math.abs(yEnd - y);
          maze[y][x].value = g + h;
        }
      }
    }

    // Algorithme
    const openList = [];
    const closedList = [];
    openList.push(maze[yStart][xStart]);
    while (openList.length > 0) {
      
    }

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