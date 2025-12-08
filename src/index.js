const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = document.getElementById('aim-toggle');
const autoFireToggle = document.getElementById('autofire-toggle');

const CONFIG = {
  width: 1600,
  height: 1200,
  paddleWidth: 120,
  paddleHeight: 16,
  paddleSpeed: 600,
  paddleMaxSpeed: 600, // vitesse max (légèrement supérieure à la balle)
  ballSpeed: 540,
  ballRadius: 8,
  brickRows: 5,
  brickCols: 6,
  brickTopOffset: 70,
  brickPadding: 12,
  brickHeight: 22,
  sideMargin: 30,
  aimJitterDeg: 5,
  maxBalls: 2,
  launchCooldownMs: 500,
  brickDriftSpeed: 22, // pixels/sec, tapis roulant lent vers le bas mais plus rapide
  brickSpawnInterval: 1.55, // recalculé juste après CONFIG
  brickRowFillRate: 0.525, // 25% de briques en moins par rangée
  brickPauseChance: 0.25, // chance de ne rien spawner pour faire une pause
  bonusChance: 0.15,
  speedBonusChance: 0.12,
  bonusCooldownMs: 5000,
  speedBoostMultiplier: 1.05,
  ballSpeedCap: 1500
};

CONFIG.brickSpawnInterval = (CONFIG.brickHeight + CONFIG.brickPadding) / CONFIG.brickDriftSpeed;

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

const bonusState = {
  lastBonus: 0
};

const WALL = {
  width: 12
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
  const brickWidth = brickWidthBase * 0.25; // largeur encore divisée par deux
  const totalWidth = brickCols * brickWidth + brickPadding * (brickCols - 1);
  const startX = (CONFIG.width - totalWidth) / 2;
  return { brickWidth, startX };
}

function getWalls() {
  const { startX } = computeBrickLayout();
  const xLeft = startX / 2 - WALL.width / 2;
  const xRight = CONFIG.width - startX / 2 - WALL.width / 2;
  return [
    { x: xLeft, y: 0, w: WALL.width, h: CONFIG.height },
    { x: xRight, y: 0, w: WALL.width, h: CONFIG.height }
  ];
}

function getBrickHP() {
  const base = 1;
  const ramp = Math.floor(state.rowIndex / 8);
  return Math.min(base + ramp, 5);
}

function spawnBrickRow() {
  const { brickCols, brickPadding, brickHeight, brickTopOffset, brickRowFillRate, bonusChance, speedBonusChance } = CONFIG;
  const { brickWidth, startX } = computeBrickLayout();

  const bricks = [];
  let spawned = 0;
  const now = performance.now ? performance.now() : Date.now();
  const allowBonus = now - bonusState.lastBonus >= CONFIG.bonusCooldownMs;
  const hp = getBrickHP();
  for (let col = 0; col < brickCols; col += 1) {
    if (Math.random() > brickRowFillRate) continue;
    const x = startX + col * (brickWidth + brickPadding);
    const y = -brickHeight - brickTopOffset;
    const roll = Math.random();
    let type = 'normal';
    if (allowBonus && roll < bonusChance) {
      type = 'bonus';
    } else if (roll < bonusChance + speedBonusChance) {
      type = 'speed';
    }
    bricks.push({
      x,
      y,
      w: brickWidth,
      h: brickHeight,
      alive: true,
      row: state.rowIndex,
      type,
      hp,
      deathTime: null,
      flashTime: null
    });
    spawned += 1;
  }

  if (spawned === 0) {
    // Garantit au moins une brique.
    const col = Math.floor(Math.random() * brickCols);
    const x = startX + col * (brickWidth + brickPadding);
    const y = -brickHeight - brickTopOffset;
    const roll = Math.random();
    let type = 'normal';
    if (allowBonus && roll < bonusChance) {
      type = 'bonus';
    } else if (roll < bonusChance + speedBonusChance) {
      type = 'speed';
    }
    bricks.push({
      x,
      y,
      w: brickWidth,
      h: brickHeight,
      alive: true,
      row: state.rowIndex,
      type,
      hp,
      deathTime: null,
      flashTime: null
    });
  }

  state.rowIndex += 1;
  state.bricks.push(...bricks);
}

