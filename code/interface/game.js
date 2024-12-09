import { dfs } from '../algorithms/dfs.js';
import { bfs } from '../algorithms/bfs.js';
import { Maze } from '../classes/Maze.js';
import { Player } from '../classes/Player.js';

const mazeContainer = document.getElementById('maze-container');
const algoSelect = document.getElementById('algo-select');
const generateButton = document.getElementById('generate-maze');
const applyAlgoButton = document.getElementById('apply-algo');
const mazeSizeInput = document.getElementById('maze-size');

let maze;
let player;

// Initialisation du labyrinthe et du joueur au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    generateNewMaze();
});

/**
 * Générer un nouveau labyrinthe
 */
function generateNewMaze() {
    const size = parseInt(mazeSizeInput.value);
    if (size < 5 || size > 30) {
        alert('La taille doit être comprise entre 5 et 30');
        return;
    }
    
    player = new Player('Joueur 1');
    maze = new Maze(size, size);
    maze.addPlayer(player, maze.getStartCell());
    maze.renderMaze(mazeContainer);
}

/**
 * Appliquer l'algorithme de recherche
 */
function applyAlgorithm() {
    if (!maze) {
        alert('Veuillez d\'abord générer un labyrinthe');
        return;
    }
    
    const selectedAlgo = algoSelect.value;
    if (selectedAlgo === 'dfs') {
        dfs(maze);
    } else {
        bfs(maze);
    }
    
    maze.renderMaze(mazeContainer);
}

// Écouter les événements clavier pour les mouvements du joueur
document.addEventListener('keydown', (event) => {
    let moved = false;

    if (event.key === 'ArrowUp' || event.key === 'z') {
        moved = maze.movePlayer(player, 'up');
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        moved = maze.movePlayer(player, 'right');
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        moved = maze.movePlayer(player, 'down');
    } else if (event.key === 'ArrowLeft' || event.key === 'q') {
        moved = maze.movePlayer(player, 'left');
    }

    if (moved) {
        maze.renderMaze(mazeContainer);

        if (maze.isFinished()) {
            alert('Félicitations ! Vous avez terminé le labyrinthe !');
        }
    }
});

// Écouter les événements du menu 
generateButton.addEventListener('click', generateNewMaze);
applyAlgoButton.addEventListener('click', applyAlgorithm);
