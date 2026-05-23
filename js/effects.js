/* ============================================================
   MazeRunner — Effets visuels (particules, animations)
   Utilise un canvas overlay full-screen, créé une seule fois.
   ============================================================ */

let canvas, ctx;
const particles = [];
let rafId = null;

const PALETTE = {
    diamond:  '#5DECEB',
    gold:     '#FCEE4B',
    redstone: '#DA3636',
    emerald:  '#17DD62',
    iron:     '#D8D8D8',
    dirt:     '#866043',
    grass:    '#5A8C42',
    purple:   '#A06EF0',
    white:    '#FFFFFF'
};

function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'fx-canvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '9999',
        imageRendering: 'pixelated'
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.vy += p.gravity;
        p.x  += p.vx;
        p.y  += p.vy;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        // Pixel block
        const s = p.size;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
    }
    ctx.globalAlpha = 1;

    if (particles.length > 0) {
        rafId = requestAnimationFrame(tick);
    } else {
        rafId = null;
    }
}

function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
}

function spawn(opts) {
    particles.push(Object.assign({
        x: 0, y: 0, vx: 0, vy: 0,
        gravity: 0.08,
        size: 4,
        color: '#fff',
        life: 40,
        maxLife: 40
    }, opts));
}

/* ─── API ─── */

/** Petit nuage de particules (déplacement joueur) */
export function trail(cellEl, color = PALETTE.gold) {
    if (!cellEl) return;
    ensureCanvas();
    const r = cellEl.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;

    for (let i = 0; i < 4; i++) {
        spawn({
            x: cx + (Math.random() - 0.5) * 8,
            y: cy + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.8) * 1.5,
            gravity: 0.05,
            size: 3 + Math.floor(Math.random() * 2),
            color,
            life: 18 + Math.floor(Math.random() * 12),
            maxLife: 30
        });
    }
    startLoop();
}

/** Feu d'artifice (victoire) */
export function fireworks(centerEl) {
    ensureCanvas();
    const r = centerEl ? centerEl.getBoundingClientRect()
                       : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const colors = [PALETTE.gold, PALETTE.diamond, PALETTE.emerald, PALETTE.redstone, PALETTE.purple, PALETTE.white];

    const burst = (delay, ox, oy) => {
        setTimeout(() => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 60; i++) {
                const angle = (i / 60) * Math.PI * 2;
                const speed = 2 + Math.random() * 4;
                spawn({
                    x: cx + ox,
                    y: cy + oy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    gravity: 0.1,
                    size: 4,
                    color,
                    life: 50 + Math.floor(Math.random() * 30),
                    maxLife: 80
                });
            }
            startLoop();
        }, delay);
    };

    burst(0, 0, 0);
    burst(250, -120, -40);
    burst(500, 140, -20);
    burst(750, -40, 100);
    burst(1000, 60, -100);
}

/** Particules redstone qui montent (défaite) */
export function lavaRise(_modalEl) {
    ensureCanvas();
    const cy = window.innerHeight;
    for (let burst = 0; burst < 6; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 30; i++) {
                spawn({
                    x: Math.random() * window.innerWidth,
                    y: cy + 10,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: -1 - Math.random() * 2,
                    gravity: -0.02,
                    size: 4,
                    color: Math.random() > 0.5 ? PALETTE.redstone : '#FF6B3C',
                    life: 60 + Math.floor(Math.random() * 30),
                    maxLife: 90
                });
            }
            startLoop();
        }, burst * 80);
    }
}

/** Animation "block placement" sur une cellule (apparition saccadée) */
function blockPlaceAnim(cellEl, delay = 0) {
    if (!cellEl) return;
    cellEl.style.opacity = '0';
    cellEl.style.transform = 'scale(0.3)';
    cellEl.style.transformOrigin = 'center';
    setTimeout(() => {
        cellEl.style.transition = 'transform 120ms steps(4, end), opacity 120ms steps(4, end)';
        cellEl.style.opacity = '1';
        cellEl.style.transform = 'scale(1)';
    }, delay);
}

/** Animation de génération du maze entier (cascade rapide) */
export function mazeGenerationAnim(mazeEl) {
    if (!mazeEl) return;
    const cells = mazeEl.querySelectorAll('.cell');
    const total = cells.length;
    const totalDuration = 600;

    cells.forEach((cell, i) => {
        const delay = (i / total) * totalDuration;
        blockPlaceAnim(cell, delay);
    });
}

/** Petite explosion sur arrivée (atteinte du diamant) */
export function diamondHit(cellEl) {
    if (!cellEl) return;
    ensureCanvas();
    const r = cellEl.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;

    for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        spawn({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.08,
            size: 4,
            color: i % 2 ? PALETTE.diamond : PALETTE.white,
            life: 40,
            maxLife: 40
        });
    }
    startLoop();
}
