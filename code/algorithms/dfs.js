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
        maze.grid[y][x].setVisited(true);

        // Vérifier le mur du haut et ajouter la cellule voisine
        if (y > 0 && !maze.grid[y][x].walls.top && !maze.grid[y - 1][x].isVisited()) {
            stack.push([x, y - 1]);
            maze.grid[y - 1][x].setVisited(true);
        }
        // Vérifier le mur de droite et ajouter la cellule voisine
        if (x < maze.width - 1 && !maze.grid[y][x].walls.right && !maze.grid[y][x + 1].isVisited()) {
            stack.push([x + 1, y]);
            maze.grid[y][x + 1].setVisited(true);
        }
        // Vérifier le mur du bas et ajouter la cellule voisine
        if (y < maze.height - 1 && !maze.grid[y][x].walls.bottom && !maze.grid[y + 1][x].isVisited()) {
            stack.push([x, y + 1]);
            maze.grid[y + 1][x].setVisited(true);
        }
        // Vérifier le mur de gauche et ajouter la cellule voisine
        if (x > 0 && !maze.grid[y][x].walls.left && !maze.grid[y][x - 1].isVisited()) {
            stack.push([x - 1, y]);
            maze.grid[y][x - 1].setVisited(true);
        }

        // Affichage du labyrinthe à l'étape courante avec les cellules visitées
        maze.displayMaze();
        console.log(''); // Ligne vide pour séparer les étapes
    }

    if (maze.grid[y][x] === maze.getEndCell()) {
        console.log("Sortie trouvée !");
    }
}
