const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = document.getElementById('aim-toggle');
const autoFireToggle = document.getElementById('autofire-toggle');

const CONFIG = {
  width: 800,
  height: 600,
  paddleWidth: 120,
  paddleHeight: 16,
  paddleSpeed: 600,
  paddleMaxSpeed: 600, // vitesse max (légèrement supérieure à la balle)
  ballSpeed: 540,
  ballRadius: 8,
  brickRows: 5,
  brickCols: 6,
  brickTopOffset: 70,
  brickPadding: 8,
  brickHeight: 22,
  sideMargin: 30,
  aimJitterDeg: 5,
  maxBalls: 2,
  launchCooldownMs: 500,
  brickDriftSpeed: 22, // pixels/sec, tapis roulant lent vers le bas mais plus rapide
  brickSpawnInterval: 1.1,
  brickRowFillRate: 0.525, // 25% de briques en moins par rangée
  brickPauseChance: 0.25, // chance de ne rien spawner pour faire une pause
  bonusChance: 0.15
};

const state = {
  keys: {
    left: false,
    right: false
  },
  paddle: {
    x: 0,
    y: 0,
    w: CONFIG.paddleWidth,
    h: CONFIG.paddleHeight
  },
  heldBall: {
    x: 0,
    y: 0,
    r: CONFIG.ballRadius,
    vx: 0,
    vy: 0
  },
  balls: [],
  bricks: [],
  score: 0,
  lives: 3,
  running: true,
  autoPlay: true,
  showAim: false,
  ballHeld: true,
  autoFire: true,
  ballCount: 1,
  lastLaunch: 0,
  spawnTimer: 0,
  rowIndex: 0
};

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function withAimJitter(vx, vy) {
  const angle = Math.atan2(vy, vx);
  const jitter = degToRad(CONFIG.aimJitterDeg);
  const offset = (Math.random() * 2 - 1) * jitter;
  const speed = Math.hypot(vx, vy);
  const nx = Math.cos(angle + offset);
  const ny = Math.sin(angle + offset);
  return { vx: nx * speed, vy: ny * speed };
}

function resizeCanvas() {
  canvas.width = CONFIG.width;
  canvas.height = CONFIG.height;
}

function computeBrickLayout() {
  const { brickCols, brickPadding, sideMargin } = CONFIG;
  const baseCols = brickCols + 2; // largeur héritée d'un layout plus large
  const brickWidthBase = (CONFIG.width - sideMargin * 2 - brickPadding * (baseCols - 1)) / baseCols;
  const totalWidth = brickCols * brickWidthBase + brickPadding * (brickCols - 1);
  const startX = (CONFIG.width - totalWidth) / 2;
  return { brickWidthBase, startX };
}

function spawnBrickRow() {
  const { brickCols, brickPadding, brickHeight, brickTopOffset, brickRowFillRate, bonusChance } = CONFIG;
  const { brickWidthBase, startX } = computeBrickLayout();

  const bricks = [];
  let spawned = 0;
  for (let col = 0; col < brickCols; col += 1) {
    if (Math.random() > brickRowFillRate) continue;
    const x = startX + col * (brickWidthBase + brickPadding);
    const y = -brickHeight - brickTopOffset;
    const bonus = Math.random() < bonusChance;
    bricks.push({
      x,
      y,
      w: brickWidthBase,
      h: brickHeight,
      alive: true,
      row: state.rowIndex,
      bonus
    });
    spawned += 1;
  }

  if (spawned === 0) {
    // Garantit au moins une brique.
    const col = Math.floor(Math.random() * brickCols);
    const x = startX + col * (brickWidthBase + brickPadding);
    const y = -brickHeight - brickTopOffset;
    bricks.push({
      x,
      y,
      w: brickWidthBase,
      h: brickHeight,
      alive: true,
      row: state.rowIndex,
      bonus: Math.random() < bonusChance
    });
  }

  state.rowIndex += 1;
  state.bricks.push(...bricks);
}

function selectTargetBrick() {
  const dangerY = CONFIG.height * 0.72;
  const alive = state.bricks.filter((b) => b.alive);
  if (!alive.length) return null;

  const dangerous = alive.filter((b) => b.y + b.h >= dangerY);
  if (dangerous.length) return dangerous.sort((a, b) => b.y - a.y)[0];

  const bonus = alive.filter((b) => b.bonus);
  if (bonus.length) return bonus.sort((a, b) => b.y - a.y)[0];

  return alive.sort((a, b) => b.y - a.y)[0];
}

