export function aStar(maze) {
    // 1. Créer un ensemble ordonnées par f(n) qui contient les nœuds découverts, mais pas encore explorés
    let open = [];
    // 2. Créer un ensemble contenant les nœuds déjà explorés
    let closed = [];

    const startCell = maze.getStartCell(); // n0 (nœud de départ)
    const endCell = maze.getEndCell(); // nG (noeud de fin)

    // 3. Insérer n0 dans l'open
    startCell.cout = 0; // g(n0) = 0 car c'est le départ
    startCell.heuristique = maze.getDistanceBetweenCells(startCell, endCell); // h(n0) = distance entre n0 et nG
    startCell.value = startCell.cout + startCell.heuristique; // f(n0) = g(n0) + h(n0) = 0 + distance entre n0 et nG
    open.push(startCell);

    // 4 + 5. Boucle principale. Tant qu'open n'est pas vide et que nG n'est pas dans closed
    while (open.length > 0 && !closed.includes(endCell)) {

        // 6. Sélectionner n1 = nœud avec le plus petit f(n) dans open
        open.sort((a, b) => a.value - b.value);

        // 7. Enlever n1 de open et l'ajouter dans closed
        const current = open.shift();
        closed.push(current);

        // 8. Si n1 est le but, reconstruire le chemin et sortir de la boucle
        if (current === endCell) {
            let path = [];
            let pathCell = current;
            while (pathCell !== startCell) {
                if (pathCell !== endCell) {
                    pathCell.setType("path");
                    path.unshift(pathCell);
                }
                pathCell = pathCell.parent;
            }
            path.unshift(startCell);
            maze.displayMaze();
            return path;
        }

        // Définir les directions possibles
        const directions = [
            {dx: -1, dy: 0, wall: 'left'},
            {dx: 0, dy: -1, wall: 'top'},
            {dx: 1, dy: 0, wall: 'right'},
            {dx: 0, dy: 1, wall: 'bottom'}
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

                // 11. Définir le parent de n2
                if (successor !== current.parent) {
                    successor.parent = current;
                }

                // Calculer les valeurs pour n2
                successor.cout = newCost;
                successor.heuristique = maze.getDistanceBetweenCells(successor, endCell);
                successor.value = successor.cout + successor.heuristique;

                // 12. Vérifier si n2 existe dans l'open ou closed avec un f(n) plus grand
                // On cherche n2 dans l'open et dans closed
                const existingInOpen = open.find(n => n === successor);
                const existingInClosed = closed.find(n => n === successor);

                // 12.1. Si n2 existe dans l'open et que son f(n) est plus grand que le f(n) de n2
                if (existingInOpen && successor.value < existingInOpen.value) {
                    open = open.filter(n => n !== existingInOpen); // On enlève n2 de l'open
                    open.push(successor); // On ajoute n2 à l'open
                } 
                // 12.2. Si n2 existe dans closed et que son f(n) est plus grand que le f(n) de n2
                else if (existingInClosed && successor.value < existingInClosed.value) {
                    closed = closed.filter(n => n !== existingInClosed); // On enlève n2 de closed
                    open.push(successor); // On ajoute n2 à l'open
                } 
                // 13 & 14. Si n2 n'est ni dans l'open ni dans closed
                else if (!existingInOpen && !existingInClosed) {
                    open.push(successor); // On ajoute n2 à l'open
                }
            }
        }
    }
    return null;
}
