import { Cell } from '../classes/Cell.js';

function testCell() {
    // Créer une cellule de test
    const x = 1;
    const y = 2;
    const cell = new Cell(x, y);

    // Vérifier les coordonnées de la cellule
    console.assert(
        cell.x === x && cell.y === y,
        `Erreur : Les coordonnées de la cellule devraient être (${x}, ${y}), mais sont (${cell.x}, ${cell.y})`
    );

    // Vérifier les murs initiaux
    console.assert(
        cell.walls.top === true &&
        cell.walls.right === true &&
        cell.walls.bottom === true &&
        cell.walls.left === true,
        'Erreur : Les murs de la cellule devraient être initialisés à true.'
    );

    // Vérifier l'état visité initial
    console.assert(
        cell.isVisited() === false,
        'Erreur : La cellule ne devrait pas être marquée comme visitée au départ.'
    );

    // Tester setVisited et isVisited
    cell.setVisited(true);
    console.assert(
        cell.isVisited() === true,
        'Erreur : La cellule devrait être marquée comme visitée.'
    );

    cell.setVisited(false);
    console.assert(
        cell.isVisited() === false,
        'Erreur : La cellule ne devrait plus être marquée comme visitée.'
    );

    // Vérifier le type initial
    console.assert(
        cell.getType() === 'normal',
        'Erreur : Le type initial de la cellule devrait être normal.'
    );

    // Tester setType et getType
    cell.setType('start');
    console.assert(
        cell.getType() === 'start',
        'Erreur : Le type de la cellule devrait être start.'
    );

    cell.setType('end');
    console.assert(
        cell.getType() === 'end',
        'Erreur : Le type de la cellule devrait être end.'
    );

    cell.setType('path');
    console.assert(
        cell.getType() === 'path',
        'Erreur : Le type de la cellule devrait être path.'
    );

    cell.setType('normal');
    console.assert(
        cell.getType() === 'normal',
        'Erreur : Le type de la cellule devrait être normal.'
    );

    console.log('Test de Cell terminé avec succès.');
}

testCell();
