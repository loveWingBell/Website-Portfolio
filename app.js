// CPSC 581 Portfolio - Elda Britu - 30158734 - B01

// Theme toggle
const themeToggles = document.querySelectorAll('.theme-toggle');

// Restore saved preference on load
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme',
      document.body.classList.contains('light') ? 'light' : 'dark');
  });
});

// Scroll hide / show
  const nav       = document.querySelector('.tri-nav');
  const mobileBar = document.querySelector('.tri-nav__mobile-bar');
  const THRESHOLD = 80;
  const MOBILE_BP = 767;

  let lastY    = window.scrollY;
  let pendingY = lastY;
  let ticking  = false;

  function update() {
    const y        = pendingY;
    const isMobile = window.innerWidth <= MOBILE_BP;
    const delta    = y - lastY;

    if (delta > 0 && y > THRESHOLD) {
      if (isMobile) { mobileBar.classList.add('bar--hidden'); }
      else          { nav.classList.add('nav--hidden'); }
    } else if (delta < 0 || y <= THRESHOLD) {
      nav.classList.remove('nav--hidden');
      mobileBar.classList.remove('bar--hidden');
    }

    lastY   = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    pendingY = window.scrollY;
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();

// Floating bubbles in hero only
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Pastel confetti palette — same as lockscreen edge-glow and confetti
  const COLORS = [
    '#FFB3C6',
    '#BCC8FF',
    '#CAFFBF',
    '#9BF6FF',
    '#FFD6A5',
    '#FFC6FF',
    '#FDFFB6',
  ];

  function spawnBubble() {
    const el = document.createElement('div');
    el.className = 'bubble';

    const size     = 14 + Math.random() * 44;
    const x        = 2  + Math.random() * 96;
    const duration = 10 + Math.random() * 14;
    const delay    = Math.random() * 1.5;
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opacity  = (0.12 + Math.random() * 0.18).toFixed(3);

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --bop: ${opacity};
    `;

    hero.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
  }

  // Seed initial batch mid-flight
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'bubble';
    const size     = 14 + Math.random() * 44;
    const x        = 2  + Math.random() * 96;
    const duration = 10 + Math.random() * 14;
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opacity  = (0.12 + Math.random() * 0.18).toFixed(3);
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      bottom: ${Math.random() * 100}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: -${Math.random() * duration}s;
      --bop: ${opacity};
    `;
    hero.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }

  setInterval(spawnBubble, 700);
})();

