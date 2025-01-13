import { aStar } from '../algorithms/aStar.js';
import { dfs } from '../algorithms/dfs.js';
import { bfs } from '../algorithms/bfs.js';

import { Maze } from '../classes/Maze.js';

function testPerformance(algorithm, size) {
    const nbIterations = 100;
    let totalTime = 0;
    let totalMemoryUsed = 0;

    for (let i = 0; i < nbIterations; i++) {
        const maze = new Maze(size, size);

        if (global.gc()) {
            global.gc();
        }
        const memoryStart = process.memoryUsage().heapUsed;
        const start = performance.now();

        algorithm(maze); // Exécuter l'algorithme

        const end = performance.now();
        if (global.gc()) {
            global.gc();
        }
        const memoryEnd = process.memoryUsage().heapUsed;

        totalTime += end - start;
        totalMemoryUsed += memoryEnd - memoryStart;
    }

    return {
        meanTime: totalTime / nbIterations, // Temps moyen en ms
        meanMemoryUsed: (totalMemoryUsed / nbIterations) / 1024 // Mémoire utilisée en o
    };
}

const mazeSizes = [10, 50, 100];
mazeSizes.forEach(size => {
    console.log(`Testing on maze size ${size}x${size}:`);
    console.log('aStar algorithm', testPerformance(aStar, size));
    console.log('dfs algorithm', testPerformance(dfs, size));
    console.log('bfs algorithm', testPerformance(bfs, size));
});