import buildInfo from './build-info.json';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = document.getElementById('aim-toggle');
const autoFireToggle = null;
const powerModalBackdrop = document.getElementById('power-modal-backdrop');
const powerButtons = Array.from(document.querySelectorAll('.power-btn'));
const talentButtons = Array.from(document.querySelectorAll('.talent-btn'));
const powerPreviewName = document.getElementById('power-preview-name');
const powerPreviewDesc = document.getElementById('power-preview-desc');
const powerPreviewIcon = document.getElementById('power-preview-icon');
const nameModalBackdrop = document.getElementById('name-modal-backdrop');
const playerNameInput = document.getElementById('player-name-input');
const playerNameSubmit = document.getElementById('player-name-submit');
const commitListEl = document.getElementById('commit-list');
const timeButtons = Array.from(document.querySelectorAll('.time-btn'));

const API_BASE = (() => {
  const envBase = (import.meta?.env?.VITE_API_BASE || '').trim();
  if (envBase) return envBase.replace(/\/$/, '');
  const host = window.location.hostname || '';
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'https://blockidle-backend.onrender.com';
  }
  if (host === 'block-idle.onrender.com') {
    return 'https://blockidle-backend.onrender.com';
  }
  return (window.location.origin || '').replace(/\/$/, '');
})();

function apiUrl(path) {
  if (!path.startsWith('/')) return `${API_BASE}/${path}`;
  return `${API_BASE}${path}`;
}

const POWER_DEFS = [
  { name: 'Feu', maxLevel: 3 },
  { name: 'Glace', maxLevel: 3 },
  { name: 'Poison', maxLevel: 3 },
  { name: 'Metal', maxLevel: 3 },
  { name: 'Vampire', maxLevel: 3 },
  { name: 'Lumière', maxLevel: 3 },
  { name: 'Epine', maxLevel: 3 },
  { name: 'Malediction', maxLevel: 3 }
];

const TALENT_DEFS = [
  { name: 'Bottes', maxLevel: 3 },
  { name: 'Plume', maxLevel: 3 },
  { name: 'Gants', maxLevel: 3 },
  { name: 'Raquette', maxLevel: 3 },
  { name: 'Miroir', maxLevel: 2 },
  { name: 'Endurance', maxLevel: 3 }
];

const CONFIG = {
  width: 1600,
  height: 1200,
  paddleWidth: 80,
  paddleHeight: 16,
  paddleSpeed: 600,
  paddleMaxSpeed: 600, // vitesse max (légèrement supérieure à la balle)
  ballSpeed: 540,
  ballRadius: 8, // rayon des spéciales
  brickRows: 5,
  brickCols: 6,
  brickTopOffset: 70,
  brickPadding: 12,
  brickHeight: 22,
  sideMargin: 30,
  aimJitterDeg: 5,
  maxBalls: 3, // limite historique, alignée sur maxNormalBalls
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
  maxLives: 10,
  startLives: 10,
  maxNormalBalls: 3,
  specialShotCooldownMs: 250, // 4 tirs/s pour les spéciales
  normalShotCooldownMs: 500, // 2 tirs/s pour les normales
  standardBallSpeedMultiplier: 0.75,
  standardBallRadiusMultiplier: 0.75
};

const BASE_BALL_SPEED = CONFIG.ballSpeed;

CONFIG.brickSpawnInterval = (CONFIG.brickHeight + CONFIG.brickPadding) / CONFIG.brickDriftSpeed;

const SESSION_KEY = 'brickidle_session';
const SESSION_VERSION = 1;
const SESSION_SAVE_INTERVAL = 1500;
let lastSessionSave = -SESSION_SAVE_INTERVAL;
let sessionDirty = true;

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
    r: getBallRadius(false),
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
  aimPos: null,
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
  talents: [],
  specialPocket: [],
  playerName: '',
  backendTopScores: [],
  submittingScore: false,
  gameOverHandled: false,
  lastEndedAt: null,
  awaitingName: false,
  scoreSubmitted: false,
  timeScale: 1,
  pendingPowerChoices: 0,
  powerModalOpen: false,
  currentPowerOptions: [],
  currentTalentOptions: [],
  lastHitSpecial: null,
  lastVampireHeal: 0,
  lastBossLevelSpawned: 0,
  damageByPower: {}
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

function formatScore(value) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString('fr-FR');
}

function safeNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function safeBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeLevelEntries(entries, getDef) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => ({ name: entry?.name, level: safeNumber(entry?.level, 0) }))
    .filter((entry) => typeof entry.name === 'string' && getDef(entry.name))
    .map((entry) => {
      const def = getDef(entry.name);
      return { name: entry.name, level: clamp(entry.level, 0, def.maxLevel) };
    });
}

function normalizeBall(ball, defaults = {}) {
  if (!ball) return null;
  return {
    x: safeNumber(ball.x, defaults.x ?? 0),
    y: safeNumber(ball.y, defaults.y ?? 0),
    r: safeNumber(ball.r, defaults.r ?? getBallRadius(Boolean(ball.specialPower))),
    vx: safeNumber(ball.vx, defaults.vx ?? 0),
    vy: safeNumber(ball.vy, defaults.vy ?? 0),
    returning: safeBoolean(ball.returning, false),
    returnSpeed: safeNumber(ball.returnSpeed, defaults.returnSpeed ?? null),
    reward: safeBoolean(ball.reward, false),
    specialPower: typeof ball.specialPower === 'string' ? ball.specialPower : null
  };
}

function normalizeBrick(brick) {
  if (!brick) return null;
  return {
    x: safeNumber(brick.x, 0),
    y: safeNumber(brick.y, 0),
    w: safeNumber(brick.w, CONFIG.brickHeight),
    h: safeNumber(brick.h, CONFIG.brickHeight),
    hue: safeNumber(brick.hue, 0),
    alive: safeBoolean(brick.alive, true),
    row: safeNumber(brick.row, 0),
    type: ['normal', 'bonus', 'speed', 'boss'].includes(brick.type) ? brick.type : 'normal',
    hp: safeNumber(brick.hp, 1),
    deathTime: safeNumber(brick.deathTime, null),
    flashTime: safeNumber(brick.flashTime, null),
    slowUntil: safeNumber(brick.slowUntil, 0),
    freezeUntil: safeNumber(brick.freezeUntil, 0),
    poisonNextTick: safeNumber(brick.poisonNextTick, 0),
    poisonActive: safeBoolean(brick.poisonActive, false),
    thornNextTick: safeNumber(brick.thornNextTick, 0),
    thornActive: safeBoolean(brick.thornActive, false),
    thornExpire: safeNumber(brick.thornExpire, 0),
    curseTick: safeNumber(brick.curseTick, null),
    effectColor: brick.effectColor || null,
    effectUntil: safeNumber(brick.effectUntil, 0)
  };
}

function normalizeDrop(drop) {
  if (!drop) return null;
  return {
    x: safeNumber(drop.x, 0),
    y: safeNumber(drop.y, 0),
    vx: safeNumber(drop.vx, 0),
    vy: safeNumber(drop.vy, 0),
    size: safeNumber(drop.size, CONFIG.xpSize)
  };
}

