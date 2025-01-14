export function aStarPerf(maze) {
    let nbNodesExplored = 0;

    // 1. Créer un ensemble ordonné par f(n) qui contient les nœuds découverts, mais pas encore explorés
    let open = [];
    // 2. Créer un ensemble contenant les nœuds déjà explorés
    let closed = new Set();  // Utilisation d'un Set pour une recherche plus efficace

    const startCell = maze.getStartCell(); // n0 (nœud de départ)
    const endCell = maze.getEndCell(); // nG (noeud de fin)

    // Initialiser toutes les cellules
    maze.grid.forEach(row => {
        row.forEach(cell => {
            cell.cout = Infinity;      // g(n)
            cell.heuristique = Infinity; // h(n)
            cell.value = Infinity;     // f(n)
            cell.parent = null;
        });
    });

    // 3. Insérer n0 dans l'open avec les valeurs initiales
    startCell.cout = 0; // g(n0) = 0 car c'est le départ
    startCell.heuristique = maze.getDistanceBetweenCells(startCell, endCell); // h(n0) = distance entre n0 et nG
    startCell.value = startCell.cout + startCell.heuristique; // f(n0) = g(n0) + h(n0) = 0 + distance entre n0 et nG
    open.push(startCell);

    // 4 + 5. Boucle principale. Tant qu'open n'est pas vide et que nG n'est pas dans closed
    while (open.length > 0 && !closed.has(endCell)) {
        // 6. Sélectionner n1 = nœud avec le plus petit f(n) dans open
        open.sort((a, b) => a.value - b.value);

        // 7. Enlever n1 de open et l'ajouter dans closed
        const current = open.shift();
        nbNodesExplored++;
        closed.add(current);

        // 8. Si n1 est le but, reconstruire le chemin et sortir de la boucle
        if (current === endCell) {
            // Tableau qui contiendra le chemin
            let path = [];
            // Cellule courante pour reconstruire le chemin
            let pathCell = current;
            // Tant qu'on n'est pas arrivé à la cellule de départ
            while (pathCell !== startCell) {
                path.unshift({x: pathCell.x, y: pathCell.y});
                pathCell = pathCell.parent;
            }

            // Ajouter la cellule de départ
            path.unshift({x: startCell.x, y: startCell.y});

            // Marquer le chemin
            path.forEach(pos => {
                maze.grid[pos.y][pos.x].setType("path");
            });

            return nbNodesExplored;
        }

        // Définir les directions possibles
        const directions = [
            { dx: -1, dy: 0, wall: 'left' },
            { dx: 0, dy: -1, wall: 'top' },
            { dx: 1, dy: 0, wall: 'right' },
            { dx: 0, dy: 1, wall: 'bottom' }
        ];

        // 9. Pour chaque nœud successeur n2 de n1
        for (const dir of directions) {
            // Définir les coordonnées du successeur
            const newX = current.x + dir.dx;
            const newY = current.y + dir.dy;

            // Vérifier si le successeur est dans la grille et si la direction n'est pas bloquée
            if (newX >= 0 && newX < maze.width &&
                newY >= 0 && newY < maze.height &&
                !current.walls[dir.wall]) {

                // Définir le successeur
                const successor = maze.grid[newY][newX];

                // 10. Initialiser g(n2) = g(n1) + coût de la transition
                const newCost = current.cout + 1;

                // Si le successeur n'est pas dans closed OU si on trouve un meilleur chemin
                if (!closed.has(successor) || newCost < successor.cout) {
                    // 11. Mettre à jour les valeurs du successeur
                    successor.cout = newCost;
                    successor.heuristique = maze.getDistanceBetweenCells(successor, endCell);
                    successor.value = successor.cout + successor.heuristique;
                    successor.parent = current;

                    // 12. Si le successeur était dans closed, le retirer
                    if (closed.has(successor)) {
                        closed.delete(successor);
                    }

                    // 13. Si le successeur n'est pas dans open, l'ajouter
                    if (!open.includes(successor)) {
                        open.push(successor);
                    }
                }
            }
        }
    }

    // Si aucun chemin n'est trouvé
    return nbNodesExplored;
}
