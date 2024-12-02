export function aStar(maze) {
    // Sélection de coordonnées d'une cellule de départ aléatoirement, située en bordure
    const randomRowStart = Math.floor(Math.random() * maze.length);
    let randomColStart = Math.floor(Math.random() * maze[0].length);

    let randomRowEnd, randomColEnd

    if (randomRowStart > 0 || randomRowStart < maze.length - 1) {
      randomColStart = randomColStart <= 0.5 ? 0 : maze[0].length - 1;
      randomColEnd = randomColStart == 0 ? maze[0].length - 1 : 0;
      randomRowEnd = Math.floor(Math.random() * maze.length);
    } else {
      randomRowEnd = randomRowStart == 0 ? maze.length - 1 : 0;
      randomColEnd = Math.floor(Math.random() * maze[0].length);
    }
}