function normalizeRect(target, defaults) {
  return {
    x: safeNumber(target?.x, defaults?.x ?? 0),
    y: safeNumber(target?.y, defaults?.y ?? 0),
    w: safeNumber(target?.w, defaults?.w ?? 0),
    h: safeNumber(target?.h, defaults?.h ?? 0)
  };
}

function loadPlayerName() {
  try {
    const saved = localStorage.getItem('brickidle_player_name');
    if (saved && typeof saved === 'string') {
      state.playerName = saved;
      if (playerNameInput) playerNameInput.value = saved;
      return saved;
    }
  } catch (_) {
    // ignore storage errors
  }
  return null;
}

function markSessionDirty() {
  sessionDirty = true;
}

function getSessionSnapshot() {
  return {
    version: SESSION_VERSION,
    savedAt: Date.now(),
    state: {
      score: state.score,
      lives: state.lives,
      running: state.running,
      autoPlay: state.autoPlay,
      showAim: state.showAim,
      autoFire: state.autoFire,
      ballHeld: state.ballHeld,
      ballCount: state.ballCount,
      lastLaunch: state.lastLaunch,
      spawnTimer: state.spawnTimer,
      rowIndex: state.rowIndex,
      brickSpeed: state.brickSpeed,
      speedTimer: state.speedTimer,
      level: state.level,
      playerLevel: state.playerLevel,
      xp: state.xp,
      xpNeeded: state.xpNeeded,
      xpDrops: state.xpDrops,
      paused: state.paused,
      powers: state.powers,
      talents: state.talents,
      specialPocket: state.specialPocket,
      timeScale: state.timeScale,
      pendingPowerChoices: state.pendingPowerChoices,
      lastHitSpecial: state.lastHitSpecial,
      lastVampireHeal: state.lastVampireHeal,
      lastBossLevelSpawned: state.lastBossLevelSpawned,
      damageByPower: state.damageByPower,
      heldBall: state.heldBall,
      paddle: state.paddle,
      balls: state.balls,
      bricks: state.bricks,
      bonus: { lastBonus: bonusState.lastBonus },
      configBallSpeed: CONFIG.ballSpeed,
      gameOverHandled: state.gameOverHandled,
      lastEndedAt: state.lastEndedAt,
      scoreSubmitted: state.scoreSubmitted,
      awaitingName: state.awaitingName,
      playerName: state.playerName,
      backendTopScores: state.backendTopScores
    }
  };
}

function saveSession() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(getSessionSnapshot()));
  } catch (_) {
    // ignore storage errors
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (_) {
    // ignore
  }
}

function loadSession() {
  let raw = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch (_) {
    return false;
  }
  if (!raw) return false;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    clearSession();
    return false;
  }

  if (!parsed || parsed.version !== SESSION_VERSION || !parsed.state) return false;

  const data = parsed.state;
  state.playerName = typeof data.playerName === 'string' ? data.playerName.slice(0, 32) : state.playerName;
  if (playerNameInput && state.playerName) playerNameInput.value = state.playerName;

  state.score = safeNumber(data.score, 0);
  state.lives = safeNumber(data.lives, CONFIG.startLives);
  state.running = data.running !== false;
  state.autoPlay = safeBoolean(data.autoPlay, true);
  state.showAim = safeBoolean(data.showAim, false);
  state.autoFire = safeBoolean(data.autoFire, true);
  state.ballHeld = safeBoolean(data.ballHeld, true);
  state.ballCount = safeNumber(data.ballCount, 1);
  state.lastLaunch = safeNumber(data.lastLaunch, 0);
  state.spawnTimer = safeNumber(data.spawnTimer, 0);
  state.rowIndex = safeNumber(data.rowIndex, 0);
  state.brickSpeed = safeNumber(data.brickSpeed, CONFIG.brickDriftSpeed);
  state.speedTimer = safeNumber(data.speedTimer, 0);
  state.level = safeNumber(data.level, 1);
  state.playerLevel = safeNumber(data.playerLevel, 1);
  state.xp = safeNumber(data.xp, 0);
  state.xpNeeded = xpForLevel(state.playerLevel);
  state.xpDrops = Array.isArray(data.xpDrops)
    ? data.xpDrops.map((drop) => normalizeDrop(drop)).filter(Boolean)
    : [];
  state.paused = safeBoolean(data.paused, false);
  state.powers = normalizeLevelEntries(data.powers, getPowerDef);
  state.talents = normalizeLevelEntries(data.talents, getTalentDef);
  state.specialPocket = Array.isArray(data.specialPocket) ? data.specialPocket.slice(0, CONFIG.maxBalls) : [];
  state.timeScale = safeNumber(data.timeScale, 1) || 1;
  state.pendingPowerChoices = safeNumber(data.pendingPowerChoices, 0);
  state.lastHitSpecial = typeof data.lastHitSpecial === 'string' ? data.lastHitSpecial : null;
  state.lastVampireHeal = safeNumber(data.lastVampireHeal, 0);
  state.lastBossLevelSpawned = safeNumber(data.lastBossLevelSpawned, 0);
  state.damageByPower = data.damageByPower && typeof data.damageByPower === 'object' ? { ...data.damageByPower } : {};
  state.heldBall = normalizeBall(data.heldBall, state.heldBall) || state.heldBall;
  state.paddle = normalizeRect(data.paddle, state.paddle);
  state.balls = Array.isArray(data.balls)
    ? data.balls.map((b) => normalizeBall(b)).filter(Boolean)
    : [];
  state.bricks = Array.isArray(data.bricks)
    ? data.bricks.map((b) => normalizeBrick(b)).filter(Boolean)
    : [];
  bonusState.lastBonus = safeNumber(data.bonus?.lastBonus, 0);
  CONFIG.ballSpeed = safeNumber(data.configBallSpeed, BASE_BALL_SPEED) || BASE_BALL_SPEED;
  state.gameOverHandled = safeBoolean(data.gameOverHandled, false);
  state.lastEndedAt = data.lastEndedAt || null;
  state.scoreSubmitted = safeBoolean(data.scoreSubmitted, false);
  state.awaitingName = safeBoolean(data.awaitingName, false);
  state.backendTopScores = Array.isArray(data.backendTopScores) ? data.backendTopScores : [];

  state.currentPowerOptions = [];
  state.currentTalentOptions = [];
  state.powerModalOpen = false;
  powerModalBackdrop.classList.remove('open');
  setTimeScale(state.timeScale);
  state.keys.left = false;
  state.keys.right = false;
  markSessionDirty();
  lastSessionSave = -SESSION_SAVE_INTERVAL;
  if (state.pendingPowerChoices > 0) {
    state.paused = true;
    tryOpenPowerModal();
  }
  return true;
}

function maybeSaveSession(nowMs) {
  if (!sessionDirty) return;
  const ts = Number.isFinite(nowMs) ? nowMs : Date.now();
  if (ts - lastSessionSave < SESSION_SAVE_INTERVAL) return;
  saveSession();
  lastSessionSave = ts;
  sessionDirty = false;
}

