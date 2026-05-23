/**
 * Reconstruit le chemin à partir des parents
 * @param {Map} parents - Map des parents
 * @param {Cell} startCell - Cellule de départ
 * @param {Object} endPos - Coordonnées de la cellule de fin
 * @returns {Array} Tableau contenant les coordonnées des cellules du chemin
 */
export function reconstructPath(parents, startCell, endPos) {
    const path = [];
    let current = endPos;

    while (current.x !== startCell.x || current.y !== startCell.y) {
        path.push(current);
        current = parents.get(`${current.x},${current.y}`);
        if (!current) return [];
    }
    path.push({ x: startCell.x, y: startCell.y });
    path.reverse();

    return path;
}
