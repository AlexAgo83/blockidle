const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const CONFIG = {
  width: 800,
  height: 600,
  paddleWidth: 120,
  paddleHeight: 16,
  paddleSpeed: 460,
  ballSpeed: 360,
  ballRadius: 8,
  brickRows: 5,
  brickCols: 10,
  brickTopOffset: 70,
  brickPadding: 8,
  brickHeight: 22,
  sideMargin: 30
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
  ball: {
    x: 0,
    y: 0,
    r: CONFIG.ballRadius,
    vx: 0,
    vy: 0
  },
  bricks: [],
  score: 0,
  lives: 3,
  running: true
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resizeCanvas() {
  canvas.width = CONFIG.width;
  canvas.height = CONFIG.height;
}

function buildBricks() {
  const { brickCols, brickRows, brickPadding, sideMargin, brickTopOffset, brickHeight } = CONFIG;
  const availableWidth = CONFIG.width - sideMargin * 2 - brickPadding * (brickCols - 1);
  const brickWidth = availableWidth / brickCols;

  const bricks = [];
  for (let row = 0; row < brickRows; row += 1) {
    for (let col = 0; col < brickCols; col += 1) {
      const x = sideMargin + col * (brickWidth + brickPadding);
      const y = brickTopOffset + row * (brickHeight + brickPadding);
      bricks.push({ x, y, w: brickWidth, h: brickHeight, alive: true, row });
    }
  }
  return bricks;
}

function resetBallAndPaddle() {
  const { paddle, ball } = state;
  paddle.w = CONFIG.paddleWidth;
  paddle.h = CONFIG.paddleHeight;
  paddle.x = (CONFIG.width - paddle.w) / 2;
  paddle.y = CONFIG.height - 60;

  ball.x = paddle.x + paddle.w / 2;
  ball.y = paddle.y - ball.r - 2;

  // Lance la balle avec un angle initial léger.
  const angle = (Math.random() * 0.5 + 0.25) * Math.PI; // entre 45° et 135°
  const direction = Math.random() > 0.5 ? 1 : -1;
  ball.vx = Math.cos(angle) * CONFIG.ballSpeed * direction;
  ball.vy = -Math.abs(Math.sin(angle) * CONFIG.ballSpeed);
}

function resetGame() {
  state.score = 0;
  state.lives = 3;
  state.bricks = buildBricks();
  resetBallAndPaddle();
}

function update(dt) {
  if (!state.running) return;
  const { paddle, ball, keys } = state;

  // Mouvement du paddle
  if (keys.left) {
    paddle.x -= CONFIG.paddleSpeed * dt;
  }
  if (keys.right) {
    paddle.x += CONFIG.paddleSpeed * dt;
  }
  paddle.x = clamp(paddle.x, 0, CONFIG.width - paddle.w);

  // Mouvement de la balle
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

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
  const hitPaddle = (
    ball.y + ball.r >= paddle.y &&
    ball.y - ball.r <= paddle.y + paddle.h &&
    ball.x >= paddle.x - ball.r &&
    ball.x <= paddle.x + paddle.w + ball.r &&
    ball.vy > 0
  );

  if (hitPaddle) {
    ball.y = paddle.y - ball.r;
    ball.vy *= -1;

    // Ajuste l'angle selon le point d'impact.
    const hitPos = (ball.x - paddle.x) / paddle.w; // 0 -> 1
    const offset = (hitPos - 0.5) * 2; // -1 -> 1
    const maxAngle = (70 * Math.PI) / 180;
    const angle = offset * maxAngle;
    const speed = Math.hypot(ball.vx, ball.vy);
    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.cos(angle) * speed;
  }

  // Briques
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    const withinX = ball.x + ball.r >= brick.x && ball.x - ball.r <= brick.x + brick.w;
    const withinY = ball.y + ball.r >= brick.y && ball.y - ball.r <= brick.y + brick.h;

    if (withinX && withinY) {
      brick.alive = false;
      state.score += 50 + brick.row * 10;

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

  // Balle perdue
  if (ball.y - ball.r > CONFIG.height) {
    state.lives -= 1;
    if (state.lives <= 0) {
      state.running = false;
    } else {
      resetBallAndPaddle();
    }
  }

  // Niveau terminé
  if (state.bricks.every((b) => !b.alive)) {
    state.bricks = buildBricks();
    resetBallAndPaddle();
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
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
  }
}

function renderPaddle() {
  const { paddle } = state;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

function renderBall() {
  const { ball } = state;
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function renderHUD() {
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillText(`Score: ${state.score}`, 14, 24);
  ctx.fillText(`Vies: ${state.lives}`, CONFIG.width - 80, 24);

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
  renderBall();
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
}

function init() {
  resizeCanvas();
  bindControls();
  resetGame();
  requestAnimationFrame(loop);
}

init();