function openNameModal() {
  state.paused = true;
  state.awaitingName = true;
  nameModalBackdrop.classList.add('open');
  setTimeout(() => playerNameInput?.focus(), 0);
  markSessionDirty();
}

function closeNameModal() {
  nameModalBackdrop.classList.remove('open');
  state.awaitingName = false;
  if (!state.powerModalOpen) {
    state.paused = false;
  }
  markSessionDirty();
}

function handleNameSubmit() {
  const name = (playerNameInput?.value || '').trim();
  if (!name) {
    playerNameInput?.focus();
    return;
  }
  state.playerName = name.slice(0, 32);
  try {
    localStorage.setItem('brickidle_player_name', state.playerName);
  } catch (_) {
    // ignore
  }
  markSessionDirty();
  closeNameModal();
}

function setTimeScale(scale) {
  state.timeScale = scale;
  timeButtons.forEach((btn) => {
    const val = Number(btn.dataset.speed);
    if (val === scale) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function getBallSpeed(isSpecial) {
  const base = CONFIG.ballSpeed;
  const plumeLevel = getTalentLevel('Plume');
  const mult = 1 + 0.1 * plumeLevel;
  return (isSpecial ? base : base * CONFIG.standardBallSpeedMultiplier) * mult;
}

function getBallRadius(isSpecial) {
  const base = CONFIG.ballRadius;
  return isSpecial ? base : base * CONFIG.standardBallRadiusMultiplier;
}

function getMaxLives() {
  return CONFIG.maxLives + 5 * getTalentLevel('Endurance');
}

function getPaddleSpeed() {
  const level = getTalentLevel('Bottes');
  const mult = 1 + 0.1 * level;
  return CONFIG.paddleSpeed * mult;
}

function getPaddleMaxSpeed() {
  const level = getTalentLevel('Bottes');
  const mult = 1 + 0.1 * level;
  return CONFIG.paddleMaxSpeed * mult;
}

function getCooldowns(nextIsSpecial) {
  const level = getTalentLevel('Gants');
  const mult = 1 / (1 + 0.1 * level);
  const base = nextIsSpecial ? CONFIG.specialShotCooldownMs : CONFIG.normalShotCooldownMs;
  return base * mult;
}

function getPaddleWidth() {
  const level = getTalentLevel('Raquette');
  const mult = 1 + 0.2 * level;
  return CONFIG.paddleWidth * mult;
}

function getPowerDef(name) {
  return POWER_DEFS.find((p) => p.name === name) || { name, maxLevel: 1 };
}

function getTalentDef(name) {
  return TALENT_DEFS.find((t) => t.name === name) || { name, maxLevel: 1 };
}

function getPowerDescription(name) {
  switch (name) {
    case 'Feu':
      return {
        plain: 'Propage les dégâts reçus à 3 briques proches (ex: 3 dégâts deviennent 3x3)',
        rich: 'Propage les dégâts reçus à <span class="power-desc-accent">3</span> briques proches <span class="power-desc-muted">(ex: <span class="power-desc-accent">3</span> dégâts deviennent <span class="power-desc-accent">3×3</span>)</span>'
      };
    case 'Glace':
      return {
        plain: 'Gèle/ralentit la brique pendant 3s (vitesse 0 puis 50%)',
        rich: 'Gèle/ralentit pendant <span class="power-desc-accent">3s</span> <span class="power-desc-muted">(0% puis 50%)</span>'
      };
    case 'Poison':
      return {
        plain: 'Inflige 1 dégât toutes les 2.5s jusqu’à la mort',
        rich: 'Inflige <span class="power-desc-accent">1</span> dégât toutes les <span class="power-desc-accent">2.5s</span> jusqu’à destruction'
      };
    case 'Metal':
      return {
        plain: 'Dégâts fortement augmentés (+150% : 3 dégâts au lieu de 1)',
        rich: 'Dégâts <span class="power-desc-accent">+150%</span> <span class="power-desc-muted">(3 au lieu de 1)</span>'
      };
    case 'Vampire':
      return {
        plain: 'Détruire une brique rend 1 vie (max 1 soin par seconde)',
        rich: 'Détruire une brique rend <span class="power-desc-accent">+1 vie</span> <span class="power-desc-muted">(max 1/s)</span>'
      };
    case 'Lumière':
      return {
        plain: 'Immobilise la brique touchée et 3 proches pendant 1.5s',
        rich: 'Immobilise la brique + <span class="power-desc-accent">3 proches</span> pendant <span class="power-desc-accent">1.5s</span>'
      };
    case 'Epine':
      return {
        plain: 'Inflige 1 dégât toutes les 3s pendant 8s max (effet persistant)',
        rich: 'Inflige <span class="power-desc-accent">1</span> dégât toutes les <span class="power-desc-accent">3s</span> pendant <span class="power-desc-accent">8s</span> max'
      };
    case 'Malediction':
      return {
        plain: 'Inflige 2 dégâts différés après 3s (ex: 1 hit -> +2 dégâts à t+3s)',
        rich: 'Inflige <span class="power-desc-accent">+2</span> dégâts différés à <span class="power-desc-accent">3s</span> <span class="power-desc-muted">(ex: +2 à t+3s)</span>'
      };
    default:
      return { plain: '', rich: '' };
  }
}

function getTalentDescription(name) {
  switch (name) {
    case 'Bottes':
      return {
        plain: 'Augmente la vitesse du paddle de 10% par niveau',
        rich: 'Vitesse du paddle <span class="power-desc-accent">+10%</span> par niveau'
      };
    case 'Plume':
      return {
        plain: 'Augmente la vitesse des balles de 10% par niveau',
        rich: 'Vitesse des balles <span class="power-desc-accent">+10%</span> par niveau'
      };
    case 'Gants':
      return {
        plain: 'Augmente la cadence de tir de 10% par niveau',
        rich: 'Cadence de tir <span class="power-desc-accent">+10%</span> par niveau'
      };
    case 'Raquette':
      return {
        plain: 'Augmente la largeur du paddle de 10% par niveau',
        rich: 'Largeur du paddle <span class="power-desc-accent">+10%</span> par niveau'
      };
    case 'Miroir':
      return {
        plain: 'Ajoute des demi-paddles : gauche au niveau 1, droite au niveau 2',
        rich: 'Ajoute des demi-paddles : <span class="power-desc-accent">gauche</span> au Lv1, <span class="power-desc-accent">droite</span> au Lv2'
      };
    case 'Endurance':
      return {
        plain: 'Augmente les PV max de 5 par niveau',
        rich: 'PV max <span class="power-desc-accent">+5</span> par niveau'
      };
    default:
      return { plain: '', rich: '' };
  }
}

function getPowerLevel(name) {
  const existing = state.powers.find((p) => p.name === name);
  return existing ? existing.level : 0;
}

function getTalentLevel(name) {
  const existing = state.talents.find((t) => t.name === name);
  return existing ? existing.level : 0;
}

function canUpgradePower(name) {
  const def = getPowerDef(name);
  return getPowerLevel(name) < def.maxLevel;
}

function canUpgradeTalent(name) {
  const def = getTalentDef(name);
  return getTalentLevel(name) < def.maxLevel;
}

function nextPowerLevel(name) {
  const def = getPowerDef(name);
  return Math.min(getPowerLevel(name) + 1, def.maxLevel);
}

function nextTalentLevel(name) {
  const def = getTalentDef(name);
  return Math.min(getTalentLevel(name) + 1, def.maxLevel);
}

function getPowerColor(name) {
  switch (name) {
    case 'Feu':
      return 'rgba(255, 215, 0, 0.35)';
    case 'Glace':
      return 'rgba(96, 165, 250, 0.35)';
    case 'Poison':
      return 'rgba(52, 211, 153, 0.35)';
    case 'Metal':
      return 'rgba(226, 232, 240, 0.35)';
    case 'Vampire':
      return 'rgba(239, 68, 68, 0.35)';
    case 'Lumière':
      return 'rgba(255, 255, 255, 0.35)';
    case 'Epine':
      return 'rgba(120, 72, 48, 0.35)';
    case 'Malediction':
      return 'rgba(139, 92, 246, 0.35)';
    default:
      return 'rgba(255,255,255,0.25)';
  }
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
  const base = 10 + (level - 1) * 5;
  return Math.ceil(base * 1.25);
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
  const availablePowers = POWER_DEFS.map((p) => p.name).filter((name) => canUpgradePower(name));
  const availableTalents = TALENT_DEFS.map((t) => t.name).filter((name) => canUpgradeTalent(name));

  if (!availablePowers.length && !availableTalents.length) {
    state.pendingPowerChoices = 0;
    state.paused = false;
    return;
  }

  const powerOptions = sampleOptions(availablePowers, 4);
  const talentOptions = sampleOptions(availableTalents, 3);
  state.currentPowerOptions = powerOptions;
  state.currentTalentOptions = talentOptions;
  renderPowerModal(powerOptions, talentOptions);
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
  markSessionDirty();
}

function handleTalentSelect(talentName) {
  const def = getTalentDef(talentName);
  const existing = state.talents.find((t) => t.name === talentName);
  if (existing) {
    if (existing.level >= def.maxLevel) {
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    } else {
      existing.level = Math.min(existing.level + 1, def.maxLevel);
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    }
  } else {
    state.talents.push({ name: talentName, level: 1 });
    state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  }
  powerModalBackdrop.classList.remove('open');
  state.powerModalOpen = false;
  if (state.pendingPowerChoices > 0) {
    tryOpenPowerModal();
  } else {
    state.paused = false;
  }
  markSessionDirty();
}

function renderPowerModal(powerOptions, talentOptions) {
  powerButtons.forEach((btn, idx) => {
    const power = powerOptions[idx];
    if (power) {
      btn.style.display = 'block';
      const currentLv = getPowerLevel(power);
      const nextLv = nextPowerLevel(power);
      const label = currentLv === 0
        ? `${power} (New)`
        : `${power} (Lv. ${currentLv} → ${nextLv})`;
      btn.textContent = label;
      btn.dataset.power = power;
      btn.title = getPowerDescription(power).plain;
      btn.onmouseenter = () => updatePowerPreview(power, label, 'power');
      btn.onfocus = () => updatePowerPreview(power, label, 'power');
      btn.onclick = () => handlePowerSelect(power);
    } else {
      btn.style.display = 'none';
    }
  });

  talentButtons.forEach((btn, idx) => {
    const talent = talentOptions[idx];
    if (talent) {
      btn.style.display = 'block';
      const currentLv = getTalentLevel(talent);
      const nextLv = nextTalentLevel(talent);
      const label = currentLv === 0
        ? `${talent} (New)`
        : `${talent} (Lv. ${currentLv} → ${nextLv})`;
      btn.textContent = label;
      btn.dataset.talent = talent;
      btn.title = getTalentDescription(talent).plain;
      btn.onmouseenter = () => updatePowerPreview(talent, label, 'talent');
      btn.onfocus = () => updatePowerPreview(talent, label, 'talent');
      btn.onclick = () => handleTalentSelect(talent);
    } else {
      btn.style.display = 'none';
    }
  });

  const firstPower = powerOptions && powerOptions.find(Boolean);
  const firstTalent = talentOptions && talentOptions.find(Boolean);
  if (firstPower) {
    const label = powerButtons.find((b) => b.dataset.power === firstPower)?.textContent || firstPower;
    updatePowerPreview(firstPower, label, 'power');
  } else if (firstTalent) {
    const label = talentButtons.find((b) => b.dataset.talent === firstTalent)?.textContent || firstTalent;
    updatePowerPreview(firstTalent, label, 'talent');
  }
}

function sampleOptions(list, count) {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function updatePowerPreview(name, labelOverride, kind = 'power') {
  if (!name) return;
  const isPower = kind === 'power';
  const desc = isPower ? getPowerDescription(name) : getTalentDescription(name);
  const color = isPower ? getPowerColor(name) : 'rgba(148, 163, 184, 0.4)';
  if (powerPreviewName) powerPreviewName.textContent = labelOverride || name;
  if (powerPreviewDesc) powerPreviewDesc.innerHTML = desc.rich || desc.plain || 'Aucun détail disponible.';
  if (powerPreviewIcon) {
    powerPreviewIcon.textContent = name.slice(0, 2).toUpperCase();
    powerPreviewIcon.style.background = color.replace('0.35', '0.55');
    powerPreviewIcon.style.boxShadow = `0 0 12px ${color}`;
  }
}

function applyLightStun(target, ball, now) {
  const duration = 1500;
  const color = getPowerColor('Lumière');
  const stun = (brick) => {
    brick.freezeUntil = Math.max(brick.freezeUntil || 0, now + duration);
    brick.effectColor = color;
    brick.effectUntil = brick.freezeUntil;
  };
  stun(target);
  const cx = target.x + target.w / 2;
  const cy = target.y + target.h / 2;
  const candidates = state.bricks
    .filter((b) => b.alive && b !== target)
    .map((b) => {
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;
      return { brick: b, dist: Math.hypot(bx - cx, by - cy) };
    })
    .sort((a, b) => a.dist - b.dist);
  const nearest = candidates.slice(0, 8);
  for (let i = nearest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [nearest[i], nearest[j]] = [nearest[j], nearest[i]];
  }
  const targets = nearest.slice(0, 3);
  for (const { brick } of targets) {
    stun(brick);
  }
}

function spawnBrickRow() {
  const { brickCols, brickPadding, brickHeight, brickTopOffset, brickRowFillRate, bonusChance, speedBonusChance } = CONFIG;
  const { brickWidth, startX } = computeBrickLayout();

  // Si un boss est proche du haut, on évite de spawner une rangée pour ne pas chevaucher.
  const boss = getAliveBoss();
  if (boss && boss.y < brickHeight * 3) {
    return;
  }

  const bricks = [];
  let spawned = 0;
  const now = performance.now ? performance.now() : Date.now();
  const allowBonus = now - bonusState.lastBonus >= CONFIG.bonusCooldownMs;
  const hp = getBrickHP();
  for (let col = 0; col < brickCols; col += 1) {
    if (Math.random() > brickRowFillRate) continue;
    const x = startX + col * (brickWidth + brickPadding);
    const y = -brickHeight - brickTopOffset;
    if (boss) {
      const margin = brickPadding * 2;
      const overlapsBoss = (
        x < boss.x + boss.w + margin &&
        x + brickWidth + margin > boss.x &&
        y < boss.y + boss.h + margin &&
        y + brickHeight + margin > boss.y
      );
      if (overlapsBoss) continue;
    }
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
      freezeUntil: 0,
      poisonNextTick: 0,
      poisonActive: false,
      thornNextTick: 0,
      thornActive: false,
      thornExpire: 0,
      curseTick: null,
      effectColor: null,
      effectUntil: 0
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
      freezeUntil: 0,
      poisonNextTick: 0,
      poisonActive: false,
      thornNextTick: 0,
      thornActive: false,
      thornExpire: 0,
      curseTick: null,
      effectColor: null,
      effectUntil: 0
    });
  }

  state.rowIndex += 1;
  state.bricks.push(...bricks);
}

function spawnBossBrick(level) {
  const { brickPadding, brickHeight, brickTopOffset } = CONFIG;
  const { brickWidth, startX } = computeBrickLayout();
  const totalWidth = CONFIG.brickCols * brickWidth + brickPadding * (CONFIG.brickCols - 1);
  const w = brickWidth * 2;
  const h = brickHeight * 2;
  const x = startX + (totalWidth - w) / 2;
  const y = -h - brickTopOffset;
  // Libère l'espace pour le boss en supprimant les briques qui chevauchent sa zone
  const margin = brickPadding * 2;
  state.bricks = state.bricks.filter((b) => {
    if (!b.alive || b.type === 'boss') return true;
    const overlap = (
      b.x < x + w + margin &&
      b.x + b.w + margin > x &&
      b.y < y + h + margin &&
      b.y + b.h + margin > y
    );
    return !overlap;
  });
  state.bricks.push({
    x,
    y,
    w,
    h,
    hue: 0,
    alive: true,
    row: level,
    type: 'boss',
    hp: 20,
    deathTime: null,
    flashTime: null,
    slowUntil: 0,
    freezeUntil: 0,
    poisonNextTick: 0,
    poisonActive: false,
    thornNextTick: 0,
    thornActive: false,
    thornExpire: 0,
    curseTick: null,
    effectColor: 'rgba(248, 113, 113, 0.35)',
    effectUntil: Number.POSITIVE_INFINITY
  });
}

function getAliveBoss() {
  return state.bricks.find((b) => b.alive && b.type === 'boss') || null;
}

function maybeSpawnBoss() {
  if (state.level > state.lastBossLevelSpawned) {
    spawnBossBrick(state.level);
    state.lastBossLevelSpawned = state.level;
  }
}

function spawnRewardBall(brick) {
  const targetX = state.paddle.x + state.paddle.w / 2;
  const targetY = state.paddle.y - state.paddle.h;
  const dx = targetX - (brick.x + brick.w / 2);
  const dy = targetY - (brick.y + brick.h / 2);
  const dist = Math.hypot(dx, dy) || 1;
  const speed = getBallSpeed(false) * 0.65;
  state.balls.push({
    x: brick.x + brick.w / 2,
    y: brick.y + brick.h / 2,
    r: getBallRadius(false),
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
  paddle.w = getPaddleWidth();
  paddle.h = CONFIG.paddleHeight;
  if (centerPaddle) {
    paddle.x = (CONFIG.width - paddle.w) / 2;
  }
  paddle.y = CONFIG.height - 60;
  const nextIsSpecial = state.specialPocket.length > 0;
  heldBall.r = getBallRadius(nextIsSpecial);
  heldBall.x = paddle.x + paddle.w / 2;
  heldBall.y = paddle.y - heldBall.r - 2;
  heldBall.vx = 0;
  heldBall.vy = 0;
  heldBall.specialPower = null;
  state.ballHeld = true;
  if (refill) {
    state.ballCount = Math.min(CONFIG.maxNormalBalls, state.ballCount + 1);
  }
}

function launchBall() {
  if (!state.ballHeld) return;
  const available = state.ballCount + state.specialPocket.length;
  if (available <= 0) return;
  const now = performance.now ? performance.now() : Date.now();
  const nextIsSpecial = state.specialPocket.length > 0;
  const cooldown = getCooldowns(nextIsSpecial);
  if (now - state.lastLaunch < cooldown) return;
  state.ballHeld = false;
  state.lastLaunch = now;
  let specialPower = null;
  if (state.specialPocket.length > 0) {
    // Priorité aux balles spéciales
    specialPower = state.specialPocket.shift();
  } else {
    state.ballCount -= 1;
  }
  const speed = getBallSpeed(Boolean(specialPower));
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
  } else if (state.aimPos) {
    const dx = state.aimPos.x - originX;
    const dy = state.aimPos.y - originY;
    const len = Math.hypot(dx, dy) || 1;
    const aimed = withAimJitter((dx / len) * speed, (dy / len) * speed);
    vx = aimed.vx;
    vy = aimed.vy;
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
    r: getBallRadius(Boolean(specialPower)),
    vx,
    vy,
    returning: false,
    specialPower
  });
}

function resetGame() {
  state.score = 0;
  const maxLife = getMaxLives();
  state.lives = Math.min(maxLife, CONFIG.startLives + 5 * getTalentLevel('Endurance'));
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
  state.talents = [];
  state.specialPocket = [];
  state.pendingPowerChoices = 0;
  state.powerModalOpen = false;
  state.currentPowerOptions = [];
  state.currentTalentOptions = [];
  state.lastHitSpecial = null;
  state.lastVampireHeal = 0;
  state.lastBossLevelSpawned = 0;
  state.damageByPower = {};
  state.backendTopScores = [];
  state.gameOverHandled = false;
  state.lastEndedAt = null;
  state.scoreSubmitted = false;
  powerModalBackdrop.classList.remove('open');
  placeBallOnPaddle({ centerPaddle: true });
  spawnBrickRow();
  markSessionDirty();
  lastSessionSave = -SESSION_SAVE_INTERVAL;
}

function getTopScores() {
  try {
    const raw = localStorage.getItem('brickidle_top_scores');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 5);
  } catch (_) {
    return [];
  }
}

function saveScore(score) {
  try {
    const scores = getTopScores();
    const entry = typeof score === 'object'
      ? score
      : {
          player: state.playerName || 'Anonyme',
          score,
          stage: state.level,
          level: state.playerLevel,
          endedAt: new Date().toISOString()
        };
    scores.push(entry);
    scores.sort((a, b) => (b.score || 0) - (a.score || 0));
    const top5 = scores.slice(0, 5);
    localStorage.setItem('brickidle_top_scores', JSON.stringify(top5));
  } catch (_) {
    // ignore storage errors
  }
}

async function submitScoreToBackend(payload) {
  if (!payload || state.submittingScore) return null;
  state.submittingScore = true;
  try {
    const res = await fetch(apiUrl('/scores'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.scoreSubmitted = true;
    return data;
  } catch (err) {
    console.error('submitScoreToBackend failed', err);
    return null;
  } finally {
    state.submittingScore = false;
  }
}

async function fetchTopScoresFromBackend(limit = 5) {
  try {
    const res = await fetch(apiUrl(`/scores?limit=${limit}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      state.backendTopScores = data;
    }
  } catch (err) {
    console.error('fetchTopScoresFromBackend failed', err);
  }
}

async function fetchCommits() {
  if (!commitListEl) return;
  commitListEl.textContent = 'Chargement...';
  try {
    const res = await fetch(apiUrl('/commits'));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('format inattendu');
    commitListEl.innerHTML = '';
    data.slice(0, 10).forEach((c) => {
      const item = document.createElement('div');
      item.className = 'commit-item';
      const hash = document.createElement('div');
      hash.className = 'commit-hash';
      hash.textContent = c.hash || '';
      const msg = document.createElement('div');
      msg.className = 'commit-msg';
      msg.textContent = c.message || '';
      const date = document.createElement('div');
      date.className = 'commit-date';
      date.textContent = c.date || '';
      item.appendChild(hash);
      item.appendChild(msg);
      item.appendChild(date);
      commitListEl.appendChild(item);
    });
  } catch (err) {
    console.error('fetchCommits failed', err);
    commitListEl.textContent = 'Impossible de charger les commits.';
  }
}

function triggerGameOver() {
  if (state.gameOverHandled) return;
  state.running = false;
  state.gameOverHandled = true;
  const endedAt = new Date().toISOString();
  state.lastEndedAt = endedAt;
  const payload = {
    player: state.playerName || 'Anonyme',
    score: state.score,
    stage: state.level,
    level: state.playerLevel,
    endedAt
  };
  saveScore(payload);
  submitScoreToBackend(payload)?.then(() => fetchTopScoresFromBackend().catch(() => {})).catch(() => {});
  fetchTopScoresFromBackend();
  markSessionDirty();
}

function update(dt) {
  if (!state.running || state.paused) return;
  const now = performance.now ? performance.now() : Date.now();
  const { paddle, heldBall, keys } = state;
  paddle.w = getPaddleWidth();
  const speedInterval = CONFIG.speedIncreaseInterval;
  state.speedTimer += dt;
  while (state.speedTimer >= speedInterval) {
    state.speedTimer -= speedInterval;
    state.brickSpeed *= CONFIG.speedIncreaseMultiplier;
    state.level += 1;
    maybeSpawnBoss();
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
      let slowFactor = 1;
      if (brick.freezeUntil && brick.freezeUntil > now) slowFactor = 0;
      else if (brick.slowUntil && brick.slowUntil > now) slowFactor = 0.5;
      brick.y += state.brickSpeed * slowFactor * dt;
    }
  }

  // Collisions entre briques (empêche le chevauchement). Une brique gelée reste immobile.
  const isFrozen = (b) => b.alive && ((b.freezeUntil && b.freezeUntil > now) || (b.slowUntil && b.slowUntil > now));
  const activeBricks = state.bricks.filter((b) => b.alive).sort((a, b) => a.y - b.y);
  for (let i = 0; i < activeBricks.length; i += 1) {
    const upper = activeBricks[i];
    for (let j = i + 1; j < activeBricks.length; j += 1) {
      const lower = activeBricks[j];
      const overlapX = upper.x < lower.x + lower.w && upper.x + upper.w > lower.x;
      if (!overlapX) continue;
      const overlapY = upper.y < lower.y + lower.h && upper.y + upper.h > lower.y;
      if (!overlapY) continue;
      if (isFrozen(lower)) {
        upper.y = Math.min(upper.y, lower.y - upper.h - 0.01);
      } else {
        upper.y = Math.min(upper.y, lower.y - upper.h - 0.01);
      }
      break; // premier support suffisant
    }
  }

  // Si une brique atteint le bas, perte de vie.
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.y + brick.h >= CONFIG.height) {
      brick.alive = false;
      state.lives -= 1;
      if (state.lives <= 0) {
        triggerGameOver();
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
    const maxStep = getPaddleMaxSpeed() * dt;
    const delta = (targetX - paddle.x) * smoothing * dt;
    paddle.x += clamp(delta, -maxStep, maxStep);
  } else {
    const paddleSpeed = getPaddleSpeed();
    if (keys.left) {
      paddle.x -= paddleSpeed * dt;
    }
    if (keys.right) {
      paddle.x += paddleSpeed * dt;
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
      brick.poisonNextTick = now + 2500;
      damageBrick(brick, 1, now, 'Poison');
    }
  }

  // Tick malédiction (dégât différé)
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.curseTick && brick.curseTick <= now) {
      brick.curseTick = null;
      damageBrick(brick, 2, now, 'Malediction');
    }
  }

  // Tick Epine (dégâts continus)
  for (const brick of state.bricks) {
    if (!brick.alive || !brick.thornActive) continue;
    if (brick.thornExpire && brick.thornExpire <= now) {
      brick.thornActive = false;
      brick.thornNextTick = 0;
      brick.thornExpire = 0;
      continue;
    }
    if (brick.thornNextTick && brick.thornNextTick <= now) {
      brick.thornNextTick = now + 3000;
      // Maintient le halo actif pendant l'effet Epine
      brick.effectColor = getPowerColor('Epine');
      brick.effectUntil = brick.thornExpire;
      damageBrick(brick, 1, now, 'Epine');
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
          state.ballCount = Math.min(CONFIG.maxNormalBalls, state.ballCount + 1);
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
        const speed = ball.returnSpeed || (getBallSpeed(Boolean(ball.specialPower)) * 0.5);
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
    const mirrorLevel = getTalentLevel('Miroir');
    const paddles = [{ x: paddle.x, w: paddle.w }];
    const halfWidth = paddle.w * 0.5;
    const gap = 8;
    if (mirrorLevel >= 1) paddles.push({ x: paddle.x - halfWidth - gap, w: halfWidth });
    if (mirrorLevel >= 2) paddles.push({ x: paddle.x + paddle.w + gap, w: halfWidth });

    const hitPaddle = paddles.some((p) => (
      !ball.returning &&
      ball.y + ball.r >= paddle.y &&
      ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= p.x - ball.r &&
      ball.x <= p.x + p.w + ball.r &&
      ball.vy > 0
    ));

    if (hitPaddle) {
      ball.y = paddle.y - ball.r;
      ball.vy *= -1;

      const speed = Math.hypot(ball.vx, ball.vy);
      if (state.autoPlay) {
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
          if (ball.vy > -40) ball.vy = -Math.abs(ball.vy) - 40;
        } else {
          const aimed = withAimJitter(ball.vx, -Math.abs(ball.vy));
          ball.vx = aimed.vx;
          ball.vy = aimed.vy;
        }
      } else {
        // Ajuste l'angle selon le point d'impact côté joueur.
        const mainPaddle = paddles[0];
        const hitPos = (ball.x - mainPaddle.x) / mainPaddle.w; // 0 -> 1 basé sur le paddle principal
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

        const damage = ball.specialPower === 'Metal' ? 3 : 1;
        state.lastHitSpecial = ball.specialPower || null;
        applyPowerOnHit(ball, brick, now);
        damageBrick(brick, damage, now, ball.specialPower || null);
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
        const speed = getBallSpeed(Boolean(ball.specialPower)) * 0.5;
        ball.returnSpeed = speed;
        ball.vx = (dx / dist) * speed;
        ball.vy = (dy / dist) * speed;
        ball.returning = true;
        ball.reward = false;
      }
    }
  }

  markSessionDirty();
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
      let starColor = `rgba(255, 255, 255, ${0.9 * alpha})`;
      if (brick.hp > 10) {
        starColor = `rgba(239, 68, 68, ${0.9 * alpha})`; // rouge si >10 PV
      } else if (brick.hp > 5) {
        starColor = `rgba(59, 130, 246, ${0.9 * alpha})`; // bleu si >5 PV
      }
      ctx.fillStyle = starColor;
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

    // Halo d'effet (pouvoirs)
    const haloActive = brick.effectColor && brick.effectUntil > now;
    if (haloActive) {
      const pad = 4;
      ctx.save();
      ctx.fillStyle = brick.effectColor;
      ctx.fillRect(drawX - pad, drawY - pad, drawW + pad * 2, drawH + pad * 2);
      ctx.restore();
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
  const raquetteLv = getTalentLevel('Raquette');
  const baseColor = raquetteLv > 0 ? '#22d3ee' : '#38bdf8';
  ctx.fillStyle = baseColor;
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  const mirrorLevel = getTalentLevel('Miroir');
  const halfWidth = paddle.w * 0.5;
  const gap = 8;
  if (mirrorLevel >= 1) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(paddle.x - halfWidth - gap, paddle.y, halfWidth, paddle.h);
  }
  if (mirrorLevel >= 2) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(paddle.x + paddle.w + gap, paddle.y, halfWidth, paddle.h);
  }
}

function renderAimCone() {
  if (!state.showAim) return;
  const { paddle } = state;
  const originX = paddle.x + paddle.w / 2;
  const originY = paddle.y;

  let targetPoint = null;
  if (!state.autoPlay && state.aimPos) {
    targetPoint = { x: state.aimPos.x, y: state.aimPos.y };
  } else if (state.autoPlay) {
    const target = selectTargetBrick();
    if (target) {
      targetPoint = { x: target.x + target.w / 2, y: target.y + target.h / 2 };
    }
  }

  if (targetPoint) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)'; // rouge
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(targetPoint.x, targetPoint.y);
    ctx.stroke();
    ctx.restore();
  }
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
      if (ball.specialPower === 'Feu') {
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
  const leftX = 14;
  let leftY = 32;
  ctx.font = '22px "Segoe UI", sans-serif';
  ctx.fillStyle = '#7dd3fc';
  const buildLabel = buildInfo?.build ? `v${buildInfo.build}` : 'dev';
  ctx.fillText(`Version: ${buildLabel}`, leftX, leftY);
  leftY += 26;
  const displayName = state.playerName ? state.playerName : 'Pseudo ?';
  ctx.fillText(`Joueur: ${displayName}`, leftX, leftY);
  leftY += 26;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(`Score: ${formatScore(state.score)}`, leftX, leftY);
  leftY += 24;
  ctx.fillText(state.autoPlay ? 'Auto: ON' : 'Auto: OFF', leftX, leftY);
  const availableBalls = state.ballCount + state.specialPocket.length + (state.ballHeld ? 1 : 0);
  const totalBalls = availableBalls + state.balls.length;
  leftY += 24;
  ctx.fillText(`Balles: ${availableBalls}/${totalBalls}`, leftX, leftY);
  const speedSpecial = Math.round(getBallSpeed(true));
  const speedNormal = Math.round(getBallSpeed(false));
  leftY += 24;
  ctx.fillText(`Vitesse: ${speedNormal}/${speedSpecial} px/s`, leftX, leftY);
  leftY += 24;
  ctx.fillText(`Cadence: ${(1000 / CONFIG.normalShotCooldownMs).toFixed(1)} /s`, leftX, leftY);
  leftY += 24;
  ctx.fillText(`Cadence spé: ${(1000 / CONFIG.specialShotCooldownMs).toFixed(1)} /s`, leftX, leftY);
  leftY += 24;
  ctx.fillText(`Briques: ${state.brickSpeed.toFixed(1)} px/s`, leftX, leftY);
  const topList = (state.backendTopScores && state.backendTopScores.length)
    ? state.backendTopScores
    : getTopScores();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '19px "Segoe UI", sans-serif';
  const boxY = CONFIG.height - 150;
  ctx.fillText('Top 5 actuel', leftX, boxY);
  topList.slice(0, 5).forEach((entry, idx) => {
    const e = typeof entry === 'object' ? entry : { score: entry };
    const label = `${idx + 1}. ${(e.player || '???').slice(0, 10)} - ${formatScore(e.score || 0)}`;
    ctx.fillText(label, leftX, boxY + 24 + idx * 22);
  });
  // Barres de progression (ordre: Vies, Stage, Level)
  const barW = 180;
  const barH = 8;
  const barX = CONFIG.width - barW - 20;
  const spacing = 32;
  let barY = 30;

  // Vies
  const maxLife = getMaxLives();
  const lifeProgress = Math.min(state.lives / maxLife, 1);
  ctx.fillStyle = '#34d399';
  ctx.fillText(`Vies: ${state.lives}/${maxLife}`, barX, barY - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#34d399';
  ctx.fillRect(barX, barY, barW * lifeProgress, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Stage
  barY += spacing;
  const interval = CONFIG.speedIncreaseInterval;
  const progress = Math.min(state.speedTimer / interval, 1);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`Stage: ${state.level}`, barX, barY - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Level (XP joueur)
  barY += spacing;
  const xpProgress = Math.min(state.xp / state.xpNeeded, 1);
  ctx.fillStyle = '#f472b6';
  ctx.fillText(`Level ${state.playerLevel}`, barX, barY - 8);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(barX, barY, barW * xpProgress, barH);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.fillText(`${Math.floor(state.xp)}/${state.xpNeeded}`, barX + barW - 70, barY - 8);

  // Liste des pouvoirs acquis (à droite, sous les infos).
  ctx.fillStyle = '#e2e8f0';
  let infoY = barY + 28;
  const powersY = infoY;
  ctx.fillText('Pouvoirs:', barX, powersY);
  const powerLines = state.powers; // affiche tous
  powerLines.forEach((p, idx) => {
    ctx.fillText(`- ${p.name} (Lv. ${p.level})`, barX, powersY + 20 + idx * 18);
  });

  // Talents
  const talentsY = powersY + 20 + powerLines.length * 18 + 10;
  ctx.fillText('Talents:', barX, talentsY);
  const talentLines = state.talents;
  talentLines.forEach((t, idx) => {
    ctx.fillText(`- ${t.name} (Lv. ${t.level})`, barX, talentsY + 20 + idx * 18);
  });

  // Histogramme dégâts par pouvoir (en bas à droite)
  const talentsBlockHeight = 20 + talentLines.length * 18;
  const listBottom = talentsY + talentsBlockHeight;
  const histY = Math.min(CONFIG.height - 140, listBottom + 30);
  const histX = barX;
  const entries = Object.entries(state.damageByPower || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (entries.length) {
    const labelY = histY;
    const startY = labelY + 20; // cohérent avec les barres du dessus
    ctx.fillText('Dégâts par pouvoir', histX, labelY);
    const barHeight = 8; // même hauteur que les barres de progression
    const barGap = 32; // même spacing vertical que les autres sections
    const maxVal = Math.max(...entries.map(([, v]) => v));
    entries.forEach(([name, val], idx) => {
      const y = startY + idx * (barHeight + barGap);
      const ratio = maxVal > 0 ? val / maxVal : 0;
      const w = barW * ratio;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(histX, y, barW, barHeight);
      ctx.fillStyle = getPowerColor(name) || '#fbbf24';
      ctx.fillRect(histX, y, w, barHeight);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${name} (${val})`, histX, y - 8);
    });
  }

  if (!state.running) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '32px "Segoe UI", sans-serif';
    ctx.fillText('Partie terminée - Appuyez sur Entrée pour rejouer', 120, CONFIG.height / 2);
    ctx.fillText(`Score: ${formatScore(state.score)}`, 120, CONFIG.height / 2 + 36);

    // Top 5 (backend si dispo, sinon local)
    const top = (state.backendTopScores && state.backendTopScores.length)
      ? state.backendTopScores
      : getTopScores();
    ctx.font = '22px "Segoe UI", sans-serif';
    ctx.fillText('Top 5 :', 120, CONFIG.height / 2 + 70);
    top.forEach((s, idx) => {
      const entry = typeof s === 'object' ? s : { score: s };
      const line = `${entry.player || '???'} - ${formatScore(entry.score || 0)} pts - Stage:${entry.stage || '?'} - Lv:${entry.level || '?'}`;
      ctx.fillText(`${idx + 1}. ${line}`, 120, CONFIG.height / 2 + 95 + idx * 24);
    });
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

  const scaledDt = dt * (state.timeScale || 1);
  update(scaledDt);
  render();
  maybeSaveSession(timestamp);
  requestAnimationFrame(loop);
}

function bindControls() {
  window.addEventListener('keydown', (event) => {
    if (state.awaitingName) return;
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
  if (autoFireToggle) {
    autoFireToggle.addEventListener('change', (event) => {
      state.autoFire = event.target.checked;
    });
  }
  timeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number(btn.dataset.speed) || 1;
      setTimeScale(val);
    });
  });
  playerNameSubmit?.addEventListener('click', handleNameSubmit);
  playerNameInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleNameSubmit();
    }
  });
  canvas.addEventListener('click', () => {
    if (state.ballHeld) launchBall();
  });
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    state.aimPos = {
      x: ((event.clientX - rect.left) / rect.width) * CONFIG.width,
      y: ((event.clientY - rect.top) / rect.height) * CONFIG.height
    };
  });
}