// Pentagon work carousel
(function () {
  // Work data (5 projects) 
  const WORKS = [
    {
      num: '01',
      color: 'var(--accent)',
      cat: 'Lorem ipsum · Dolor sit',
      title: 'Lorem Ipsum<br>Dolor Amet',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      tags: ['Lorem', 'Ipsum', 'Dolor'],
    },
    {
      num: '02',
      color: 'var(--accent-2)',
      cat: 'Consectetur · Adipiscing',
      title: 'Consectetur<br>Adipiscing',
      desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: ['Sit', 'Amet', 'Elit'],
    },
    {
      num: '03',
      color: 'var(--mint)',
      cat: 'Eiusmod · Tempor',
      title: 'Eiusmod<br>Tempor',
      desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
      tags: ['Eiusmod', 'Tempor', 'Labore'],
    },
    {
      num: '04',
      color: 'var(--accent)',
      cat: 'Voluptate · Velit',
      title: 'Voluptate<br>Velit Esse',
      desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      tags: ['Velit', 'Esse', 'Fugiat'],
    },
    {
      num: '05',
      color: 'var(--accent-2)',
      cat: 'Proident · Officia',
      title: 'Proident<br>Officia Mollit',
      desc: 'Sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis unde omnis iste natus error sit voluptatem.',
      tags: ['Proident', 'Officia', 'Natus'],
    },
  ];

  // Pentagon geometry 
  // 5 vertices, base angles (SVG: 0=right, clockwise):
  // V0=270° (top), V1=342° (top-right), V2=54° (bottom-right),
  // V3=126° (bottom-left), V4=198° (top-left / active slot)
  const BASE_ANGLES = [270, 342, 54, 126, 198];
  const TARGET_ANGLE = 198; // active slot = left vertex

  // Snap rotation so each node lands at TARGET_ANGLE:
  // rot_i = (TARGET_ANGLE - BASE_ANGLES[i] + 360) % 360
  const SNAP_ROTS = BASE_ANGLES.map(b => ((TARGET_ANGLE - b) % 360 + 360) % 360);
  // [288, 216, 144, 72, 0]

  // Node positions (SVG coords, radius 160)
  const NODE_COORDS = [
    { cx:    0,      cy: -160   },  // V0
    { cx:  152.2,    cy:  -49.4 },  // V1
    { cx:   94.1,    cy:  129.4 },  // V2
    { cx:  -94.1,    cy:  129.4 },  // V3
    { cx: -152.2,    cy:  -49.4 },  // V4
  ];

  // DOM references
  const dialSVG  = document.getElementById('pentagonDial');
  const group    = document.getElementById('pentagonGroup');
  const nodes    = document.querySelectorAll('.pnode');
  const labels   = document.querySelectorAll('.pnode__label');
  const featured = document.getElementById('workFeatured');
  const fBar     = document.getElementById('wfeatBar');
  const fNum     = document.getElementById('wfeatNum');
  const fCat     = document.getElementById('wfeatCat');
  const fTitle   = document.getElementById('wfeatTitle');
  const fDesc    = document.getElementById('wfeatDesc');
  const fTags    = document.getElementById('wfeatTags');

  if (!dialSVG || !group) return;

  // State 
  let rotation      = SNAP_ROTS[0]; // start with project 0 active
  let activeIdx     = 0;
  let isDragging    = false;
  let startMouseAngle = 0;
  let startRotation   = 0;

  // Helpers 
  function angularDist(a, b) {
    const d = Math.abs(((a - b) % 360 + 360) % 360);
    return d <= 180 ? d : 360 - d;
  }

  function getActiveIdx(rot) {
    let best = -1, bestDist = Infinity;
    BASE_ANGLES.forEach((base, i) => {
      const cur = ((base + rot) % 360 + 360) % 360;
      const d   = angularDist(cur, TARGET_ANGLE);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function nearestSnap(rot) {
    const normalised = ((rot % 360) + 360) % 360;
    let best = SNAP_ROTS[0], bestDist = Infinity, bestIdx = 0;
    SNAP_ROTS.forEach((s, i) => {
      const d = angularDist(normalised, s);
      if (d < bestDist) { bestDist = d; best = s; bestIdx = i; }
    });
    return { snapRot: best, idx: bestIdx };
  }

  function getSVGCenter() {
    const rect = dialSVG.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  }

  function mouseAngle(e, cx, cy) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
  }

  // Render
  function applyRotation(rot, newActiveIdx) {
    group.setAttribute('transform', `rotate(${rot})`);

    // Counter-rotate each label so it always reads upright.
    // Each label lives at (cx, cy) in the group's local space.
    // A counter-rotation of -rot around that point keeps it upright.
    labels.forEach((label, i) => {
      const { cx, cy } = NODE_COORDS[i];
      label.setAttribute('transform', `rotate(${-rot}, ${cx}, ${cy})`);
    });

    nodes.forEach((n, i) => {
      n.classList.toggle('pnode--active', i === newActiveIdx);
    });
  }

  function updateFeatured(idx, animate = true) {
    if (idx === activeIdx && featured.dataset.loaded) return;
    activeIdx = idx;
    featured.dataset.loaded = '1';
    const w = WORKS[idx];

    if (animate) {
      featured.classList.remove('feat--fade');
      void featured.offsetWidth;
      featured.classList.add('feat--fade');
    }

    fBar.style.background = w.color;
    fNum.textContent       = w.num;
    fCat.textContent       = w.cat;
    fTitle.innerHTML       = w.title;
    fDesc.textContent      = w.desc;
    fTags.innerHTML        = w.tags.map(t => `<span class="tag">${t}</span>`).join('');
  }

  // Initialise
  applyRotation(rotation, 0);
  updateFeatured(0, false);

  // Drag
  dialSVG.addEventListener('mousedown',  onDragStart);
  dialSVG.addEventListener('touchstart', onDragStart, { passive: true });

  function onDragStart(e) {
    if (e.type === 'touchstart' && e.touches.length > 1) return;
    isDragging = true;
    const { cx, cy } = getSVGCenter();
    startMouseAngle  = mouseAngle(e, cx, cy);
    startRotation    = rotation;
    dialSVG.style.cursor = 'grabbing';
  }

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchmove', onDragMove, { passive: true });

  function onDragMove(e) {
    if (!isDragging) return;
    const { cx, cy }   = getSVGCenter();
    const currentAngle = mouseAngle(e, cx, cy);
    const delta        = currentAngle - startMouseAngle;
    rotation           = startRotation + delta;

    const liveIdx = getActiveIdx(rotation);
    applyRotation(rotation, liveIdx);
    updateFeatured(liveIdx);
  }

  window.addEventListener('mouseup',  onDragEnd);
  window.addEventListener('touchend', onDragEnd);

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    dialSVG.style.cursor = 'grab';

    const { snapRot, idx } = nearestSnap(rotation);

    let diff = snapRot - ((rotation % 360 + 360) % 360);
    if (diff >  180) diff -= 360;
    if (diff < -180) diff += 360;
    rotation += diff;

    group.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)';
    applyRotation(rotation, idx);
    updateFeatured(idx);
    setTimeout(() => { group.style.transition = ''; }, 380);
  }

  // Click on a node 
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      let diff = SNAP_ROTS[i] - ((rotation % 360 + 360) % 360);
      if (diff >  180) diff -= 360;
      if (diff < -180) diff += 360;
      rotation += diff;

      group.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
      applyRotation(rotation, i);
      updateFeatured(i);
      setTimeout(() => { group.style.transition = ''; }, 480);
    });
  });
})();