function placeBallOnPaddle({ centerPaddle = false, refill = false } = {}) {
  const { paddle, heldBall } = state;
  paddle.w = CONFIG.paddleWidth;
  paddle.h = CONFIG.paddleHeight;
  if (centerPaddle) {
    paddle.x = (CONFIG.width - paddle.w) / 2;
  }
  paddle.y = CONFIG.height - 60;
  heldBall.x = paddle.x + paddle.w / 2;
  heldBall.y = paddle.y - heldBall.r - 2;
  heldBall.vx = 0;
  heldBall.vy = 0;
  state.ballHeld = true;
  if (refill) {
    state.ballCount = Math.min(CONFIG.maxBalls, state.ballCount + 1);
  }
}

function launchBall() {
  if (!state.ballHeld || state.ballCount <= 0) return;
  const now = performance.now ? performance.now() : Date.now();
  if (now - state.lastLaunch < CONFIG.launchCooldownMs) return;
  state.ballCount -= 1;
  state.ballHeld = false;
  state.lastLaunch = now;
  const speed = CONFIG.ballSpeed;
  const originX = state.heldBall.x;
  const originY = state.heldBall.y;

  let vx;
  let vy;

  if (state.autoPlay) {
    const target = selectTargetBrick();
    if (target) {
      const dx = target.x + target.w / 2 - originX;
      const dy = target.y + target.h / 2 - originY;
      const len = Math.hypot(dx, dy) || 1;
      const aimed = withAimJitter((dx / len) * speed, (dy / len) * speed);
      vx = aimed.vx;
      vy = aimed.vy;
      if (vy > -40) vy = -Math.abs(vy) - 40;
    }
  }

  if (vx === undefined || vy === undefined) {
    const angle = (Math.random() * 0.5 + 0.25) * Math.PI; // entre 45° et 135°
    const direction = Math.random() > 0.5 ? 1 : -1;
    const aimed = withAimJitter(Math.cos(angle) * speed * direction, -Math.abs(Math.sin(angle) * speed));
    vx = aimed.vx;
    vy = aimed.vy;
  }

  state.balls.push({
    x: originX,
    y: originY,
    r: CONFIG.ballRadius,
    vx,
    vy,
    returning: false
  });
}

function resetGame() {
  state.score = 0;
  state.lives = 3;
  state.bricks = [];
  state.rowIndex = 0;
  state.spawnTimer = 0;
  state.ballCount = 1;
  state.balls = [];
  placeBallOnPaddle({ centerPaddle: true });
  spawnBrickRow();
}

