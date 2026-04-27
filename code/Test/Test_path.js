import { reconstructPath } from '../algorithms/path.js';

function testReconstructPath() {
    // Simuler une map des parents
    const parents = new Map();
    parents.set("1,0", { x: 0, y: 0 }); // (1,0) est enfant de (0,0)
    parents.set("2,0", { x: 1, y: 0 }); // Chemin continue vers le bas
    parents.set("2,1", { x: 2, y: 0 }); // Vers la droite
    parents.set("2,2", { x: 2, y: 1 }); // Enfin vers (2,2)

    // Simuler une cellule de départ
    const startCell = { x: 0, y: 0 };

    // Simuler une position de fin
    const endPos = { x: 2, y: 2 };

    // Appeler reconstructPath
    const path = reconstructPath(parents, startCell, endPos);

    // Vérifier le chemin attendu
    const expectedPath = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 }
    ];

    console.assert(
        JSON.stringify(path) === JSON.stringify(expectedPath),
        `Chemin incorrect. Attendu: ${JSON.stringify(expectedPath)}, Reçu: ${JSON.stringify(path)}`
    );

    console.log('Test reconstructPath terminé avec succès.');
}

testReconstructPath();
