// CPSC 581 Portfolio - Elda Britu - 30158734 - B01

(function () {
  var overlay  = document.getElementById('lockscreen');
  var wrap     = document.getElementById('lock-btn-wrap');
  var btn      = document.getElementById('lock-btn');
  var SEEN_KEY = 'portfolio_seen';

  var IMG_LOCKED   = './btn_locked.png';
  var IMG_UNLOCKED = './btn_unlocked.png';

  var PASTELS = ['#FFB3C6','#FFD6A5','#FDFFB6','#CAFFBF','#9BF6FF','#BDB2FF','#FFC6FF'];

  // Set locked image src (keeps HTML clean)
  btn.src = IMG_LOCKED;

  // If already visited, skip entirely
  if (sessionStorage.getItem(SEEN_KEY)) {
    overlay.remove();
    return;
  }

  btn.addEventListener('click', function () {
    wrap.classList.add('unlocking');
    wrap.style.pointerEvents = 'none';
    btn.src = IMG_UNLOCKED;
    btn.classList.add('bounce');
    sessionStorage.setItem(SEEN_KEY, '1');

    // Confetti starts immediately alongside the bounce
    launchConfetti(function () {
      revealFromCenter(overlay);
    });
  });

  /* Confetti */
  function launchConfetti(onDone) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:10000;pointer-events:none;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var cx = canvas.width / 2, cy = canvas.height / 2;
    var particles = [];

    for (var i = 0; i < 180; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 5 + Math.random() * 12;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 12,
        w: 7 + Math.random() * 10,
        h: 4 + Math.random() * 7,
        r: 4 + Math.random() * 5,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        color: PASTELS[Math.floor(Math.random() * PASTELS.length)],
        alpha: 1
      });
    }

    var DURATION = 2600, start = null;
    var revealTriggered = false;

    function tick(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var prog    = elapsed / DURATION;

      // Kick off the reveal at 60% through the confetti
      if (prog >= 0.6 && !revealTriggered) {
        revealTriggered = true;
        onDone();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var anyAlive = false;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x  += p.vx;  p.y  += p.vy;
        p.vy += 0.28;  p.vx *= 0.99;
        p.rot += p.rotV;
        p.alpha = prog < 0.55 ? 1 : Math.max(0, 1 - (prog - 0.55) / 0.45);
        if (p.alpha <= 0) continue;
        anyAlive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (elapsed < DURATION && anyAlive) requestAnimationFrame(tick);
      else { canvas.remove();}
    }
    requestAnimationFrame(tick);
  }

  /* Radial reveal */
  function revealFromCenter(overlay) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var ctx  = canvas.getContext('2d');
    // Paint black synchronously so there's no gap between overlay removal and first animation frame
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    overlay.remove();

    var ctx  = canvas.getContext('2d');
    var cx   = canvas.width  / 2;
    var cy   = canvas.height / 2;
    var maxR = Math.hypot(cx, cy) * 1.05;
    var DURATION = 950, start = null;

    function draw(ts) {
      if (!start) start = ts;
      var prog  = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      var r     = eased * maxR;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      if (prog < 1) requestAnimationFrame(draw);
      else canvas.remove();
    }
    requestAnimationFrame(draw);
  }

})();