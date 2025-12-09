const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = document.getElementById('aim-toggle');
const autoFireToggle = document.getElementById('autofire-toggle');
const powerModalBackdrop = document.getElementById('power-modal-backdrop');
const powerButtons = Array.from(document.querySelectorAll('.power-btn'));

const POWER_DEFS = [
  { name: 'Boule de feu', maxLevel: 3 },
  { name: 'Glace', maxLevel: 3 },
  { name: 'Poison', maxLevel: 3 },
  { name: 'Metal', maxLevel: 3 },
  { name: 'Vampire', maxLevel: 3 },
  { name: 'Lumière', maxLevel: 3 },
  { name: 'Epine', maxLevel: 3 },
  { name: 'Malediction', maxLevel: 3 }
];

const CONFIG = {
  width: 1600,
  height: 1200,
  paddleWidth: 80,
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
  maxBalls: 10,
  launchCooldownMs: 500,
  brickDriftSpeed: 22, // pixels/sec, tapis roulant lent vers le bas mais plus rapide
  brickSpawnInterval: 1.55, // recalculé juste après CONFIG
  brickRowFillRate: 0.525, // 25% de briques en moins par rangée
  brickPauseChance: 0.25, // chance de ne rien spawner pour faire une pause
  bonusChance: 0.15,
  speedBonusChance: 0.12,
  bonusCooldownMs: 5000,
  speedBoostMultiplier: 1.05,
  ballSpeedCap: 1500,
  speedIncreaseInterval: 30,
  speedIncreaseMultiplier: 1.05,
  xpSpeed: 1200,
  xpSize: 7,
  maxLives: 20,
  startLives: 10
};

const BASE_BALL_SPEED = CONFIG.ballSpeed;

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
  lives: CONFIG.startLives,
  running: true,
  autoPlay: true,
  showAim: false,
  ballHeld: true,
  autoFire: true,
  ballCount: 1,
  lastLaunch: 0,
  spawnTimer: 0,
  rowIndex: 0,
  brickSpeed: CONFIG.brickDriftSpeed,
  speedTimer: 0,
  level: 1,
  playerLevel: 1,
  xp: 0,
  xpNeeded: 10,
  xpDrops: [],
  paused: false,
  powers: [],
  specialPocket: [],
  pendingPowerChoices: 0,
  powerModalOpen: false,
  currentPowerOptions: []
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

function getPowerDef(name) {
  return POWER_DEFS.find((p) => p.name === name) || { name, maxLevel: 1 };
}

function getPowerLevel(name) {
  const existing = state.powers.find((p) => p.name === name);
  return existing ? existing.level : 0;
}

function canUpgradePower(name) {
  const def = getPowerDef(name);
  return getPowerLevel(name) < def.maxLevel;
}

