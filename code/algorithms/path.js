/**
 * Reconstruit le chemin à partir des parents
 * @param {Map} parents - Map des parents
 * @param {Cell} startCell - Cellule de départ
 * @param {Object} endPos - Coordonnées de la cellule de fin
 * @returns {Array} Tableau contenant les coordonnées des cellules du chemin
 */
export function reconstructPath(parents, startCell, endPos) {
    // Tableau contenant les coordonnées des cellules du chemin
    const path = [];

    // Cellule courante
    let current = endPos;

    // Tant que la cellule courante n'est pas la cellule de départ
    while (current.x !== startCell.x || current.y !== startCell.y) {
        path.unshift(current);
        current = parents.get(`${current.x},${current.y}`);
    }

    // Ajouter la cellule de départ au début du chemin
    path.unshift({x: startCell.x, y: startCell.y});

    return path;
}