function init() {
  resizeCanvas();
  bindControls();
  const savedName = loadPlayerName();
  resetGame();
  const restored = loadSession();
  autoBtn.textContent = state.autoPlay ? 'Désactiver auto-visée' : 'Activer auto-visée';
  aimToggle.checked = state.showAim;
  if (autoFireToggle) autoFireToggle.checked = state.autoFire;
  if (!savedName && !state.playerName) {
    openNameModal();
  }
  if (!restored) {
    setTimeScale(1);
  }
  fetchTopScoresFromBackend();
  fetchCommits();
  setInterval(() => {
    fetchTopScoresFromBackend().catch(() => {});
  }, 30000);
  requestAnimationFrame(loop);
}

init();
function applyPowerOnHit(ball, brick, now) {
  if (!brick.alive) return;
  const power = ball.specialPower;
  if (power === 'Glace') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 3000); // 3s de gel
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.slowUntil;
  } else if (power === 'Poison') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 2500;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = Number.POSITIVE_INFINITY;
  } else if (power === 'Feu') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 3000; // halo feu 3s
  } else if (power === 'Metal') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 500;
  } else if (power === 'Lumière') {
    applyLightStun(brick, ball, now);
  } else if (power === 'Malediction') {
    brick.curseTick = now + 3000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
  } else if (power === 'Epine') {
    brick.thornActive = true;
    brick.thornNextTick = now + 3000;
    brick.thornExpire = now + 8000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
  }
}

