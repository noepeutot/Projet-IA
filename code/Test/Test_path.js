import { reconstructPath } from '../algorithms/path.js';

function testReconstructPath() {
    // Simuler une map des parents
    const parents = new Map();
    parents.set("1,0", { row: 0, col: 0 }); // Correction : (1,0) est enfant de (0,0)
    parents.set("2,0", { row: 1, col: 0 }); // Chemin continue vers le bas
    parents.set("2,1", { row: 2, col: 0 }); // Vers la droite
    parents.set("2,2", { row: 2, col: 1 }); // Enfin vers (2,2)

    // Simuler une cellule de départ
    const startCell = { x: 0, y: 0 };

    // Simuler une position de fin
    const endPos = { row: 2, col: 2 };

    // Appeler reconstructPath
    const path = reconstructPath(parents, startCell, endPos);

    // Vérifier le chemin attendu
    const expectedPath = [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 }
    ];

    console.assert(
        JSON.stringify(path) === JSON.stringify(expectedPath),
        `Chemin incorrect. Attendu: ${JSON.stringify(expectedPath)}, Reçu: ${JSON.stringify(path)}`
    );

    console.log('Test reconstructPath terminé avec succès.');
}

testReconstructPath();