function nextPowerLevel(name) {
  const def = getPowerDef(name);
  return Math.min(getPowerLevel(name) + 1, def.maxLevel);
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

function xpForLevel(level) {
  return 10 + (level - 1) * 5;
}

function gainXp(amount) {
  state.xp += amount;
  let leveled = false;
  while (state.xp >= state.xpNeeded) {
    state.xp -= state.xpNeeded;
    state.playerLevel += 1;
    state.xpNeeded = xpForLevel(state.playerLevel);
    state.pendingPowerChoices += 1;
    leveled = true;
  }
  if (leveled) {
    tryOpenPowerModal();
  }
}

function tryOpenPowerModal() {
  if (state.powerModalOpen || state.pendingPowerChoices <= 0) return;
  const available = POWER_DEFS.map((p) => p.name).filter((name) => canUpgradePower(name));
  if (!available.length) {
    state.pendingPowerChoices = 0;
    state.paused = false;
    return;
  }
  const options = sampleOptions(available, 4);
  state.currentPowerOptions = options;
  renderPowerModal(options);
  state.paused = true;
  state.powerModalOpen = true;
  powerModalBackdrop.classList.add('open');
}

function handlePowerSelect(powerName) {
  const def = getPowerDef(powerName);
  const existing = state.powers.find((p) => p.name === powerName);
  if (existing) {
    if (existing.level >= def.maxLevel) {
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
      state.powerModalOpen = false;
      powerModalBackdrop.classList.remove('open');
      state.paused = state.pendingPowerChoices > 0;
      if (state.paused) tryOpenPowerModal();
      return;
    }
    existing.level = Math.min(existing.level + 1, def.maxLevel);
  } else {
    state.powers.push({ name: powerName, level: 1 });
  }
  state.specialPocket.push(powerName);
  state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  powerModalBackdrop.classList.remove('open');
  state.powerModalOpen = false;
  if (state.pendingPowerChoices > 0) {
    tryOpenPowerModal();
  } else {
    state.paused = false;
  }
}

function renderPowerModal(options) {
  powerButtons.forEach((btn, idx) => {
    const power = options[idx];
    if (power) {
      btn.style.display = 'block';
      const nextLv = nextPowerLevel(power);
      btn.textContent = `${power} (Lv. ${nextLv})`;
      btn.dataset.power = power;
    } else {
      btn.style.display = 'none';
    }
  });
}

function sampleOptions(list, count) {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
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
      hue: 200 + state.rowIndex * 12, // couleur figée à la création
      alive: true,
      row: state.rowIndex,
      type,
      hp,
      deathTime: null,
      flashTime: null,
      slowUntil: 0,
      poisonNextTick: 0,
      poisonActive: false
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
      hue: 200 + state.rowIndex * 12, // couleur figée à la création
      alive: true,
      row: state.rowIndex,
      type,
      hp,
      deathTime: null,
      flashTime: null,
      slowUntil: 0,
      poisonNextTick: 0,
      poisonActive: false
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

function spawnXpDrop(brick) {
  const targetX = state.paddle.x + state.paddle.w / 2;
  const targetY = state.paddle.y - state.paddle.h;
  const dx = targetX - (brick.x + brick.w / 2);
  const dy = targetY - (brick.y + brick.h / 2);
  const dist = Math.hypot(dx, dy) || 1;
  const speed = 800;
  state.xpDrops.push({
    x: brick.x + brick.w / 2,
    y: brick.y + brick.h / 2,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    size: CONFIG.xpSize
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
  heldBall.specialPower = null;
  state.ballHeld = true;
  if (refill) {
    state.ballCount = Math.min(CONFIG.maxBalls, state.ballCount + 1);
  }
}

function launchBall() {
  if (!state.ballHeld) return;
  const available = state.ballCount + state.specialPocket.length;
  if (available <= 0) return;
  const now = performance.now ? performance.now() : Date.now();
  if (now - state.lastLaunch < CONFIG.launchCooldownMs) return;
  state.ballHeld = false;
  state.lastLaunch = now;
  let specialPower = null;
  if (state.specialPocket.length > 0) {
    // Priorité aux balles spéciales
    specialPower = state.specialPocket.shift();
  } else {
    state.ballCount -= 1;
  }
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
    returning: false,
    specialPower
  });
}

function resetGame() {
  state.score = 0;
  state.lives = CONFIG.startLives;
  state.bricks = [];
  state.rowIndex = 0;
  state.spawnTimer = 0;
  state.brickSpeed = CONFIG.brickDriftSpeed;
  state.speedTimer = 0;
  state.level = 1;
  state.playerLevel = 1;
  state.xp = 0;
  state.xpNeeded = xpForLevel(1);
  state.ballCount = 1;
  state.balls = [];
  state.lastLaunch = 0;
  CONFIG.ballSpeed = BASE_BALL_SPEED;
  bonusState.lastBonus = 0;
  state.paused = false;
  state.powers = [];
  state.specialPocket = [];
  state.pendingPowerChoices = 0;
  state.powerModalOpen = false;
  state.currentPowerOptions = [];
  powerModalBackdrop.classList.remove('open');
  placeBallOnPaddle({ centerPaddle: true });
  spawnBrickRow();
}

function update(dt) {
  if (!state.running || state.paused) return;
  const now = performance.now ? performance.now() : Date.now();
  const { paddle, heldBall, keys } = state;
  const speedInterval = CONFIG.speedIncreaseInterval;
  state.speedTimer += dt;
  while (state.speedTimer >= speedInterval) {
    state.speedTimer -= speedInterval;
    state.brickSpeed *= CONFIG.speedIncreaseMultiplier;
    state.level += 1;
  }

  if (!state.ballHeld && (state.ballCount > 0 || state.specialPocket.length > 0)) {
    placeBallOnPaddle();
  }

  // Génération continue de briques façon rail infini.
  state.spawnTimer += dt;
  const spawnInterval = (CONFIG.brickHeight + CONFIG.brickPadding) / state.brickSpeed;
  while (state.spawnTimer >= spawnInterval) {
    state.spawnTimer -= spawnInterval;
    if (Math.random() >= CONFIG.brickPauseChance) {
      spawnBrickRow();
    }
  }

  // Descente lente des briques façon tapis roulant.
  for (const brick of state.bricks) {
    if (brick.alive) {
      brick.prevY = brick.y;
      const slowFactor = brick.slowUntil && brick.slowUntil > now ? 0.5 : 1;
      brick.y += state.brickSpeed * slowFactor * dt;
    }
  }

  // Collisions entre briques (empêche le chevauchement). Si l'une est gelée, elle est immobile.
  const isFrozen = (b) => b.alive && b.slowUntil && b.slowUntil > now;
  const separateAbove = (upper, lower) => {
    upper.y = Math.min(upper.y, lower.y - upper.h - 0.01);
  };
  // Plusieurs passes pour propager le blocage en colonne
  for (let pass = 0; pass < 4; pass += 1) {
    let moved = false;
    for (let i = 0; i < state.bricks.length; i += 1) {
      const a = state.bricks[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < state.bricks.length; j += 1) {
        const b = state.bricks[j];
        if (!b.alive) continue;
        const overlapX = a.x < b.x + b.w && a.x + a.w > b.x;
        const overlapY = a.y < b.y + b.h && a.y + a.h > b.y;
        if (!overlapX || !overlapY) continue;

        const aFrozen = isFrozen(a);
        const bFrozen = isFrozen(b);
        const aWasAbove = (a.prevY ?? a.y) + a.h <= (b.prevY ?? b.y) + b.h;

        if (aFrozen && !bFrozen) {
          separateAbove(b, a); // ne bouge pas la brique gelée
          moved = true;
        } else if (bFrozen && !aFrozen) {
          separateAbove(a, b); // ne bouge pas la brique gelée
          moved = true;
        } else if (!aFrozen && !bFrozen) {
          if (aWasAbove) separateAbove(b, a);
          else separateAbove(a, b);
          moved = true;
        }
      }
    }
    if (!moved) break;
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
  const deathTTL = 240; // ms de rémanence pour l'animation d'explosion
  state.bricks = state.bricks.filter((b) => {
    if (b.alive) return b.y < CONFIG.height + 120;
    if (b.deathTime) return now - b.deathTime < deathTTL;
    return false;
  });

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

  // Mouvement des drops d'XP
  for (let i = state.xpDrops.length - 1; i >= 0; i -= 1) {
    const drop = state.xpDrops[i];
    drop.x += drop.vx * dt;
    drop.y += drop.vy * dt;
    const targetX = paddle.x + paddle.w / 2;
    const targetY = paddle.y - paddle.h / 2;
    const dx = targetX - drop.x;
    const dy = targetY - drop.y;
    const dist = Math.hypot(dx, dy);
    if (dist < drop.size + 6) {
      state.xpDrops.splice(i, 1);
      gainXp(1);
      continue;
    }
    if (dist > 0.001) {
      const speed = CONFIG.xpSpeed;
      const scale = speed / dist;
      drop.vx = dx * scale;
      drop.vy = dy * scale;
    }
  }

  // Tick poison sur les briques
  for (const brick of state.bricks) {
    if (!brick.alive || !brick.poisonActive) continue;
    if (brick.poisonNextTick && brick.poisonNextTick <= now) {
      brick.poisonNextTick = now + 5000;
      damageBrick(brick, 1, now);
    }
  }

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
          if (!state.ballHeld) placeBallOnPaddle();
        } else if (ball.specialPower) {
          state.specialPocket.push(ball.specialPower);
          placeBallOnPaddle();
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

        const damage = ball.specialPower === 'Metal' ? 2 : 1;
        applyPowerOnHit(ball, brick, now);
        damageBrick(brick, damage, now);
        applyFireSplash(ball, brick, now, damage);

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
  const timeNow = performance.now ? performance.now() : Date.now();
  const hueShift = (timeNow / 50) % 360; // variation progressive des teintes
  for (const brick of state.bricks) {
    const baseHue = ((brick.hue ?? (200 + brick.row * 12)) + hueShift) % 360;
    const now = timeNow;
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

function renderXpDrops() {
  ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
  for (const drop of state.xpDrops) {
    ctx.fillRect(drop.x - drop.size / 2, drop.y - drop.size / 2, drop.size, drop.size);
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
      if (ball.specialPower === 'Boule de feu') {
        const blink = (Math.sin(performance.now() / 80) + 1) / 2; // plus rapide
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha.toFixed(2)})`; // jaune doré
      } else if (ball.specialPower === 'Glace') {
        const blink = (Math.sin(performance.now() / 90) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha.toFixed(2)})`; // bleu lumineux animé
      } else if (ball.specialPower === 'Poison') {
        const blink = (Math.sin(performance.now() / 85) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(52, 211, 153, ${alpha.toFixed(2)})`; // vert poison animé
      } else if (ball.specialPower === 'Metal') {
        const blink = (Math.sin(performance.now() / 95) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(2)})`; // gris clair animé
      } else if (ball.specialPower === 'Vampire') {
        const blink = (Math.sin(performance.now() / 85) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha.toFixed(2)})`; // rouge vif animé
      } else if (ball.specialPower === 'Lumière') {
        const blink = (Math.sin(performance.now() / 80) + 1) / 2;
        const alpha = 0.3 + 0.7 * blink;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`; // blanc pulsé
      } else if (ball.specialPower === 'Epine') {
        const blink = (Math.sin(performance.now() / 100) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(120, 72, 48, ${alpha.toFixed(2)})`; // marron pulsé
      } else if (ball.specialPower === 'Malediction') {
        const blink = (Math.sin(performance.now() / 90) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha.toFixed(2)})`; // violet pulsé
      } else {
        ctx.fillStyle = '#f472b6';
      }
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
  const availableBalls = state.ballCount + state.specialPocket.length + (state.ballHeld ? 1 : 0);
  const totalBalls = availableBalls + state.balls.length;
  ctx.fillText(`Balles: ${availableBalls}/${totalBalls}`, 14, 68);
  ctx.fillText(`Vitesse: ${Math.round(CONFIG.ballSpeed)} px/s`, 14, 90);
  ctx.fillText(`Cadence: ${(1000 / CONFIG.launchCooldownMs).toFixed(1)} /s`, 14, 112);
  ctx.fillText(`Briques: ${state.brickSpeed.toFixed(1)} px/s`, 14, 134);
  ctx.fillText(`Vies: ${state.lives}/${CONFIG.maxLives}`, CONFIG.width - 110, 24);

  // Barre de progression pour l'évolution de vitesse.
  const interval = CONFIG.speedIncreaseInterval;
  const progress = Math.min(state.speedTimer / interval, 1);
  const barW = 180;
  const barH = 8;
  const barX = CONFIG.width - barW - 20;
  const barY = 40;
  ctx.fillText(`Stage: ${state.level}`, barX, barY - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Barre de progression XP / Level joueur.
  const xpBarW = 180;
  const xpBarH = 8;
  const xpBarX = CONFIG.width - xpBarW - 20;
  const xpBarY = barY + 36;
  const xpProgress = Math.min(state.xp / state.xpNeeded, 1);
  ctx.fillText(`Level ${state.playerLevel}`, xpBarX, xpBarY - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(xpBarX, xpBarY, xpBarW, xpBarH);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(xpBarX, xpBarY, xpBarW * xpProgress, xpBarH);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(xpBarX, xpBarY, xpBarW, xpBarH);
  ctx.fillText(`${Math.floor(state.xp)}/${state.xpNeeded}`, xpBarX + xpBarW - 70, xpBarY - 8);

  // Liste des pouvoirs acquis (à droite, sous les infos).
  ctx.fillText('Pouvoirs:', xpBarX, xpBarY + 28);
  const powerLines = state.powers.slice(-5); // affiche les 5 derniers
  powerLines.forEach((p, idx) => {
    ctx.fillText(`- ${p.name} (Lv. ${p.level})`, xpBarX, xpBarY + 48 + idx * 18);
  });

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
  renderXpDrops();
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
  powerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.power || btn.textContent.trim();
      handlePowerSelect(name);
    });
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
function applyPowerOnHit(ball, brick, now) {
  if (!brick.alive) return;
  const power = ball.specialPower;
  if (power === 'Glace') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 5000);
  } else if (power === 'Poison') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 5000;
  }
}

function damageBrick(brick, amount, now) {
  brick.flashTime = now;
  brick.hp = Math.max(0, (brick.hp || 1) - amount);
  const destroyed = brick.hp <= 0;
  if (destroyed) {
    brick.alive = false;
    brick.deathTime = now;
    state.score += 50 + brick.row * 10;
    spawnXpDrop(brick);
    if (brick.type === 'bonus') {
      bonusState.lastBonus = brick.deathTime;
      spawnRewardBall(brick);
    } else if (brick.type === 'speed') {
      applySpeedBoost();
    }
  }
  return destroyed;
}

function applyFireSplash(ball, hitBrick, now, baseDamage) {
  if (ball.specialPower !== 'Boule de feu') return;
  const radius = Math.max(hitBrick.w, hitBrick.h) * 1.2;
  const cx = hitBrick.x + hitBrick.w / 2;
  const cy = hitBrick.y + hitBrick.h / 2;
  for (const b of state.bricks) {
    if (!b.alive || b === hitBrick) continue;
    const bx = b.x + b.w / 2;
    const by = b.y + b.h / 2;
    const dist = Math.hypot(bx - cx, by - cy);
    if (dist <= radius) {
      applyPowerOnHit(ball, b, now);
      damageBrick(b, baseDamage, now);
    }
  }
}