function update(dt) {
  if (!state.running) return;
  const { paddle, heldBall, keys } = state;

  if (!state.ballHeld && state.ballCount > 0) {
    placeBallOnPaddle();
  }

  // Génération continue de briques façon rail infini.
  state.spawnTimer += dt;
  while (state.spawnTimer >= CONFIG.brickSpawnInterval) {
    state.spawnTimer -= CONFIG.brickSpawnInterval;
    if (Math.random() >= CONFIG.brickPauseChance) {
      spawnBrickRow();
    }
  }

  // Descente lente des briques façon tapis roulant.
  for (const brick of state.bricks) {
    if (brick.alive) {
      brick.y += CONFIG.brickDriftSpeed * dt;
    }
  }

  // Si une brique atteint le bas, perte de vie.
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.y + brick.h >= CONFIG.height) {
      brick.alive = false;
      state.lives -= 1;
      if (state.lives <= 0) {
        state.running = false;
      }
    }
  }

  // Nettoyage des briques sorties ou détruites pour éviter l'accumulation.
  state.bricks = state.bricks.filter((b) => b.alive || b.y < CONFIG.height + 120);

  if (state.ballHeld) {
    // Garde la balle dans la "poche" au-dessus du paddle.
    heldBall.x = paddle.x + paddle.w / 2;
    heldBall.y = paddle.y - heldBall.r - 2;
    if (state.autoFire) {
      launchBall();
    }
  }

  // Mouvement du paddle
  const refBall = state.ballHeld
    ? heldBall
    : (state.balls.find((b) => b.vy > 0) || state.balls[0] || heldBall);

  if (state.autoPlay) {
    // Suivi automatique lissé (approche progressive du point visé).
    const targetX = refBall && refBall.vy > 0
      ? refBall.x - paddle.w / 2
      : CONFIG.width / 2 - paddle.w / 2;
    const smoothing = 8; // plus élevé = plus réactif
    const maxStep = CONFIG.paddleMaxSpeed * dt;
    const delta = (targetX - paddle.x) * smoothing * dt;
    paddle.x += clamp(delta, -maxStep, maxStep);
  } else {
    if (keys.left) {
      paddle.x -= CONFIG.paddleSpeed * dt;
    }
    if (keys.right) {
      paddle.x += CONFIG.paddleSpeed * dt;
    }
  }
  paddle.x = clamp(paddle.x, 0, CONFIG.width - paddle.w);

  // Mouvement et collisions pour chaque balle active
  for (let i = state.balls.length - 1; i >= 0; i -= 1) {
    const ball = state.balls[i];
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.returning) {
      const targetX = paddle.x + paddle.w / 2;
      const targetY = paddle.y - paddle.h;
      const dx = targetX - ball.x;
      const dy = targetY - ball.y;
      const dist = Math.hypot(dx, dy);
      if (dist < Math.max(ball.r + 4, paddle.h + 4)) {
        state.balls.splice(i, 1);
        placeBallOnPaddle({ refill: true });
        continue;
      }
      if (dist > 0.0001) {
        const speed = ball.returnSpeed || (CONFIG.ballSpeed * 0.5);
        const scale = speed / dist;
        ball.vx = dx * scale;
        ball.vy = dy * scale;
      }
      continue;
    }

    // Collisions murs
    if (ball.x - ball.r <= 0 && ball.vx < 0) {
      ball.x = ball.r;
      ball.vx *= -1;
    }
    if (ball.x + ball.r >= CONFIG.width && ball.vx > 0) {
      ball.x = CONFIG.width - ball.r;
      ball.vx *= -1;
    }
    if (ball.y - ball.r <= 0 && ball.vy < 0) {
      ball.y = ball.r;
      ball.vy *= -1;
    }

    // Paddle
    const hitPaddle = !ball.returning && (
      ball.y + ball.r >= paddle.y &&
      ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= paddle.x - ball.r &&
      ball.x <= paddle.x + paddle.w + ball.r &&
      ball.vy > 0
    );

    if (hitPaddle) {
      ball.y = paddle.y - ball.r;
      ball.vy *= -1;

      const speed = Math.hypot(ball.vx, ball.vy);
      if (state.autoPlay) {
        // Vise le centre de la brique la plus haute encore vivante.
        const target = selectTargetBrick();
        if (target) {
          const tx = target.x + target.w / 2;
          const ty = target.y + target.h / 2;
          const dx = tx - ball.x;
          const dy = ty - ball.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dx / len;
          const ny = dy / len;
          const aimed = withAimJitter(nx * speed, ny * speed);
          ball.vx = aimed.vx;
          ball.vy = aimed.vy;
          if (ball.vy > -40) ball.vy = -Math.abs(ball.vy) - 40; // évite un angle trop plat vers le bas
        } else {
          const aimed = withAimJitter(ball.vx, -Math.abs(ball.vy));
          ball.vx = aimed.vx;
          ball.vy = aimed.vy;
        }
      } else {
        // Ajuste l'angle selon le point d'impact côté joueur.
        const hitPos = (ball.x - paddle.x) / paddle.w; // 0 -> 1
        const offset = (hitPos - 0.5) * 2; // -1 -> 1
        const maxAngle = (70 * Math.PI) / 180;
        const angle = offset * maxAngle;
        const aimed = withAimJitter(Math.sin(angle) * speed, -Math.cos(angle) * speed);
        ball.vx = aimed.vx;
        ball.vy = aimed.vy;
      }
    }

    // Briques
    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      const withinX = ball.x + ball.r >= brick.x && ball.x - ball.r <= brick.x + brick.w;
      const withinY = ball.y + ball.r >= brick.y && ball.y - ball.r <= brick.y + brick.h;

      if (withinX && withinY) {
        brick.alive = false;
        state.score += 50 + brick.row * 10;
        if (brick.bonus) {
          state.ballCount = Math.min(CONFIG.maxBalls, state.ballCount + 1);
        }

        // Choix d'axe de rebond simple.
        const overlapLeft = ball.x + ball.r - brick.x;
        const overlapRight = brick.x + brick.w - (ball.x - ball.r);
        const overlapTop = ball.y + ball.r - brick.y;
        const overlapBottom = brick.y + brick.h - (ball.y - ball.r);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapLeft || minOverlap === overlapRight) {
          ball.vx *= -1;
        } else {
          ball.vy *= -1;
        }
        break;
      }
    }

    // Balle perdue -> revient dans la poche sans perdre de vie.
    if (ball.y - ball.r > CONFIG.height) {
      if (!ball.returning) {
        const targetX = paddle.x + paddle.w / 2;
        const targetY = paddle.y - paddle.h;
        const dx = targetX - ball.x;
        const dy = targetY - ball.y;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = CONFIG.ballSpeed * 0.5;
        ball.returnSpeed = speed;
        ball.vx = (dx / dist) * speed;
        ball.vy = (dy / dist) * speed;
        ball.returning = true;
      }
    }
  }
}

