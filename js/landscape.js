/* ============================================================
   MazeRunner — Paysage de nuit pixelisé
   Génère 80 étoiles + 3 couches de terrain SVG (loin, médian, premier plan).
   Inclus depuis index.html et rules.html.
   ============================================================ */

const BLOCK = 8;
const W = 200;

function makeTerrainPath(amplitudeFn, baseHeight, offsetY) {
    let d = `M0,200 `;
    for (let x = 0; x < W; x++) {
        const h = baseHeight + Math.floor(Math.abs(amplitudeFn(x)));
        d += `L${x * BLOCK},${200 - h * BLOCK - offsetY} `;
    }
    d += `L${W * BLOCK},200 Z`;
    return d;
}

function populateStars(container, count = 80) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        const size = Math.random() < 0.7 ? 1 : 2;
        const opacity = 0.4 + Math.random() * 0.6;
        Object.assign(s.style, {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: '#e8eeff',
            opacity: String(opacity)
        });
        frag.appendChild(s);
    }
    container.appendChild(frag);
}

function paintTerrain(svgFar, svgMid, svgFg) {
    const SVGNS = 'http://www.w3.org/2000/svg';
    const setupSvg = (svg) => {
        if (!svg) return;
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('viewBox', `0 0 ${W * BLOCK} 200`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
    };

    setupSvg(svgFar);
    setupSvg(svgMid);
    setupSvg(svgFg);

    if (svgFar) {
        const path = document.createElementNS(SVGNS, 'path');
        path.setAttribute('d', makeTerrainPath(
            (x) => Math.sin(x * 0.15 + 1.2) * 5 + Math.sin(x * 0.07) * 8,
            4, 30
        ));
        path.setAttribute('fill', '#1a0f2e');
        path.setAttribute('opacity', '0.9');
        svgFar.appendChild(path);
    }

    if (svgMid) {
        const heights = [];
        for (let x = 0; x < W; x++) {
            heights.push(3 + Math.floor(Math.abs(Math.sin(x * 0.3 + 0.5) * 3 + Math.sin(x * 0.13 + 2) * 5)));
        }
        const path = document.createElementNS(SVGNS, 'path');
        let d = `M0,200 `;
        for (let x = 0; x < W; x++) {
            d += `L${x * BLOCK},${200 - heights[x] * BLOCK - 10} `;
        }
        d += `L${W * BLOCK},200 Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', '#0f1f0a');
        path.setAttribute('opacity', '0.95');
        svgMid.appendChild(path);

        for (let x = 0; x < W; x++) {
            if (x % 3 === 0 && heights[x] > 5) {
                const tree = document.createElementNS(SVGNS, 'rect');
                tree.setAttribute('x', String(x * BLOCK + BLOCK / 4));
                tree.setAttribute('y', String(200 - heights[x] * BLOCK - 10 - BLOCK));
                tree.setAttribute('width', String(BLOCK / 2));
                tree.setAttribute('height', String(BLOCK));
                tree.setAttribute('fill', '#162b0a');
                svgMid.appendChild(tree);
            }
        }
    }

    if (svgFg) {
        const path = document.createElementNS(SVGNS, 'path');
        path.setAttribute('d', makeTerrainPath(
            (x) => Math.sin(x * 0.5 + 1) * 2 + Math.sin(x * 0.2) * 3,
            2, 0
        ));
        path.setAttribute('fill', '#0a0f06');
        svgFg.appendChild(path);

        const grass1 = document.createElementNS(SVGNS, 'rect');
        grass1.setAttribute('x', '0');
        grass1.setAttribute('y', '190');
        grass1.setAttribute('width', String(W * BLOCK));
        grass1.setAttribute('height', '8');
        grass1.setAttribute('fill', '#1a3a0a');
        grass1.setAttribute('opacity', '0.9');
        svgFg.appendChild(grass1);

        const grass2 = document.createElementNS(SVGNS, 'rect');
        grass2.setAttribute('x', '0');
        grass2.setAttribute('y', '196');
        grass2.setAttribute('width', String(W * BLOCK));
        grass2.setAttribute('height', '4');
        grass2.setAttribute('fill', '#0f2206');
        svgFg.appendChild(grass2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateStars(document.querySelector('.bg-stars'));
    paintTerrain(
        document.querySelector('.bg-terrain-far'),
        document.querySelector('.bg-terrain-mid'),
        document.querySelector('.bg-terrain-fg')
    );
});