function damageBrick(brick, amount, now, sourcePower = null) {
  brick.flashTime = now;
  brick.hp = Math.max(0, (brick.hp || 1) - amount);

  if (sourcePower) {
    state.damageByPower[sourcePower] = (state.damageByPower[sourcePower] || 0) + amount;
  }

  const destroyed = brick.hp <= 0;
  if (destroyed) {
    brick.alive = false;
    brick.deathTime = now;
        state.score += 50 + brick.row * 10;
    const xpDropCount = brick.type === 'boss' ? 5 : 1;
    for (let k = 0; k < xpDropCount; k += 1) {
      spawnXpDrop(brick);
    }
    if (brick.type === 'bonus') {
      bonusState.lastBonus = brick.deathTime;
      spawnRewardBall(brick);
    } else if (brick.type === 'speed') {
      applySpeedBoost();
    }
    // Effet Vampire : gain de vie si la brique est détruite par une balle Vampire (max 1/s)
    const maxLife = getMaxLives();
    if (amount && state.lastHitSpecial === 'Vampire' && state.lives < maxLife) {
      if (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000) {
        state.lives = Math.min(maxLife, state.lives + 1);
        state.lastVampireHeal = now;
      }
    }
  }
  return destroyed;
}

function applyFireSplash(ball, hitBrick, now, baseDamage) {
  if (ball.specialPower !== 'Feu') return;
  const cx = hitBrick.x + hitBrick.w / 2;
  const cy = hitBrick.y + hitBrick.h / 2;
  const candidates = state.bricks
    .filter((b) => b.alive && b !== hitBrick)
    .map((b) => {
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;
      return { brick: b, dist: Math.hypot(bx - cx, by - cy) };
    })
    .sort((a, b) => a.dist - b.dist);
  // Sélection aléatoire parmi les plus proches
  const nearest = candidates.slice(0, 8); // proche échantillon
  for (let i = nearest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [nearest[i], nearest[j]] = [nearest[j], nearest[i]];
  }
  const targets = nearest.slice(0, 3);
  for (const { brick } of targets) {
    applyPowerOnHit(ball, brick, now);
    damageBrick(brick, baseDamage, now, 'Feu');
  }
}
