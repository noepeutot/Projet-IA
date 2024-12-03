export function dfs(maze) {
  // Pile remplie des coordonnées des cellules à traiter
  const stack = [];
  // Sélection de coordonnées de la cellule de départ
  const startCell = maze.getStartCell();
  let x = startCell.x;
  let y = startCell.y;
  stack.push([x, y]);

  // Tant que la pile n'est pas vide et que la cellule de fin n'est pas atteinte
  while (stack.length > 0 && maze.grid[y][x] !== maze.getEndCell()) {
    // Récupérer la cellule à traiter
    [x, y] = stack.pop();
    maze.grid[y][x].value = 1;

    // Vérifier le mur du haut et ajouter la cellule voisine
    if (y > 0 && !maze.grid[y][x].walls.top && maze.grid[y-1][x].value === 0 && !maze.grid[y-1][x].isQueued()){
        stack.push([x, y-1]);
        maze.grid[y-1][x].queued = true;
    }
    // Vérifier le mur de droite et ajouter la cellule voisine
    if (x < maze.width - 1 && !maze.grid[y][x].walls.right && maze.grid[y][x+1].value === 0 && !maze.grid[y][x+1].isQueued()){
        stack.push([x+1, y]);
        maze.grid[y][x+1].queued = true;
    }
    // Vérifier le mur du bas et ajouter la cellule voisine
    if (y < maze.height - 1 && !maze.grid[y][x].walls.bottom && maze.grid[y+1][x].value === 0 && !maze.grid[y+1][x].isQueued()){
        stack.push([x, y+1]);
        maze.grid[y+1][x].queued = true;
    }
    // Vérifier le mur de gauche et ajouter la cellule voisine
    if (x > 0 && !maze.grid[y][x].walls.left && maze.grid[y][x-1].value === 0 && !maze.grid[y][x-1].isQueued()){
        stack.push([x-1, y]);
        maze.grid[y][x-1].queued = true;
    }

    // Affichage du labyrinthe à l'étape courante avec les cellules visitées
    for (let i = 0; i < maze.height; i++) {
        let topLine = '';
        let middleLine = '';
        for (let j = 0; j < maze.width; j++) {
            const cell = maze.grid[i][j];
            topLine += cell.walls.top ? '+---' : '+   ';
            if (cell === maze.getStartCell()) {
                middleLine += cell.walls.left ? '| E ' : '  E ';
            } else if (cell === maze.getEndCell()) {
                middleLine += cell.walls.left ? '| S ' : '  S ';
            } else {
                middleLine += cell.walls.left ? `| ${cell.value ? 'x' : ' '} ` : `  ${cell.value ? 'x' : ' '} `;
            }
        }
        console.log(topLine + '+');
        console.log(middleLine + '|');
    }
    console.log('+---'.repeat(maze.width) + '+');
    console.log(''); // Ligne vide pour séparer les étapes
  }

  if (maze.grid[y][x] === maze.getEndCell()) {
    console.log("Sortie trouvée !");
  }
}
