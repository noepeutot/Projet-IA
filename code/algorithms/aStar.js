export function aStar(maze) {
    // 1. Créer un ensemble ordonnées par f(n) qui contient les nœuds découverts, mais pas encore explorés
    const open = [];
    // 2. Créer un ensemble contenant les nœuds déjà explorés
    const closed = [];

    const startCell = maze.getStartCell(); // n0 (nœud de départ)
    const endCell = maze.getEndCell(); // nG (noeud de fin)

    // 3. Insérer n0 dans open
    startCell.cout = 0; // g(n0) = 0 car c'est le départ
    startCell.heuristique = maze.getDistanceBetweenCells(startCell, endCell); // h(n0) = distance entre n0 et nG
    startCell.value = startCell.cout + startCell.heuristique; // f(n0) = g(n0) + h(n0) = 0 + distance entre n0 et nG
    open.push(startCell);

    // 4 + 5. Boucle principale. Tant qu'open n'est pas vide et que nG n'est pas dans closed
    while (open.length > 0 && !closed.includes(endCell)) {

        // 6. n1 = nœud au début d'open avec le plus petit f(n)
        open.sort((a, b) => a.value - b.value);

        // 7. Enlever n1 de open et l'ajouter dans closed
        const current = open.shift();
        closed.push(current);

        // 8. Si n1 est le but, sortir de la boucle (n1 = nG)
        if (current === endCell) {
            break;
        }

        // Définir les directions possibles
        const directions = [
            {dx: -1, dy: 0, wall: 'left'},
            {dx: 0, dy: -1, wall: 'top'},
            {dx: 1, dy: 0, wall: 'right'},
            {dx: 0, dy: 1, wall: 'bottom'}
        ];

        // 9. Pour chaque noeud successeur n2 de n1
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

                // Vérifier si le successeur n'est pas dans closed
                if (!closed.includes(successor)) {
                    // 11. mettre parent(n2) = n1
                    successor.parent = current;

                    // 12 & 13. Vérification et mise à jour des valeurs
                    successor.cout = newCost; // g(n) = coût du parent + 1
                    successor.heuristique = maze.getDistanceBetweenCells(successor, endCell); // h(n)
                    successor.value = successor.cout + successor.heuristique; // f(n) = g(n) + h(n)

                    // 14. Insérer n2 dans open en triant par f(n)
                    if (!open.includes(successor)) {
                        open.push(successor);
                    }
                }
            }
        }
    }

    // Reconstruction du chemin si une solution est trouvée
    if (closed.includes(endCell)) {
        let current = endCell;
        while (current !== startCell) {
            if (current !== endCell) {
                current.setType("path");
            }
            current = current.parent;
        }
        maze.displayMaze();
        return true;
    }

    console.log("Aucune solution trouvée");
    return false;
}