function spawnRewardBall(brick) {
  const targetX = state.paddle.x + state.paddle.w / 2;
  const targetY = state.paddle.y - state.paddle.h;
  const dx = targetX - (brick.x + brick.w / 2);
  const dy = targetY - (brick.y + brick.h / 2);
  const dist = Math.hypot(dx, dy) || 1;
  const speed = CONFIG.ballSpeed * 0.65;
  state.balls.push({
    x: brick.x + brick.w / 2,
    y: brick.y + brick.h / 2,
    r: CONFIG.ballRadius,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    returning: true,
    returnSpeed: speed,
    reward: true
  });
}

function applySpeedBoost() {
  CONFIG.ballSpeed = Math.min(CONFIG.ballSpeed * CONFIG.speedBoostMultiplier, CONFIG.ballSpeedCap);
  for (const b of state.balls) {
    b.vx = Math.max(Math.min(b.vx * CONFIG.speedBoostMultiplier, CONFIG.ballSpeedCap), -CONFIG.ballSpeedCap);
    b.vy = Math.max(Math.min(b.vy * CONFIG.speedBoostMultiplier, CONFIG.ballSpeedCap), -CONFIG.ballSpeedCap);
  }
}

function selectTargetBrick() {
  const dangerY = CONFIG.height * 0.72;
  const alive = state.bricks.filter((b) => b.alive);
  if (!alive.length) return null;

  const dangerous = alive.filter((b) => b.y + b.h >= dangerY);
  if (dangerous.length) return dangerous.sort((a, b) => b.y - a.y)[0];

  const bonus = alive.filter((b) => b.type === 'bonus');
  if (bonus.length) return bonus.sort((a, b) => b.y - a.y)[0];
  const speed = alive.filter((b) => b.type === 'speed');
  if (speed.length) return speed.sort((a, b) => b.y - a.y)[0];

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
        if (ball.reward) {
          state.ballCount = Math.min(CONFIG.maxBalls, state.ballCount + 1);
        } else {
          placeBallOnPaddle({ refill: true });
        }
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

    // Murs latéraux internes
    for (const wall of getWalls()) {
      const hitWall = (
        ball.x + ball.r >= wall.x &&
        ball.x - ball.r <= wall.x + wall.w &&
        ball.y + ball.r >= wall.y &&
        ball.y - ball.r <= wall.y + wall.h
      );
      if (hitWall) {
        if (ball.x < wall.x) {
          ball.x = wall.x - ball.r;
        } else if (ball.x > wall.x + wall.w) {
          ball.x = wall.x + wall.w + ball.r;
        }
        ball.vx *= -1;
      }
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
        const overlapLeft = ball.x + ball.r - brick.x;
        const overlapRight = brick.x + brick.w - (ball.x - ball.r);
        const overlapTop = ball.y + ball.r - brick.y;
        const overlapBottom = brick.y + brick.h - (ball.y - ball.r);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        const now = performance.now ? performance.now() : Date.now();
        const brickVisible = brick.y + brick.h > 0;
        if (!brickVisible) {
          brick.flashTime = now;
          // Rebond sans détruire
          if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            ball.vx *= -1;
          } else {
            ball.vy *= -1;
          }
          break;
        }

        brick.flashTime = now;
        brick.hp = Math.max(0, (brick.hp || 1) - 1);
        const destroyed = brick.hp <= 0;

        if (destroyed) {
          brick.alive = false;
          brick.deathTime = now;
          state.score += 50 + brick.row * 10;
          if (brick.type === 'bonus') {
            bonusState.lastBonus = brick.deathTime;
            spawnRewardBall(brick);
          } else if (brick.type === 'speed') {
            applySpeedBoost();
          }
        }

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
        ball.reward = false;
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

function renderWalls() {
  ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.lineWidth = 1.5;
  for (const wall of getWalls()) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }
}

