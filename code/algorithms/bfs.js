export function bfs(maze) {
  // File remplie des coordonnées des cellules à traiter
  const queue = [];

  // Sélection de coordonnées de la cellule de départ
  const startCell = maze.getStartCell();
  let row = startCell.y;
  let col = startCell.x;
  queue.push({row: row, col: col});

  // Tant que la file n'est pas vide
  while (queue.length > 0) {
    // Récupérer la cellule à traiter
    const current = queue.shift();
    row = current.row;
    col = current.col;
    maze.grid[row][col].setVisited(true);

    // Vérifier le mur du haut et ajouter la cellule voisine
    if (row > 0 && !maze.grid[row][col].walls.top && !maze.grid[row - 1][col].isVisited()) {
      queue.push({row: row - 1, col: col});
      maze.grid[row - 1][col].setVisited(true);
    }
    // Vérifier le mur de droite et ajouter la cellule voisine  
    if (col < maze.width - 1 && !maze.grid[row][col].walls.right && !maze.grid[row][col + 1].isVisited()) {
      queue.push({row: row, col: col + 1});
      maze.grid[row][col + 1].setVisited(true);
    }
    // Vérifier le mur du bas et ajouter la cellule voisine
    if (row < maze.height - 1 && !maze.grid[row][col].walls.bottom && !maze.grid[row + 1][col].isVisited()) {
      queue.push({row: row + 1, col: col});
      maze.grid[row + 1][col].setVisited(true);
    }
    // Vérifier le mur de gauche et ajouter la cellule voisine
    if (col > 0 && !maze.grid[row][col].walls.left && !maze.grid[row][col - 1].isVisited()) {
      queue.push({row: row, col: col - 1});
      maze.grid[row][col - 1].setVisited(true);
    }

    // Si la cellule de fin est atteinte, sortir de la boucle
    if (maze.grid[row][col] === maze.getEndCell()) {
      console.log("Sortie trouvée !");
      break;
    }

    // Affichage du labyrinthe à l'étape courante avec les cellules visitées
    maze.displayMaze();
    console.log(''); // Ligne vide pour séparer les étapes
  }
}
