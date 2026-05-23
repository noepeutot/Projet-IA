# MazeRunner

Jeu de labyrinthe avec génération procédurale (Recursive Backtracking, Random, Prim, Kruskal) et résolution algorithmique (BFS, DFS, A\*, Dijkstra).

## Prérequis

Node.js 20 ou supérieur. Aucune dépendance à installer — le projet fonctionne en JS vanilla.

## Lancement

| Commande | Description |
|---|---|
| `npm start` | Lance le jeu dans le navigateur (sert la racine du projet via `npx serve`) |
| `npm run demo` | Démo console : génère un labyrinthe avec chaque algo de génération et le résout avec chaque solveur (voir [cli-demo.js](cli-demo.js)) |
| `npm run bench` | Lance les benchmarks de performance sur les solveurs (~1 min, utilisé pour le rapport) |

## Architecture

```
index.html       Page d'accueil
game.html        Page de jeu
rules.html       Page des règles
css/             Feuilles de styles (tokens, components, game, style)
js/              Scripts front (game, render, effects, constants, rules, landscape)
assets/          Polices et ressources statiques
algorithms/      Solveurs (BFS, DFS, A*, Dijkstra) et générateurs (Prim, Kruskal)
classes/         Modèles métier (Cell, Maze, Player) — purs, headless
benchmarks/      Benchmarks de performance des solveurs
cli-demo.js      Démo Node sans navigateur (sortie ASCII en console)
```