function renderBackground() {
  ctx.fillStyle = '#0b1223';
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
  const gradient = ctx.createLinearGradient(0, 0, CONFIG.width, CONFIG.height);
  gradient.addColorStop(0, 'rgba(94, 234, 212, 0.12)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.12)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
}

function renderBricks() {
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    const hue = 200 + brick.row * 12;
    ctx.fillStyle = brick.bonus ? '#fbbf24' : `hsl(${hue}, 70%, 60%)`;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.strokeStyle = brick.bonus ? 'rgba(161, 98, 7, 0.6)' : 'rgba(15, 23, 42, 0.4)';
    ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
  }
}

function renderPaddle() {
  const { paddle } = state;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

function renderAimCone() {
  if (!state.showAim) return;
  const { paddle } = state;
  const originX = paddle.x + paddle.w / 2;
  const originY = paddle.y;

  // Direction d'intention: auto vers la première brique vivante, sinon vers le haut.
  let dirX = 0;
  let dirY = -1;
  let targetPoint = null;
  if (state.autoPlay) {
    const target = selectTargetBrick();
    if (target) {
      targetPoint = { x: target.x + target.w / 2, y: target.y + target.h / 2 };
      dirX = targetPoint.x - originX;
      dirY = targetPoint.y - originY;
      const len = Math.hypot(dirX, dirY) || 1;
      dirX /= len;
      dirY /= len;
    }
  }

  const baseAngle = Math.atan2(dirY, dirX);
  const jitter = degToRad(CONFIG.aimJitterDeg);
  const len = 100;

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + Math.cos(baseAngle - jitter) * len, originY + Math.sin(baseAngle - jitter) * len);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + Math.cos(baseAngle + jitter) * len, originY + Math.sin(baseAngle + jitter) * len);
  ctx.stroke();

  if (targetPoint) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(targetPoint.x, targetPoint.y);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + Math.cos(baseAngle - jitter) * len, originY + Math.sin(baseAngle - jitter) * len);
  ctx.lineTo(originX + Math.cos(baseAngle + jitter) * len, originY + Math.sin(baseAngle + jitter) * len);
  ctx.closePath();
  ctx.fill();
}

function renderBalls() {
  ctx.fillStyle = '#f472b6';
  for (const ball of state.balls) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (state.ballHeld) {
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(state.heldBall.x, state.heldBall.y, state.heldBall.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderHUD() {
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillText(`Score: ${state.score}`, 14, 24);
  ctx.fillText(`Vies: ${state.lives}`, CONFIG.width - 80, 24);
  ctx.fillText(state.autoPlay ? 'Auto: ON' : 'Auto: OFF', CONFIG.width / 2 - 40, 24);
  const totalOwned = state.ballCount + state.balls.length + (state.ballHeld ? 1 : 0);
  ctx.fillText(`Balles: ${state.ballCount}/${totalOwned}`, CONFIG.width / 2 - 40, 46);

  if (!state.running) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('Partie terminée - Appuyez sur Entrée pour rejouer', 110, CONFIG.height / 2);
  }
}

function render() {
  renderBackground();
  renderBricks();
  renderPaddle();
  renderAimCone();
  renderBalls();
  renderHUD();
}

function loop(timestamp) {
  if (typeof loop.lastTime === 'undefined') {
    loop.lastTime = timestamp;
  }
  const dt = Math.min((timestamp - loop.lastTime) / 1000, 0.033);
  loop.lastTime = timestamp;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

function bindControls() {
  window.addEventListener('keydown', (event) => {
    if (state.ballHeld && (event.code === 'Space' || event.key === 'ArrowUp' || event.key === 'Enter')) {
      launchBall();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'q') state.keys.left = true;
    if (event.key === 'ArrowRight' || event.key === 'd') state.keys.right = true;
    if (event.key === 'Enter' && !state.running) {
      state.running = true;
      resetGame();
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'q') state.keys.left = false;
    if (event.key === 'ArrowRight' || event.key === 'd') state.keys.right = false;
  });
  autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    autoBtn.textContent = state.autoPlay ? 'Désactiver auto-visée' : 'Activer auto-visée';
  });
  aimToggle.addEventListener('change', (event) => {
    state.showAim = event.target.checked;
  });
  autoFireToggle.addEventListener('change', (event) => {
    state.autoFire = event.target.checked;
  });
  canvas.addEventListener('click', () => {
    if (state.ballHeld) launchBall();
  });
}

function init() {
  resizeCanvas();
  bindControls();
  autoBtn.textContent = state.autoPlay ? 'Désactiver auto-visée' : 'Activer auto-visée';
  aimToggle.checked = state.showAim;
  autoFireToggle.checked = state.autoFire;
  resetGame();
  requestAnimationFrame(loop);
}

init();