function renderBricks() {
  for (const brick of state.bricks) {
    const baseHue = 200 + brick.row * 12;
    const now = performance.now ? performance.now() : Date.now();
    if (!brick.alive && !brick.deathTime) continue;
    let alpha = 1;
    let scale = 1;
    let explode = false;

    if (!brick.alive && brick.deathTime) {
      const t = Math.min((now - brick.deathTime) / 180, 1); // 180 ms
      alpha = 1 - t;
      scale = 1 + 0.3 * t;
      explode = true;
    }

    const drawX = brick.x - (scale - 1) * brick.w / 2;
    const drawY = brick.y - (scale - 1) * brick.h / 2;
    const drawW = brick.w * scale;
    const drawH = brick.h * scale;

    let flashAlpha = 0;
    if (brick.flashTime) {
      const f = Math.max(0, 1 - (now - brick.flashTime) / 200);
      if (f > 0) flashAlpha = 0.4 * f * (0.5 + 0.5 * Math.sin(now / 40));
      else brick.flashTime = null;
    }

    ctx.fillStyle = `hsla(${baseHue}, 70%, 60%, ${alpha})`;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.strokeStyle = `rgba(15, 23, 42, ${0.4 * alpha})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(drawX, drawY, drawW, drawH);
    if (flashAlpha > 0) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${flashAlpha})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX + 1, drawY + 1, drawW - 2, drawH - 2);
    }

    if (brick.type === 'bonus' || brick.type === 'speed') {
      const inset = 6 * scale;
      const innerX = drawX + inset;
      const innerY = drawY + inset;
      const innerW = drawW - inset * 2;
      const innerH = drawH - inset * 2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * alpha})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(innerX, innerY, innerW, innerH);

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      ctx.lineWidth = 2;
      const cx = drawX + drawW / 2;
      const cy = drawY + drawH / 2;
      const r = Math.min(innerW, innerH) * 0.18;
      if (brick.type === 'bonus') {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 1.5, cy);
        ctx.lineTo(cx + r * 1.5, cy);
        ctx.moveTo(cx, cy - r * 1.1);
        ctx.lineTo(cx, cy + r * 1.1);
        ctx.stroke();
      } else if (brick.type === 'speed') {
        ctx.beginPath();
        ctx.moveTo(cx - r * 1.6, cy + r * 0.9);
        ctx.lineTo(cx, cy - r);
        ctx.lineTo(cx + r * 1.6, cy + r * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy + r * 0.5);
        ctx.lineTo(cx + r * 0.6, cy + r * 0.5);
        ctx.stroke();
      }
    }

    if (brick.hp && alpha > 0) {
      const starCount = Math.min(Math.max(brick.hp, 1), 5);
      const starR = Math.min(drawW, drawH) * 0.12;
      const spacing = starR * 2.2;
      const total = spacing * (starCount - 1);
      const sy = drawY - starR * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      for (let i = 0; i < starCount; i += 1) {
        const sx = drawX + drawW / 2 - total / 2 + i * spacing;
        ctx.beginPath();
        for (let k = 0; k < 5; k += 1) {
          const angle = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
          const ox = sx + Math.cos(angle) * starR;
          const oy = sy + Math.sin(angle) * starR;
          ctx.lineTo(ox, oy);
          const angle2 = angle + Math.PI / 5;
          const ox2 = sx + Math.cos(angle2) * starR * 0.5;
          const oy2 = sy + Math.sin(angle2) * starR * 0.5;
          ctx.lineTo(ox2, oy2);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    if (explode && alpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.22 * alpha})`;
      ctx.beginPath();
      ctx.arc(drawX + drawW / 2, drawY + drawH / 2, Math.max(drawW, drawH) * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
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
  for (const ball of state.balls) {
    if (ball.returning) {
      const trailLength = 4;
      const trailAlpha = 0.2;
      for (let i = 1; i <= trailLength; i += 1) {
        const t = i / (trailLength + 1);
        const tx = ball.x - ball.vx * 0.01 * i;
        const ty = ball.y - ball.vy * 0.01 * i;
        ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha * (1 - t)})`;
        ctx.beginPath();
        ctx.arc(tx, ty, ball.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (ball.returning) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    } else {
      ctx.fillStyle = '#f472b6';
    }
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
  ctx.font = '18px "Segoe UI", sans-serif';
  ctx.fillText(`Score: ${state.score}`, 14, 24);
  ctx.fillText(state.autoPlay ? 'Auto: ON' : 'Auto: OFF', 14, 46);
  const totalOwned = state.ballCount + state.balls.length + (state.ballHeld ? 1 : 0);
  ctx.fillText(`Balles: ${state.ballCount}/${totalOwned}`, 14, 68);
  ctx.fillText(`Vitesse: ${Math.round(CONFIG.ballSpeed)} px/s`, 14, 90);
  ctx.fillText(`Cadence: ${(1000 / CONFIG.launchCooldownMs).toFixed(1)} /s`, 14, 112);
  ctx.fillText(`Vies: ${state.lives}`, CONFIG.width - 80, 24);

  if (!state.running) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '26px "Segoe UI", sans-serif';
    ctx.fillText('Partie terminée - Appuyez sur Entrée pour rejouer', 110, CONFIG.height / 2);
  }
}

function render() {
  renderBackground();
  renderWalls();
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
