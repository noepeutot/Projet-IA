import { aStarPerf } from './aStarPerf.js';
import { dfsPerf } from './dfsPerf.js';
import { bfsPerf } from './bfsPerf.js';

import { Maze } from '../classes/Maze.js';

function testPerformanceRecursive(size) {
    const nbIterations = 1000;
    const algo = ["AStar", "DFS", "BFS"];

    let aStarTotalTime = 0;
    let aStarTotalMemoryUsed = 0;
    let aStarNodeExplored = 0;

    let dfsTotalTime = 0;
    let dfsTotalMemoryUsed = 0;
    let dfsNodeExplored = 0;

    let bfsTotalTime = 0;
    let bfsTotalMemoryUsed = 0;
    let bfsNodeExplored = 0;

    for (let i = 0; i < nbIterations; i++) {
        const maze = new Maze(size, size, "recursive");

        for (const nameAlgo of algo) {
            if (global.gc()) {
                global.gc();
            }
            const memoryStart = process.memoryUsage().heapUsed;
            const start = performance.now();
    
            let nbNodesExplored;
            let end;
            let memoryEnd;
            switch (nameAlgo) {
                case "AStar" :
                    nbNodesExplored = aStarPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    aStarTotalTime += end - start;
                    aStarTotalMemoryUsed += memoryEnd - memoryStart;
                    aStarNodeExplored += nbNodesExplored;           

                    break;
                case "DFS" :
                    nbNodesExplored = dfsPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    dfsTotalTime += end - start;
                    dfsTotalMemoryUsed += memoryEnd - memoryStart;
                    dfsNodeExplored += nbNodesExplored;            
                    
                    break;
                case "BFS" :
                    nbNodesExplored = bfsPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    bfsTotalTime += end - start;
                    bfsTotalMemoryUsed += memoryEnd - memoryStart;
                    bfsNodeExplored += nbNodesExplored;            

                    break;
            }
            maze.resetMaze();
        }

    }

    return {
        "AStar" : {
            meanTime: aStarTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (aStarTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: aStarNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        },
        "DFS" : {
            meanTime: dfsTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (dfsTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: dfsNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        },
        "BFS" : {
            meanTime: bfsTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (bfsTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: bfsNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        }
    };
}

function testPerformanceRandom(size) {
    const nbIterations = 1000;
    const algo = ["AStar", "DFS", "BFS"];

    let aStarTotalTime = 0;
    let aStarTotalMemoryUsed = 0;
    let aStarNodeExplored = 0;

    let dfsTotalTime = 0;
    let dfsTotalMemoryUsed = 0;
    let dfsNodeExplored = 0;

    let bfsTotalTime = 0;
    let bfsTotalMemoryUsed = 0;
    let bfsNodeExplored = 0;

    for (let i = 0; i < nbIterations; i++) {
        const maze = new Maze(size, size, "random");

        for (const nameAlgo of algo) {
            if (global.gc()) {
                global.gc();
            }
            const memoryStart = process.memoryUsage().heapUsed;
            const start = performance.now();
    
            let nbNodesExplored;
            let end;
            let memoryEnd;
            switch (nameAlgo) {
                case "AStar" :
                    nbNodesExplored = aStarPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    aStarTotalTime += end - start;
                    aStarTotalMemoryUsed += memoryEnd - memoryStart;
                    aStarNodeExplored += nbNodesExplored;           

                    break;
                case "DFS" :
                    nbNodesExplored = dfsPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    dfsTotalTime += end - start;
                    dfsTotalMemoryUsed += memoryEnd - memoryStart;
                    dfsNodeExplored += nbNodesExplored;            
                    
                    break;
                case "BFS" :
                    nbNodesExplored = bfsPerf(maze);

                    end = performance.now();
                    if (global.gc()) {
                        global.gc();
                    }
                    memoryEnd = process.memoryUsage().heapUsed;
            
                    bfsTotalTime += end - start;
                    bfsTotalMemoryUsed += memoryEnd - memoryStart;
                    bfsNodeExplored += nbNodesExplored;            

                    break;
            }
            maze.resetMaze();
        }

    }

    return {
        "AStar" : {
            meanTime: aStarTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (aStarTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: aStarNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        },
        "DFS" : {
            meanTime: dfsTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (dfsTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: dfsNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        },
        "BFS" : {
            meanTime: bfsTotalTime / nbIterations, // Temps moyen en ms
            meanMemoryUsed: (bfsTotalMemoryUsed / nbIterations) / 1024, // Mémoire utilisée en o
            meanNodeExplored: bfsNodeExplored / nbIterations // Nombre de noeuds explorés en moyenne
        }
    };
}

const mazeSizes = [10, 50, 100];
console.log("Labyrinthes générés de manière récursive ");
console.log("-------------");
console.log();
mazeSizes.forEach(size => {
    console.log(`Testing on maze size ${size}x${size}:`);
    console.log(testPerformanceRecursive(size));
});

console.log("Labyrinthes générés de manière aléatoire ");
console.log("-------------");
console.log();
mazeSizes.forEach(size => {
    console.log(`Testing on maze size ${size}x${size}:`);
    console.log(testPerformanceRandom(size));
});