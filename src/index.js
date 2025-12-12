// DO NOT REMOVE
import.meta.env.VITE_API_TOKEN;
import.meta.env.VITE_API_KEY;

import buildInfo from './build-info.json';
import mediaList, { MEDIA_BY_NAME as MEDIA_MAP } from './assets/media-map.js';
import { loadImage, preloadAssets } from './assets.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = null;
const autoFireToggle = null;
const powerModalBackdrop = document.getElementById('power-modal-backdrop');
const powerPassBtn = document.getElementById('power-pass-btn');
const powerCatalogBtn = document.getElementById('power-open-catalog');
const powerConfirmBtn = document.getElementById('power-confirm-btn');
const powerButtons = Array.from(document.querySelectorAll('.power-btn'));
const talentButtons = Array.from(document.querySelectorAll('.talent-btn'));
const powerPreviewName = document.getElementById('power-preview-name');
const powerPreviewDesc = document.getElementById('power-preview-desc');
const powerPreviewIcon = document.getElementById('power-preview-icon');
const nameModalBackdrop = document.getElementById('name-modal-backdrop');
const playerNameInput = document.getElementById('player-name-input');
const playerNameSubmit = document.getElementById('player-name-submit');
const abandonBtn = document.getElementById('abandon-btn');
const pauseBtn = document.getElementById('pause-btn');
const infoBtn = document.getElementById('info-btn');
const infoModalBackdrop = document.getElementById('info-modal-backdrop');
const infoCloseBtn = document.getElementById('info-close');
const catalogModalBackdrop = document.getElementById('catalog-modal-backdrop');
const catalogCloseBtn = document.getElementById('catalog-close');
const catalogOpenBtn = document.getElementById('open-catalog');
const catalogPowers = document.getElementById('catalog-powers');
const catalogTalents = document.getElementById('catalog-talents');
const catalogFusions = document.getElementById('catalog-fusions');
const commitToggle = document.getElementById('commit-toggle');
const commitChevron = document.getElementById('commit-chevron');
const commitListEl = document.getElementById('commit-list');
const scoreListEl = document.getElementById('score-list');
const scoreToggle = document.getElementById('score-toggle');
const scoreChevron = document.getElementById('score-chevron');
const scoreFilterCheckbox = document.getElementById('score-filter-current');
const scoreFilterMineCheckbox = document.getElementById('score-filter-mine');
const scoreSortSelect = document.getElementById('score-sort');
const settingsBtn = document.getElementById('settings-btn');
const settingsModalBackdrop = document.getElementById('settings-modal-backdrop');
const settingsLeftInput = document.getElementById('key-left');
const settingsRightInput = document.getElementById('key-right');
const settingsLaunchInput = document.getElementById('key-launch');
const settingsSaveBtn = document.getElementById('settings-save');
const settingsCancelBtn = document.getElementById('settings-cancel');
const settingsDamageToggle = document.getElementById('toggle-damage-graph');
const settingsFpsToggle = document.getElementById('toggle-fps');
const powerSlotsLabel = document.getElementById('power-slots-label');
const talentSlotsLabel = document.getElementById('talent-slots-label');
const timeButtons = Array.from(document.querySelectorAll('.time-btn'));
const suggestionToggle = document.getElementById('suggestion-toggle');
const suggestionChevron = document.getElementById('suggestion-chevron');
const suggestionForm = document.getElementById('suggestion-form');
const suggestionTextarea = document.getElementById('suggestion-text');
const suggestionTypeSelect = document.getElementById('suggestion-type');
const suggestionStatusEl = document.getElementById('suggestion-status');
const suggestionListEl = document.getElementById('suggestion-list');
const IS_LOCALHOST = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const scoreErrorModal = document.getElementById('score-error-modal-backdrop');
const scoreErrorRetryBtn = document.getElementById('score-error-retry');
const scoreErrorCancelBtn = document.getElementById('score-error-cancel');
const scoreErrorStatus = document.getElementById('score-error-status');
const scoreOkModal = document.getElementById('score-ok-modal-backdrop');
const scoreOkClose = document.getElementById('score-ok-close');
const MEDIA_BY_NAME = MEDIA_MAP || (() => {
  const map = {};
  (mediaList || []).forEach((m) => {
    if (m?.name) map[m.name] = m;
  });
  return map;
})();
const hudBuffer = document.createElement('canvas');
const hudCtx = hudBuffer.getContext('2d');
let hudSignature = null;
let fpsCounter = 0;
let fpsLastTime = 0;
let paddleSprite = null;
let paddleSpriteReady = false;
let moduleSprite = null;
let moduleSpriteReady = false;
const FUSION_SPRITES = [
  'fusion-sun.png',
  'fusion-tundra.png',
  'fusion-forge.png',
  'fusion-leech.png',
  'fusion-prism.png',
  'fusion-spikes.png',
  'fusion-aurora.png',
  'fusion-frostbite.png',
  'fusion-gravebound.png',
  'fusion-storm.png',
  'fusion-rust.png',
  'fusion-echo.png',
  'fusion-bramble.png',
  'fusion-radiance.png',
  'fusion-shard.png',
  'fusion-plaguefire.png'
];
const TOP_LIMIT = Infinity;
const PASS_LIMIT_PER_MODAL = 3;
const BUILD_LABEL = 'b20';
const API_TOKEN = (
  import.meta?.env?.VITE_API_TOKEN ||
  import.meta?.env?.VITE_API_KEY ||
  ''
).trim() || null;

if (!API_TOKEN) {
  console.warn('API token missing: set VITE_API_TOKEN or VITE_API_KEY.');
}
const DEFAULT_KEYS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  launch: 'Space'
};
const MAX_POWERS = 4;
const MAX_TALENTS = 4;
const formatDesc = (desc) => desc?.plain || desc?.rich || '';

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

function authHeaders() {
  return API_TOKEN ? { 'x-api-key': API_TOKEN } : {};
}

const POWER_DEFS = [
  { name: 'Fire', maxLevel: 3 },
  { name: 'Ice', maxLevel: 3 },
  { name: 'Poison', maxLevel: 3 },
  { name: 'Metal', maxLevel: 3 },
  { name: 'Vampire', maxLevel: 3 },
  { name: 'Light', maxLevel: 3 },
  { name: 'Thorns', maxLevel: 3 },
  { name: 'Curse', maxLevel: 3 },
  { name: 'Wind', maxLevel: 1 }
];
const FUSION_DEFS = [
  {
    name: 'Sun',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Fire', 'Light'],
    color: 'rgba(255, 224, 128, 0.5)'
  },
  {
    name: 'Tundra',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Ice', 'Poison'],
    color: 'rgba(125, 211, 252, 0.5)'
  },
  {
    name: 'Forge',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Fire', 'Metal'],
    color: 'rgba(248, 113, 113, 0.5)'
  },
  {
    name: 'Leech',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Vampire', 'Poison'],
    color: 'rgba(167, 139, 250, 0.5)'
  },
  {
    name: 'Prism',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Ice'],
    color: 'rgba(191, 219, 254, 0.5)'
  },
  {
    name: 'Spikes',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Thorns', 'Metal'],
    color: 'rgba(94, 234, 212, 0.5)'
  },
  {
    name: 'Aurora',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Curse'],
    color: 'rgba(244, 244, 255, 0.55)'
  },
  {
    name: 'Frostbite',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Ice', 'Thorns'],
    color: 'rgba(125, 211, 252, 0.55)'
  },
  {
    name: 'Gravebound',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Vampire', 'Thorns'],
    color: 'rgba(190, 152, 110, 0.55)'
  },
  {
    name: 'Storm',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Metal'],
    color: 'rgba(186, 230, 253, 0.55)'
  },
  {
    name: 'Rust',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Metal', 'Poison'],
    color: 'rgba(148, 163, 184, 0.55)'
  },
  {
    name: 'Echo',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Mirror'],
    color: 'rgba(203, 213, 225, 0.55)'
  },
  {
    name: 'Bramble',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Thorns', 'Feather'],
    color: 'rgba(74, 222, 128, 0.5)'
  },
  {
    name: 'Radiance',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Endurance'],
    color: 'rgba(255, 249, 196, 0.55)'
  },
  {
    name: 'Shard',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Ice', 'Gloves'],
    color: 'rgba(165, 243, 252, 0.55)'
  },
  {
    name: 'Plaguefire',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Fire', 'Curse'],
    color: 'rgba(251, 191, 36, 0.55)'
  },
  {
    name: 'Jetstream',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Wind', 'Scope'],
    color: 'rgba(94, 234, 212, 0.5)'
  }
];
const ALL_POWER_DEFS = [...POWER_DEFS, ...FUSION_DEFS];

const TALENT_DEFS = [
  { name: 'Boots', maxLevel: 3 },
  { name: 'Feather', maxLevel: 3 },
  { name: 'Gloves', maxLevel: 3 },
  { name: 'Paddle', maxLevel: 3 },
  { name: 'Mirror', maxLevel: 2 },
  { name: 'Endurance', maxLevel: 3 },
  { name: 'Scope', maxLevel: 3 },
  { name: 'Momentum', maxLevel: 3 },
  { name: 'Resilience', maxLevel: 3 },
  { name: 'Surge', maxLevel: 3 }
];

function warnMissingMediaMappings() {
  const expected = new Set([...POWER_DEFS, ...FUSION_DEFS, ...TALENT_DEFS].map((d) => d.name));
  const missing = [...expected].filter((name) => !MEDIA_BY_NAME[name]);
  const extras = Object.keys(MEDIA_BY_NAME || {}).filter((name) => !expected.has(name));
  if (missing.length) {
    console.warn('No media asset mapped for:', missing.join(', '));
  }
  if (extras.length) {
    console.warn('Media entries not used in definitions:', extras.join(', '));
  }
}

const CONFIG = {
  width: 880,
  height: 1728,
  paddleWidth: 160,
  paddleHeight: 16,
  paddleSpeed: 600,
  paddleMaxSpeed: 600, // vitesse max (légèrement supérieure à la balle)
  ballSpeed: 540,
  ballRadius: 8, // rayon des spéciales
  brickRows: 5,
  brickCols: 6,
  brickTopOffset: 70,
  brickPadding: 12,
  brickHeight: 44,
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
  xpSpeed: 2000,
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
const PREFS_KEY = 'brickidle_prefs';

const state = {
  keys: {
    left: false,
    right: false
  },
  keyBindings: { ...DEFAULT_KEYS },
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
  suggestions: [],
  submittingSuggestion: false,
  loadingSuggestions: false,
  suggestionExpanded: false,
  topScoresExpanded: false,
  pendingScoreRetry: null,
  manualPause: false,
  infoOpen: false,
  catalogOpen: false,
  catalogReturnToPower: false,
  settingsOpen: false,
  gameOverHandled: false,
  lastEndedAt: null,
  awaitingName: false,
  scoreSubmitted: false,
  commitExpanded: false,
  commitCache: [],
  filterCurrentBuild: true,
  filterMyScores: false,
  scoreSort: 'score',
  timeScale: 1,
  fps: 0,
  showDamageByPower: true,
  showFps: true,
  pendingPowerChoices: 0,
  powerModalOpen: false,
  currentPowerOptions: [],
  currentTalentOptions: [],
  currentSelection: null, // { kind: 'power'|'talent', name }
  passRemaining: PASS_LIMIT_PER_MODAL,
  lastHitSpecial: null,
  lastVampireHeal: 0,
  lastBossLevelSpawned: 0,
  damageByPower: {}
};

const bonusState = {};

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeKeyValue(value) {
  if (!value) return '';
  const raw = `${value}`.trim();
  if (!raw) return '';
  const lower = raw.toLowerCase();
  if (raw === ' ') return 'space';
  if (lower === 'spacebar') return 'space';
  return lower;
}

function sanitizeKeyBindings(raw) {
  const next = { ...DEFAULT_KEYS };
  if (raw && typeof raw === 'object') {
    ['left', 'right', 'launch'].forEach((key) => {
      const val = (raw[key] || '').trim();
      if (val) next[key] = val;
    });
  }
  return next;
}

function clampPaddlePosition() {
  const { paddle } = state;
  const mirrorLevel = getTalentLevel('Mirror');
  const halfWidth = paddle.w * 0.5;
  const gap = 8;
  const minOffset = mirrorLevel >= 1 ? -halfWidth - gap : 0;
  const maxOffset = mirrorLevel >= 2 ? paddle.w + gap + halfWidth : paddle.w;

  // Bordures extérieures
  paddle.x = clamp(paddle.x, -minOffset, CONFIG.width - maxOffset);

  // Clamp final aux bords après ajustements
  paddle.x = clamp(paddle.x, -minOffset, CONFIG.width - maxOffset);
}

function computeHudSignature() {
  const dmgEntries = Object.entries(state.damageByPower || {})
    .sort((a, b) => a[0].localeCompare(b[0]));
  return JSON.stringify({
    score: state.score,
    lives: state.lives,
    level: state.level,
    playerLevel: state.playerLevel,
    xp: state.xp,
    speedTimer: state.speedTimer,
    xpNeeded: state.xpNeeded,
    timeScale: state.timeScale,
    playerName: state.playerName,
    powers: state.powers.map((p) => `${p.name}:${p.level}`).join('|'),
    talents: state.talents.map((t) => `${t.name}:${t.level}`).join('|'),
    damage: dmgEntries.map(([k, v]) => `${k}:${v}`).join('|'),
    showDamageByPower: state.showDamageByPower,
    showFps: state.showFps,
    fps: state.fps,
    paused: state.paused,
    manualPause: state.manualPause
  });
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
    w: Math.max(1, safeNumber(brick.w, CONFIG.brickHeight)),
    h: Math.max(1, safeNumber(brick.h, CONFIG.brickHeight)),
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
    curseSpreadAt: safeNumber(brick.curseSpreadAt, null),
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

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if ([1, 2, 3, 5].includes(Number(data.timeScale))) {
      setTimeScale(Number(data.timeScale));
    }
  if (typeof data.autoPlay === 'boolean') {
    state.autoPlay = data.autoPlay;
    autoBtn.textContent = state.autoPlay ? 'Disable auto' : 'Enable auto';
  }
  if (typeof data.commitExpanded === 'boolean') {
    state.commitExpanded = data.commitExpanded;
    updateCommitChevron();
  }
  if (typeof data.topScoresExpanded === 'boolean') {
    state.topScoresExpanded = data.topScoresExpanded;
    updateScoreChevron();
  }
  if (typeof data.suggestionExpanded === 'boolean') {
    state.suggestionExpanded = data.suggestionExpanded;
    updateSuggestionChevron();
    updateSuggestionVisibility();
  }
    if (typeof data.filterCurrentBuild === 'boolean') {
      state.filterCurrentBuild = data.filterCurrentBuild;
      if (scoreFilterCheckbox) scoreFilterCheckbox.checked = state.filterCurrentBuild;
    }
    if (typeof data.filterMyScores === 'boolean') {
      state.filterMyScores = data.filterMyScores;
      if (scoreFilterMineCheckbox) scoreFilterMineCheckbox.checked = state.filterMyScores;
    }
    if (typeof data.scoreSort === 'string') {
      state.scoreSort = data.scoreSort === 'date' ? 'date' : 'score';
      if (scoreSortSelect) scoreSortSelect.value = state.scoreSort;
    } else if (scoreSortSelect) {
      scoreSortSelect.value = state.scoreSort;
    }
    if (typeof data.showDamageByPower === 'boolean') {
      state.showDamageByPower = data.showDamageByPower;
      if (settingsDamageToggle) settingsDamageToggle.checked = state.showDamageByPower;
    } else if (settingsDamageToggle) {
      settingsDamageToggle.checked = state.showDamageByPower;
    }
    if (typeof data.showFps === 'boolean') {
      state.showFps = data.showFps;
      if (settingsFpsToggle) settingsFpsToggle.checked = state.showFps;
    } else if (settingsFpsToggle) {
      settingsFpsToggle.checked = state.showFps;
    }
    if (data.keyBindings) {
      state.keyBindings = sanitizeKeyBindings(data.keyBindings);
    }
    if (settingsLeftInput && settingsRightInput && settingsLaunchInput) {
      settingsLeftInput.value = state.keyBindings.left;
      settingsRightInput.value = state.keyBindings.right;
      settingsLaunchInput.value = state.keyBindings.launch;
    }
  } catch (_) {
    // ignore parsing/storage errors
  }
}

function savePreferences() {
  try {
    const payload = {
      timeScale: state.timeScale,
      autoPlay: state.autoPlay,
      commitExpanded: state.commitExpanded,
      topScoresExpanded: state.topScoresExpanded,
    suggestionExpanded: state.suggestionExpanded,
    filterCurrentBuild: state.filterCurrentBuild,
    filterMyScores: state.filterMyScores,
    scoreSort: state.scoreSort,
    showDamageByPower: state.showDamageByPower,
    showFps: state.showFps,
      keyBindings: state.keyBindings
    };
    localStorage.setItem(PREFS_KEY, JSON.stringify(payload));
  } catch (_) {
    // ignore storage errors
  }
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
  clearSession(); // on ne persiste plus la partie
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (_) {
    // ignore
  }
}

function loadSession() {
  clearSession(); // on nettoie les anciennes sauvegardes de partie
  return false;
}

function maybeSaveSession(nowMs) {
  // On ne sauvegarde plus l'état de la partie, seulement le nom via loadPlayerName/handleNameSubmit
  sessionDirty = false;
}

function openNameModal() {
  state.paused = true;
  state.awaitingName = true;
  nameModalBackdrop.classList.add('open');
  setTimeout(() => playerNameInput?.focus(), 0);
  markSessionDirty();
  refreshPauseState();
}

function closeNameModal() {
  nameModalBackdrop.classList.remove('open');
  state.awaitingName = false;
  if (!state.powerModalOpen) {
    refreshPauseState();
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
  openInfoModal();
}

function openInfoModal() {
  if (!infoModalBackdrop) return;
  state.paused = true;
  state.infoOpen = true;
  infoModalBackdrop.classList.add('open');
  refreshPauseState();
}

function closeInfoModal() {
  if (!infoModalBackdrop) return;
  infoModalBackdrop.classList.remove('open');
  state.infoOpen = false;
  if (!state.powerModalOpen && !state.awaitingName) {
    refreshPauseState();
  }
}

function openCatalogModal() {
  if (!catalogModalBackdrop) return;
  state.paused = true;
  state.catalogOpen = true;
  renderCatalogLists();
  catalogModalBackdrop.classList.add('open');
  refreshPauseState();
}

function closeCatalogModal() {
  if (!catalogModalBackdrop) return;
  catalogModalBackdrop.classList.remove('open');
  state.catalogOpen = false;
  if (state.catalogReturnToPower && state.pendingPowerChoices > 0) {
    state.catalogReturnToPower = false;
    // Re-open the power modal with the same options the player was viewing.
    state.paused = true;
    state.powerModalOpen = true;
    renderPowerModal(state.currentPowerOptions, state.currentTalentOptions);
    powerModalBackdrop.classList.add('open');
    refreshPauseState();
  } else if (!state.powerModalOpen && !state.awaitingName) {
    refreshPauseState();
  }
}

function openSettingsModal() {
  if (!settingsModalBackdrop) return;
  state.paused = true;
  state.settingsOpen = true;
  settingsLeftInput.value = state.keyBindings.left;
  settingsRightInput.value = state.keyBindings.right;
  settingsLaunchInput.value = state.keyBindings.launch;
  if (settingsDamageToggle) settingsDamageToggle.checked = !!state.showDamageByPower;
  if (settingsFpsToggle) settingsFpsToggle.checked = !!state.showFps;
  settingsModalBackdrop.classList.add('open');
  setTimeout(() => settingsLeftInput?.focus(), 0);
  refreshPauseState();
}

function closeSettingsModal() {
  if (!settingsModalBackdrop) return;
  settingsModalBackdrop.classList.remove('open');
  state.settingsOpen = false;
  if (!state.powerModalOpen && !state.awaitingName) {
    refreshPauseState();
  }
}

function applySettingsBindings() {
  const left = (settingsLeftInput?.value || '').trim();
  const right = (settingsRightInput?.value || '').trim();
  const launch = (settingsLaunchInput?.value || '').trim();
  state.keyBindings = sanitizeKeyBindings({
    left,
    right,
    launch
  });
  if (settingsDamageToggle) {
    state.showDamageByPower = !!settingsDamageToggle.checked;
  }
  if (settingsFpsToggle) {
    state.showFps = !!settingsFpsToggle.checked;
  }
  savePreferences();
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
  const plumeLevel = getTalentLevel('Feather');
  const mult = 1 + 0.1 * plumeLevel;
  return (isSpecial ? base : base * CONFIG.standardBallSpeedMultiplier) * mult;
}

function getBallBaseDamage(ball) {
  return ball?.specialPower === 'Metal' ? 3 : 1;
}

function getBallRadius(isSpecial) {
  const base = CONFIG.ballRadius;
  return isSpecial ? base : base * CONFIG.standardBallRadiusMultiplier;
}

function getMaxLives() {
  return CONFIG.maxLives + 5 * getTalentLevel('Endurance');
}

function clampLivesToMax() {
  const maxLife = getMaxLives();
  if (state.lives > maxLife) {
    state.lives = maxLife;
  }
}

function getPaddleSpeed() {
  const level = getTalentLevel('Boots');
  const mult = 1 + 0.1 * level;
  return CONFIG.paddleSpeed * mult;
}

function getPaddleMaxSpeed() {
  const level = getTalentLevel('Boots');
  const mult = 1 + 0.1 * level;
  return CONFIG.paddleMaxSpeed * mult;
}

function getCooldowns(nextIsSpecial) {
  const level = getTalentLevel('Gloves');
  const mult = 1 / (1 + 0.1 * level);
  const base = nextIsSpecial ? CONFIG.specialShotCooldownMs : CONFIG.normalShotCooldownMs;
  return base * mult;
}

function getPaddleWidth() {
  const level = getTalentLevel('Paddle');
  const mult = 1 + 0.2 * level;
  return CONFIG.paddleWidth * mult;
}

function getPowerDef(name) {
  return ALL_POWER_DEFS.find((p) => p.name === name) || { name, maxLevel: 1 };
}

function getTalentDef(name) {
  return TALENT_DEFS.find((t) => t.name === name) || { name, maxLevel: 1 };
}

function getPowerDescription(name) {
  switch (name) {
    case 'Fire':
      return {
        plain: 'Spreads the hit to 2 nearby bricks (e.g. 3 damage becomes 3x2)',
        rich: 'Spreads to <span class="power-desc-accent">2</span> nearby bricks <span class="power-desc-muted">(e.g. <span class="power-desc-accent">3</span> damage becomes <span class="power-desc-accent">3×2</span>)</span>'
      };
    case 'Ice':
      return {
        plain: 'Freezes/slows the brick for 3s (speed 0 then 50%)',
        rich: 'Freeze/slow for <span class="power-desc-accent">3s</span> <span class="power-desc-muted">(0% then 50%)</span>'
      };
    case 'Poison':
      return {
        plain: 'Deals 1 damage every 1s until destruction',
        rich: 'Deals <span class="power-desc-accent">1</span> damage every <span class="power-desc-accent">1s</span> until destroyed'
      };
    case 'Metal':
      return {
        plain: 'Greatly increased damage (+150%: 3 damage instead of 1)',
        rich: 'Damage <span class="power-desc-accent">+150%</span> <span class="power-desc-muted">(3 instead of 1)</span>'
      };
    case 'Vampire':
      return {
        plain: 'Destroying a brick heals 1 life (max 1/s). If it survives, heal 1 life every 3s while marked.',
        rich: 'Destroying a brick heals <span class="power-desc-accent">+1 life</span> <span class="power-desc-muted">(max 1/s)</span>. If it survives, you heal <span class="power-desc-accent">+1 life</span> every <span class="power-desc-accent">3s</span> while it stays marked.'
      };
    case 'Light':
      return {
        plain: 'Stuns the hit brick and 3 nearby for 0.75s',
        rich: 'Stuns hit brick + <span class="power-desc-accent">3 nearby</span> for <span class="power-desc-accent">0.75s</span>'
      };
    case 'Thorns':
      return {
        plain: 'Deals 1.5 damage after 1s and 0.5 damage after 2s',
        rich: 'Deals <span class="power-desc-accent">+1.5</span> damage at <span class="power-desc-accent">t+1s</span> then <span class="power-desc-accent">+0.5</span> at <span class="power-desc-accent">t+2s</span>'
      };
    case 'Curse':
      return {
        plain: 'Deals 2 delayed damage after 3s and spreads to 1 nearby brick after 1s if the target survives',
        rich: 'Deals <span class=\"power-desc-accent\">+2</span> damage at <span class=\"power-desc-accent\">t+3s</span> and spreads to <span class=\"power-desc-accent\">1 nearby brick</span> after <span class=\"power-desc-accent\">1s</span> if the target lives'
      };
    case 'Wind':
      return {
        plain: 'Ball pierces up to 3 bricks then returns to the paddle (1 hit per brick)',
        rich: 'Ball pierces <span class="power-desc-accent">up to 3 bricks</span> then returns to the paddle <span class="power-desc-muted">(1 hit per brick)</span>'
      };
    case 'Sun':
      return {
        plain: 'Fusion of Fire + Light: spreads to 2 nearby bricks and stuns the hit brick plus 3 nearby for 0.75s',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Fire + Light</span>: spreads to <span class="power-desc-accent">2</span> nearby bricks and stuns the target + <span class="power-desc-accent">3 nearby</span> for <span class="power-desc-accent">0.75s</span>'
      };
    case 'Tundra':
      return {
        plain: 'Fusion of Ice + Poison: freezes 2 nearby bricks and applies poison ticks (1 dmg/s) while frozen',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Ice + Poison</span>: freezes <span class="power-desc-accent">2 nearby</span> and applies poison <span class="power-desc-accent">1 dmg/s</span> during freeze'
      };
    case 'Forge':
      return {
        plain: 'Fusion of Fire + Metal: cone splash on 3 targets with +150% damage',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Fire + Metal</span>: cone splash on <span class="power-desc-accent">3 targets</span> with <span class="power-desc-accent">+150% damage</span>'
      };
    case 'Leech':
      return {
        plain: 'Fusion of Vampire + Poison: damage over time heals 0.5 HP per tick',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Vampire + Poison</span>: DoT heals <span class="power-desc-accent">0.5 HP</span> each tick'
      };
    case 'Prism':
      return {
        plain: 'Fusion of Light + Ice: stuns the target and chains a short stun to 2 nearby',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Ice</span>: stuns target and chains a brief stun to <span class="power-desc-accent">2 nearby</span>'
      };
    case 'Spikes':
      return {
        plain: 'Fusion of Thorns + Metal: reflects 2 damage when a brick hits the paddle and adds +1 on each rebound',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Thorns + Metal</span>: reflects <span class="power-desc-accent">2 dmg</span> on paddle hits and adds <span class="power-desc-accent">+1 dmg</span> on each rebound'
      };
    case 'Aurora':
      return {
        plain: 'Fusion of Light + Curse: curses in a small area and extends the stun duration by 1s',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Curse</span>: curses in a small area and extends stun by <span class="power-desc-accent">+1s</span>'
      };
    case 'Frostbite':
      return {
        plain: 'Fusion of Ice + Thorns: freezes and applies thorn ticks during the freeze',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Ice + Thorns</span>: freezes and applies thorn ticks while frozen'
      };
    case 'Gravebound':
      return {
        plain: 'Fusion of Vampire + Thorns: thorn ticks heal 0.5 HP and extend thorn duration',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Vampire + Thorns</span>: thorn ticks heal <span class="power-desc-accent">0.5 HP</span> and extend duration'
      };
    case 'Storm':
      return {
        plain: 'Fusion of Light + Metal: chains to 2 nearby with +50% damage and a brief stun',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Metal</span>: chains to <span class="power-desc-accent">2 nearby</span> with <span class="power-desc-accent">+50% damage</span> and brief stun'
      };
    case 'Rust':
      return {
        plain: 'Fusion of Metal + Poison: applies poison and a rust debuff (+20% damage taken)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Metal + Poison</span>: poison + rust (<span class="power-desc-accent">+20% damage taken</span>)'
      };
    case 'Echo':
      return {
        plain: 'Fusion of Light + Mirror: adds a small stun on ricochets and a bonus rebound',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Mirror</span>: small stun on ricochets and one bonus rebound'
      };
    case 'Bramble':
      return {
        plain: 'Fusion of Thorns + Feather: faster thorn ticks and slight ball speed on return',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Thorns + Feather</span>: faster thorn ticks, slight ball speed boost on return'
      };
    case 'Radiance':
      return {
        plain: 'Fusion of Light + Endurance: brief stun and grants +2 temporary max HP on hit',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Endurance</span>: stun and gain <span class="power-desc-accent">+2 temp max HP</span> on hit'
      };
    case 'Shard':
      return {
        plain: 'Fusion of Ice + Gloves: fires ice shards in a cone (1 damage each)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Ice + Gloves</span>: cone of ice shards (<span class="power-desc-accent">1 dmg</span> each)'
      };
    case 'Plaguefire':
      return {
        plain: 'Fusion of Fire + Curse: applies fire splash and a curse that can spread to 2',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Fire + Curse</span>: fire splash + curse that can spread to <span class="power-desc-accent">2</span>'
      };
    case 'Jetstream':
      return {
        plain: 'Fusion of Wind + Scope: pierces 3 bricks with light auto-steer, then snaps back faster',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Wind + Scope</span>: pierces <span class="power-desc-accent">3 bricks</span> with light auto-steer, then <span class="power-desc-accent">snaps back faster</span>'
      };
    default:
      return { plain: '', rich: '' };
  }
}

function getTalentDescription(name) {
  switch (name) {
    case 'Boots':
      return {
        plain: 'Increases paddle speed by 10% per level',
        rich: 'Paddle speed <span class="power-desc-accent">+10%</span> per level'
      };
    case 'Feather':
      return {
        plain: 'Increases ball speed by 10% per level',
        rich: 'Ball speed <span class="power-desc-accent">+10%</span> per level'
      };
    case 'Gloves':
      return {
        plain: 'Increases fire rate by 10% per level',
        rich: 'Fire rate <span class="power-desc-accent">+10%</span> per level'
      };
    case 'Paddle':
      return {
        plain: 'Increases paddle width by 20% per level',
        rich: 'Paddle width <span class=\"power-desc-accent\">+20%</span> per level'
      };
    case 'Mirror':
      return {
        plain: 'Adds half-paddles: left at level 1, right at level 2',
        rich: 'Adds half-paddles <span class=\"power-desc-accent\">left</span> (Lv1) then <span class=\"power-desc-accent\">right</span> (Lv2)'
      };
    case 'Endurance':
      return {
        plain: 'Increases max HP by 5 per level',
        rich: 'Max HP <span class=\"power-desc-accent\">+5</span> per level'
      };
    case 'Scope':
      return {
        plain: 'Reduces aim jitter cone by 1° per level (more precise shots)',
        rich: 'Aim jitter cone <span class=\"power-desc-accent\">-1°</span> per level <span class=\"power-desc-muted\">(more precise)</span>'
      };
    case 'Momentum':
      return {
        plain: 'After each rebound, ball speed +5% per level (resets on next launch)',
        rich: 'After each rebound, ball speed <span class=\"power-desc-accent\">+5%</span> per level <span class=\"power-desc-muted\">(resets on next launch)</span>'
      };
    case 'Resilience':
      return {
        plain: 'After losing a life: 1s invulnerable, paddle speed +10% for 4s (+1s per level)',
        rich: 'After losing a life: <span class=\"power-desc-accent\">1s</span> invulnerable, paddle speed <span class=\"power-desc-accent\">+10%</span> for <span class=\"power-desc-accent\">4s</span> <span class=\"power-desc-muted\">(+1s per level)</span>'
      };
    case 'Surge':
      return {
        plain: 'On new stage: ball speed +15% for 3s (+1s per level)',
        rich: 'On stage start: ball speed <span class=\"power-desc-accent\">+15%</span> for <span class=\"power-desc-accent\">3s</span> <span class=\"power-desc-muted\">(+1s per level)</span>'
      };
    default:
      return { plain: '', rich: '' };
  }
}

function getPowerLevel(name) {
  const existing = state.powers.find((p) => p.name === name);
  return existing ? existing.level : 0;
}

function getFusionDef(name) {
  return FUSION_DEFS.find((f) => f.name === name);
}

function isTalentName(name) {
  return TALENT_DEFS.some((t) => t.name === name);
}

function fusionKind(fusion) {
  if (!fusion?.fusion) return 'power';
  const ingredients = fusion.ingredients || [];
  const allTalents = ingredients.length > 0 && ingredients.every(isTalentName);
  return allTalents ? 'talent' : 'power';
}

function hasFusionIngredients(fusion) {
  if (!fusion || !Array.isArray(fusion.ingredients)) return false;
  // Require each ingredient to be at max level.
  return fusion.ingredients.every((n) => {
    const powerLv = getPowerLevel(n);
    const talentLv = getTalentLevel(n);
    const powerMax = getPowerDef(n).maxLevel || 1;
    const talentMax = getTalentDef(n).maxLevel || 1;
    const level = Math.max(powerLv, talentLv);
    const max = isTalentName(n) ? talentMax : powerMax;
    return level >= max;
  });
}

function getTalentLevel(name) {
  const existing = state.talents.find((t) => t.name === name);
  return existing ? existing.level : 0;
}

function hasPowerSlotFor(name) {
  const fusion = getFusionDef(name);
  const kind = fusion ? fusionKind(fusion) : 'power';
  if (kind === 'talent') return false;
  if (getPowerLevel(name) > 0) return true; // upgrading existing power ignores slot cap
  const powerCount = state.powers.length;
  if (!fusion) return powerCount < MAX_POWERS;
  const consumed = fusion.ingredients.filter((n) => !isTalentName(n)).length;
  return powerCount - consumed + 1 <= MAX_POWERS;
}

function hasTalentSlotFor(name) {
  const fusion = getFusionDef(name);
  const kind = fusion ? fusionKind(fusion) : 'talent';
  if (kind !== 'talent') return false;
  if (getTalentLevel(name) > 0) return true; // upgrading existing talent ignores slot cap
  const talentCount = state.talents.length;
  if (!fusion) return talentCount < MAX_TALENTS;
  const consumed = fusion.ingredients.filter((n) => isTalentName(n)).length;
  return talentCount - consumed + 1 <= MAX_TALENTS;
}

function canUpgradePower(name) {
  const def = getPowerDef(name);
  const fusion = getFusionDef(name);
  if (fusion && fusionKind(fusion) === 'talent') return false;
  if (fusion && !hasFusionIngredients(fusion)) return false;
  if (!hasPowerSlotFor(name)) return false;
  return getPowerLevel(name) < def.maxLevel;
}

function canUpgradeTalent(name) {
  const def = getTalentDef(name);
  const fusion = getFusionDef(name);
  if (fusion && fusionKind(fusion) !== 'talent') return false;
  if (fusion && !hasFusionIngredients(fusion)) return false;
  if (!hasTalentSlotFor(name)) return false;
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
  const fusionDef = getFusionDef(name);
  if (fusionDef?.color) return fusionDef.color;
  switch (name) {
    case 'Wind':
      return 'rgba(125, 211, 252, 0.35)';
    case 'Fire':
      return 'rgba(255, 215, 0, 0.35)';
    case 'Ice':
      return 'rgba(96, 165, 250, 0.35)';
    case 'Poison':
      return 'rgba(52, 211, 153, 0.35)';
    case 'Metal':
      return 'rgba(226, 232, 240, 0.35)';
    case 'Vampire':
      return 'rgba(239, 68, 68, 0.35)';
    case 'Light':
      return 'rgba(255, 255, 255, 0.35)';
    case 'Thorns':
      return 'rgba(120, 72, 48, 0.35)';
    case 'Curse':
      return 'rgba(139, 92, 246, 0.35)';
    default:
      return 'rgba(255,255,255,0.25)';
  }
}

function withAimJitter(vx, vy) {
  const angle = Math.atan2(vy, vx);
  const jitter = degToRad(Math.max(0, CONFIG.aimJitterDeg - getTalentLevel('Scope')));
  const offset = (Math.random() * 2 - 1) * jitter;
  const speed = Math.hypot(vx, vy);
  const nx = Math.cos(angle + offset);
  const ny = Math.sin(angle + offset);
  return { vx: nx * speed, vy: ny * speed };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const container = canvas.parentElement;
  const viewW = Math.floor((container?.clientWidth || window.innerWidth) * 0.9);
  const viewH = Math.floor(window.innerHeight * 0.9);
  const scale = Math.min(viewW / CONFIG.width, viewH / CONFIG.height);
  const cssW = CONFIG.width * scale;
  const cssH = CONFIG.height * scale;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  hudBuffer.width = CONFIG.width;
  hudBuffer.height = CONFIG.height;
}

function computeBrickLayout() {
  const { brickCols, brickPadding, sideMargin } = CONFIG;
  const baseCols = brickCols + 2; // largeur héritée d'un layout plus large
  const brickWidthBase = (CONFIG.width - sideMargin * 2 - brickPadding * (baseCols - 1)) / baseCols;
  const brickWidth = brickWidthBase * 0.84375; // largeur agrandie à nouveau (~1.5x de plus)
  const totalWidth = brickCols * brickWidth + brickPadding * (brickCols - 1);
  const startX = (CONFIG.width - totalWidth) / 2;
  return { brickWidth, startX };
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
  const availablePowers = ALL_POWER_DEFS
    .filter((p) => fusionKind(p) === 'power')
    .map((p) => p.name)
    .filter((name) => canUpgradePower(name));
  const availableTalents = [...TALENT_DEFS, ...FUSION_DEFS.filter((f) => fusionKind(f) === 'talent')]
    .map((t) => t.name)
    .filter((name) => canUpgradeTalent(name));

  if (!availablePowers.length && !availableTalents.length) {
    state.pendingPowerChoices = 0;
    refreshPauseState();
    return;
  }

  const powerOptions = sampleOptions(availablePowers, 4);
  const talentOptions = sampleOptions(availableTalents, 3);
  state.currentPowerOptions = powerOptions;
  state.currentTalentOptions = talentOptions;
  renderPowerModal(powerOptions, talentOptions);
  state.paused = true;
  state.powerModalOpen = true;
  state.currentSelection = null;
  powerModalBackdrop.classList.add('open');
  refreshPauseState();
}

function handlePowerSelect(powerName) {
  selectPowerOrTalent({ kind: 'power', name: powerName });
}

function applySelection(selection) {
  if (!selection) return;
  if (selection.kind === 'power') {
    return applyPower(selection.name);
  }
  if (selection.kind === 'talent') {
    return applyTalent(selection.name);
  }
}

function applyPower(powerName) {
  const def = getPowerDef(powerName);
  const existing = state.powers.find((p) => p.name === powerName);
  const fusion = getFusionDef(powerName);
  if (fusion && fusionKind(fusion) === 'talent') return; // route talent fusions elsewhere
  const powerCount = state.powers.length;
  const consumedPower = fusion ? fusion.ingredients.filter((n) => !isTalentName(n)).length : 0;
  if (!existing && !fusion && powerCount >= MAX_POWERS) return;
  if (!existing && fusion && powerCount - consumedPower + 1 > MAX_POWERS) return;
  let newLevel = 1;
  if (existing) {
    if (existing.level >= def.maxLevel) {
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
      closePowerModal();
      refreshPauseState();
      if (state.pendingPowerChoices > 0) tryOpenPowerModal();
      return;
    }
    existing.level = Math.min(existing.level + 1, def.maxLevel);
    newLevel = existing.level;
  } else {
    state.powers.push({ name: powerName, level: 1 });
    if (fusion && Array.isArray(fusion.ingredients)) {
      // Consumes ingredients when picking the fusion
      state.powers = state.powers.filter((p) => !fusion.ingredients.includes(p.name));
      state.talents = state.talents.filter((t) => !fusion.ingredients.includes(t.name));
      state.specialPocket = state.specialPocket.filter((p) => !fusion.ingredients.includes(p));
    }
  }
  if (newLevel <= 2) {
    state.specialPocket.push(powerName);
  }
  clampLivesToMax();
  state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  closePowerModal();
  if (state.pendingPowerChoices > 0) {
    tryOpenPowerModal();
  } else {
    refreshPauseState();
  }
  markSessionDirty();
}

function selectPowerOrTalent(selection) {
  if (!selection || !selection.name) return;
  state.currentSelection = selection;
  const highlight = (btnList, key, name) => {
    btnList.forEach((btn) => {
      if (btn.dataset[key] === name) {
        btn.classList.add('selected');
        btn.classList.toggle('power', selection.kind === 'power');
        const isFusion = selection.kind === 'power' && Boolean(getFusionDef(selection.name));
        btn.classList.toggle('fusion', isFusion);
        btn.classList.toggle('talent', selection.kind === 'talent' && !isFusion);
      } else {
        btn.classList.remove('selected');
        btn.classList.remove('power', 'fusion', 'talent');
      }
    });
  };
  if (selection.kind === 'power') {
    highlight(powerButtons, 'power', selection.name);
    highlight(talentButtons, 'talent', '');
  } else if (selection.kind === 'talent') {
    highlight(powerButtons, 'power', '');
    highlight(talentButtons, 'talent', selection.name);
  }
  if (powerConfirmBtn) {
    powerConfirmBtn.disabled = false;
  }
}

function handleTalentSelect(talentName) {
  selectPowerOrTalent({ kind: 'talent', name: talentName });
}

function handlePowerConfirm() {
  if (!state.currentSelection) return;
  const sel = state.currentSelection;
  if (sel.kind === 'power') {
    applyPower(sel.name);
  } else if (sel.kind === 'talent') {
    applyTalent(sel.name);
  }
}

function applyTalent(talentName) {
  const def = getTalentDef(talentName);
  const existing = state.talents.find((t) => t.name === talentName);
  const fusion = getFusionDef(talentName);
  const kind = fusion ? fusionKind(fusion) : 'talent';
  if (fusion && kind !== 'talent') return; // should be handled as power fusion
  const talentCount = state.talents.length;
  const consumedTalents = fusion ? fusion.ingredients.filter((n) => isTalentName(n)).length : 0;
  if (!existing && !fusion && talentCount >= MAX_TALENTS) return;
  if (!existing && fusion && talentCount - consumedTalents + 1 > MAX_TALENTS) return;
  if (existing) {
    if (existing.level >= def.maxLevel) {
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    } else {
      existing.level = Math.min(existing.level + 1, def.maxLevel);
      state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    }
  } else {
    state.talents.push({ name: talentName, level: 1 });
    if (fusion && Array.isArray(fusion.ingredients)) {
    state.powers = state.powers.filter((p) => !fusion.ingredients.includes(p.name));
    state.talents = state.talents.filter((t) => !fusion.ingredients.includes(t.name));
    }
    state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  }
  clampLivesToMax();
  closePowerModal();
  if (state.pendingPowerChoices > 0) {
    tryOpenPowerModal();
  } else {
    refreshPauseState();
  }
  markSessionDirty();
}

function handlePowerPass() {
  if (!state.powerModalOpen || state.pendingPowerChoices <= 0) {
    return;
  }
  if (state.passRemaining <= 0) return;
  state.currentSelection = null;
  state.passRemaining = Math.max(0, state.passRemaining - 1);
  state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  closePowerModal();
  if (state.pendingPowerChoices > 0) {
    tryOpenPowerModal();
  } else {
    refreshPauseState();
  }
  markSessionDirty();
}

function closePowerModal() {
  powerModalBackdrop.classList.remove('open');
  state.powerModalOpen = false;
  state.currentSelection = null;
  powerButtons.forEach((btn) => btn.classList.remove('selected'));
  talentButtons.forEach((btn) => btn.classList.remove('selected'));
  if (powerConfirmBtn) powerConfirmBtn.disabled = true;
  if (powerPassBtn) {
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.textContent = `Pass (${state.passRemaining})`;
  }
}

function renderPowerModal(powerOptions, talentOptions) {
  if (powerPassBtn) {
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.textContent = `Pass (${state.passRemaining})`;
  }
  powerButtons.forEach((btn, idx) => {
    const power = powerOptions[idx];
    if (power) {
      btn.style.display = 'block';
      const currentLv = getPowerLevel(power);
      const nextLv = nextPowerLevel(power);
      const fusion = getFusionDef(power);
      if (fusion) {
        btn.style.background = 'linear-gradient(135deg, #2dd4bf, #16a34a)';
        btn.style.border = '1px solid rgba(16, 185, 129, 0.6)';
        btn.style.color = '#0b172a';
      } else {
        btn.style.background = '';
        btn.style.border = '';
        btn.style.color = '';
      }
      const label = currentLv === 0
        ? fusion ? `${power} (Fusion)` : `${power} (New)`
        : `${power} (Lv. ${currentLv} → ${nextLv})`;
      btn.textContent = label;
      btn.dataset.power = power;
      btn.title = getPowerDescription(power).plain;
      const showPreview = () => updatePowerPreview(power, label, 'power', fusion);
      btn.onmouseenter = showPreview;
      btn.onpointerenter = showPreview;
      btn.ontouchstart = showPreview;
      btn.onfocus = showPreview;
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
      const showPreview = () => updatePowerPreview(talent, label, 'talent');
      btn.onmouseenter = showPreview;
      btn.onpointerenter = showPreview;
      btn.ontouchstart = showPreview;
      btn.onfocus = showPreview;
      btn.onclick = () => handleTalentSelect(talent);
    } else {
      btn.style.display = 'none';
    }
  });

  const firstPower = powerOptions && powerOptions.find(Boolean);
  const firstTalent = talentOptions && talentOptions.find(Boolean);
  const powerSlots = `${state.powers.length}/${MAX_POWERS} slots`;
  const talentSlots = `${state.talents.length}/${MAX_TALENTS} slots`;
  if (powerSlotsLabel) powerSlotsLabel.textContent = powerSlots;
  if (talentSlotsLabel) talentSlotsLabel.textContent = talentSlots;
  if (firstPower) {
    const label = powerButtons.find((b) => b.dataset.power === firstPower)?.textContent || firstPower;
    updatePowerPreview(firstPower, label, 'power', getFusionDef(firstPower));
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

function updatePowerPreview(name, labelOverride, kind = 'power', fusionDef = null) {
  if (!name) return;
  const isPower = kind === 'power';
  const desc = isPower ? getPowerDescription(name) : getTalentDescription(name);
  const color = isPower ? getPowerColor(name) : 'rgba(148, 163, 184, 0.4)';
  const tag = fusionDef ? 'Fusion · ' : '';
  if (powerPreviewName) powerPreviewName.textContent = labelOverride || `${tag}${name}`;
  if (powerPreviewDesc) powerPreviewDesc.innerHTML = desc.rich || desc.plain || 'No details available.';
  if (powerPreviewIcon) {
    const media = MEDIA_BY_NAME[name];
    if (media?.imageUrl) {
      powerPreviewIcon.textContent = '';
      powerPreviewIcon.style.background = `${color.replace('0.35', '0.55')} url(${media.imageUrl}) center/cover no-repeat`;
    } else {
      powerPreviewIcon.textContent = name.slice(0, 2).toUpperCase();
      powerPreviewIcon.style.background = color.replace('0.35', '0.55');
    }
    powerPreviewIcon.style.boxShadow = `0 0 12px ${color}`;
  }
}

function applyLightStun(target, ball, now) {
  const duration = 750;
  const color = getPowerColor('Light');
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
  const { brickCols, brickPadding, brickHeight, brickTopOffset, brickRowFillRate } = CONFIG;
  const { brickWidth, startX } = computeBrickLayout();

  // Si un boss est proche du haut, on évite de spawner une rangée pour ne pas chevaucher.
  const boss = getAliveBoss();
  if (boss && boss.y < brickHeight * 3) {
    return;
  }

  const bricks = [];
  let spawned = 0;
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
    bricks.push({
      x,
      y,
      w: brickWidth,
      h: brickHeight,
      hue: 200 + state.rowIndex * 12, // couleur figée à la création
      alive: true,
      row: state.rowIndex,
      type: 'normal',
      hp,
      deathTime: null,
      flashTime: null,
      slowUntil: 0,
      freezeUntil: 0,
      poisonNextTick: 0,
      poisonActive: false,
      thornNextTick: 0,
      thornSecondTick: 0,
      thornActive: false,
      thornExpire: 0,
      rustUntil: 0,
      gravebound: false,
      leechActive: false,
      curseTick: null,
      curseSpreadAt: null,
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
    bricks.push({
      x,
      y,
      w: brickWidth,
      h: brickHeight,
      hue: 200 + state.rowIndex * 12, // couleur figée à la création
      alive: true,
      row: state.rowIndex,
      type: 'normal',
      hp,
      deathTime: null,
      flashTime: null,
      slowUntil: 0,
      freezeUntil: 0,
      poisonNextTick: 0,
      poisonActive: false,
      thornNextTick: 0,
      thornSecondTick: 0,
      thornActive: false,
      thornExpire: 0,
      rustUntil: 0,
      gravebound: false,
      leechActive: false,
      curseTick: null,
      curseSpreadAt: null,
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
    curseSpreadAt: null,
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
    specialPower,
    windPierceLeft: specialPower === 'Wind' || specialPower === 'Jetstream' ? 3 : 0
  });
}

function redirectBallToPaddle(ball, speedScale = 0.5) {
  const targetX = state.paddle.x + state.paddle.w / 2;
  const targetY = state.paddle.y - state.paddle.h;
  const dx = targetX - ball.x;
  const dy = targetY - ball.y;
  const dist = Math.hypot(dx, dy) || 1;
  const speed = getBallSpeed(Boolean(ball.specialPower)) * speedScale;
  ball.returnSpeed = speed;
  ball.vx = (dx / dist) * speed;
  ball.vy = (dy / dist) * speed;
  ball.returning = true;
  ball.reward = false;
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
  state.manualPause = false;
  state.paused = false;
  updatePauseButton();
  state.powers = [];
  state.talents = [];
  state.specialPocket = [];
  state.pendingPowerChoices = 0;
  state.powerModalOpen = false;
  state.currentPowerOptions = [];
  state.currentTalentOptions = [];
  state.lastHitSpecial = null;
  state.passRemaining = PASS_LIMIT_PER_MODAL;
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
    return parsed.slice(0, TOP_LIMIT).map((entry) => ({
      ...entry,
      build: entry.build || 'Old'
    }));
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
          player: state.playerName || 'Anonymous',
          score,
          stage: state.level,
          level: state.playerLevel,
          endedAt: new Date().toISOString(),
          build: BUILD_LABEL
        };
    scores.push(entry);
    scores.sort((a, b) => (b.score || 0) - (a.score || 0));
    const top = scores.slice(0, TOP_LIMIT);
    localStorage.setItem('brickidle_top_scores', JSON.stringify(top));
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
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ...payload, build: BUILD_LABEL })
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

function openScoreErrorModal(payload) {
  if (!scoreErrorModal) return;
  state.pendingScoreRetry = payload;
  scoreErrorModal.classList.add('open');
  setScoreErrorStatus('');
}

function closeScoreErrorModal() {
  if (!scoreErrorModal) return;
  scoreErrorModal.classList.remove('open');
  setScoreErrorStatus('');
}

async function fetchTopScoresFromBackend(limit = TOP_LIMIT) {
  if (scoreListEl) scoreListEl.textContent = 'Loading...';
  try {
    const res = await fetch(apiUrl(`/scores?limit=${limit}`), { headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      state.backendTopScores = data;
      renderTopScoresPanel();
    }
  } catch (err) {
    console.error('fetchTopScoresFromBackend failed', err);
    renderTopScoresPanel();
  }
}

async function fetchCommits() {
  if (!commitListEl) return;
  commitListEl.textContent = 'Loading...';
  try {
    const res = await fetch(apiUrl('/commits'), { headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('unexpected format');
    state.commitCache = data;
    renderCommitList();
  } catch (err) {
    console.error('fetchCommits failed', err);
    commitListEl.textContent = 'Unable to load commits.';
  }
}

function updateCommitChevron() {
  if (!commitChevron) return;
  commitChevron.textContent = state.commitExpanded ? '▼' : '►';
}

function updateScoreChevron() {
  if (!scoreChevron) return;
  scoreChevron.textContent = state.topScoresExpanded ? '▼' : '►';
}

function renderCommitList() {
  if (!commitListEl) return;
  commitListEl.innerHTML = '';
  const limit = state.commitExpanded ? 10 : 1;
  const commits = state.commitCache.slice(0, limit);
  if (!commits.length) {
    commitListEl.textContent = 'No commits.';
    return;
  }
  commits.forEach((c) => {
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
  updateCommitChevron();
}

function renderCatalogLists() {
  const renderList = (container, items, kind) => {
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item) => {
      const media = MEDIA_BY_NAME[item.name];
      const desc = kind === 'power'
        ? getPowerDescription(item.name)
        : kind === 'talent'
          ? getTalentDescription(item.name)
          : getPowerDescription(item.name);
      const el = document.createElement('div');
      el.className = 'catalog-item';
      const header = document.createElement('div');
      header.className = 'catalog-item-header';
      if (media?.imageUrl) {
        const img = document.createElement('img');
        img.className = 'catalog-thumb';
        img.src = media.imageUrl;
        img.alt = `${item.name} icon`;
        header.appendChild(img);
      }
      const titleWrap = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = item.name;
      if (media?.color) {
        title.style.color = media.color;
      }
      titleWrap.appendChild(title);
      if (Array.isArray(item.ingredients) && item.ingredients.length) {
        const ing = document.createElement('div');
        ing.className = 'slots-label';
        ing.textContent = item.ingredients.join(' + ');
        titleWrap.appendChild(ing);
      }
      header.appendChild(titleWrap);
      const p = document.createElement('p');
      p.textContent = formatDesc(desc);
      el.appendChild(header);
      el.appendChild(p);
      container.appendChild(el);
    });
  };
  renderList(catalogPowers, POWER_DEFS, 'power');
  renderList(catalogTalents, TALENT_DEFS, 'talent');
  renderList(catalogFusions, FUSION_DEFS, 'power');
}

function renderTopScoresPanel() {
  if (!scoreListEl) return;
  scoreListEl.innerHTML = '';
  const list = (state.backendTopScores && state.backendTopScores.length)
    ? state.backendTopScores
    : getTopScores();
  const filteredBuild = state.filterCurrentBuild
    ? list.filter((entry) => (entry.build || 'Old') === BUILD_LABEL)
    : list;
  const player = (state.playerName || '').trim();
  const filteredPlayer = state.filterMyScores && player
    ? filteredBuild.filter((entry) => (entry.player || '').trim() === player)
    : filteredBuild;
  if (state.filterMyScores && !player) {
    scoreListEl.textContent = 'Set a nickname to filter your scores.';
    return;
  }
  if (!filteredPlayer || filteredPlayer.length === 0) {
    scoreListEl.textContent = 'No scores.';
    return;
  }
  const filtered = [...filteredPlayer];
  const sortBy = state.scoreSort;
  filtered.sort((a, b) => {
    if (sortBy === 'date') {
      const da = Date.parse(a.endedAt || a.updatedAt || 0) || 0;
      const db = Date.parse(b.endedAt || b.updatedAt || 0) || 0;
      if (db !== da) return db - da;
    }
    const sa = Number(a.score) || 0;
    const sb = Number(b.score) || 0;
    if (sb !== sa) return sb - sa;
    const da = Date.parse(a.endedAt || a.updatedAt || 0) || 0;
    const db = Date.parse(b.endedAt || b.updatedAt || 0) || 0;
    return db - da;
  });
  let playerBest = null;
  if (player) {
    filtered.forEach((entry) => {
      if ((entry.player || '').trim() === player) {
        const sc = Number(entry.score) || 0;
        if (playerBest === null || sc > playerBest) playerBest = sc;
      }
    });
  }
  const limit = state.topScoresExpanded ? TOP_LIMIT : Math.min(3, TOP_LIMIT);
  filtered.slice(0, limit).forEach((entry, idx) => {
    const e = typeof entry === 'object' ? entry : { score: entry };
    const item = document.createElement('div');
    item.className = 'score-item';
    const name = document.createElement('div');
    name.className = 'score-player';
    const buildLabel = e.build ? e.build : 'Old';
    const playerName = (e.player || '???').slice(0, 12);
    name.textContent = `${idx + 1}. ${playerName} (${buildLabel})`;
    if (player && playerBest !== null && (e.player || '').trim() === player) {
      const sc = Number(e.score) || 0;
      if (sc === playerBest) {
        const badge = document.createElement('span');
        badge.className = 'score-badge';
        badge.textContent = 'PB';
        name.appendChild(badge);
      }
    }
    const pts = document.createElement('div');
    pts.className = 'score-points';
    pts.textContent = `${formatScore(e.score || 0)} pts`;
    item.appendChild(name);
    item.appendChild(pts);
    scoreListEl.appendChild(item);
  });
}

function setSuggestionStatus(text, isError = false) {
  if (!suggestionStatusEl) return;
  suggestionStatusEl.textContent = text || '';
  suggestionStatusEl.style.color = isError ? '#fca5a5' : '#cbd5e1';
}

function setScoreErrorStatus(text, isError = false) {
  if (!scoreErrorStatus) return;
  scoreErrorStatus.textContent = text || '';
  scoreErrorStatus.style.color = isError ? '#fca5a5' : '#cbd5e1';
}

function openScoreOkModal() {
  if (!scoreOkModal) return;
  scoreOkModal.classList.add('open');
}

function closeScoreOkModal() {
  if (!scoreOkModal) return;
  scoreOkModal.classList.remove('open');
}

function updateSuggestionChevron() {
  if (!suggestionChevron) return;
  suggestionChevron.textContent = state.suggestionExpanded ? '▼' : '►';
}

function updatePauseButton() {
  if (!pauseBtn) return;
  pauseBtn.textContent = state.manualPause ? 'Resume' : 'Pause';
}

function refreshPauseState() {
  const modalPause = state.powerModalOpen || state.awaitingName || state.infoOpen || state.catalogOpen || state.settingsOpen;
  state.paused = state.manualPause || modalPause;
}

function updateSuggestionVisibility() {
  if (suggestionForm) suggestionForm.style.display = state.suggestionExpanded ? 'grid' : 'none';
  if (suggestionListEl) suggestionListEl.style.display = state.suggestionExpanded ? 'grid' : 'none';
}

function renderSuggestionList() {
  if (!suggestionListEl) return;
  suggestionListEl.innerHTML = '';
  if (!state.suggestionExpanded) {
    suggestionListEl.textContent = '';
    updateSuggestionVisibility();
    return;
  }
  updateSuggestionVisibility();
  const list = Array.isArray(state.suggestions) ? state.suggestions : [];
  if (!list.length) {
    suggestionListEl.textContent = 'No suggestions yet.';
    return;
  }
  list.forEach((s) => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';

    const meta = document.createElement('div');
    meta.className = 'suggestion-meta';
    const cat = document.createElement('span');
    cat.className = `suggestion-pill ${s.category === 'bug' ? 'bug' : ''}`;
    cat.textContent = s.category === 'bug' ? 'Bug' : 'Feature';
    const author = document.createElement('span');
    const d = s.created_at ? new Date(s.created_at) : null;
    const dateLabel = d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
      : '';
    author.textContent = s.player || '???';
    meta.appendChild(cat);
    meta.appendChild(author);
    if (dateLabel) {
      const dot = document.createElement('span');
      dot.textContent = '· ' + dateLabel;
      meta.appendChild(dot);
    }
    const statusPill = document.createElement('span');
    statusPill.className = `suggestion-status-pill ${s.status || 'open'}`;
    const statusLabel = (s.status || 'open') === 'done'
      ? 'Done'
      : (s.status || 'open') === 'rejected'
        ? 'Rejected'
        : 'Open';
    statusPill.textContent = statusLabel;
    meta.appendChild(statusPill);

    const message = document.createElement('div');
    message.textContent = s.message || '';
    item.appendChild(meta);
    item.appendChild(message);

    if (IS_LOCALHOST && Number.isFinite(s.id)) {
      const actions = document.createElement('div');
      actions.className = 'suggestion-actions';
      const del = document.createElement('button');
      del.className = 'suggestion-delete';
      del.type = 'button';
      del.textContent = 'Delete';
      del.onclick = () => deleteSuggestion(s.id);
      const done = document.createElement('button');
      done.className = 'suggestion-delete';
      done.type = 'button';
      done.textContent = 'Done';
      done.style.color = '#bbf7d0';
      done.style.borderColor = 'rgba(34,197,94,0.6)';
      done.onclick = () => updateSuggestionStatus(s.id, 'done');
      const rejected = document.createElement('button');
      rejected.className = 'suggestion-delete';
      rejected.type = 'button';
      rejected.textContent = 'Rejected';
      rejected.style.color = '#fecdd3';
      rejected.style.borderColor = 'rgba(244,63,94,0.6)';
      rejected.onclick = () => updateSuggestionStatus(s.id, 'rejected');
      actions.appendChild(done);
      actions.appendChild(rejected);
      actions.appendChild(del);
      item.appendChild(actions);
    }
    suggestionListEl.appendChild(item);
  });
}

async function fetchSuggestionsFromBackend(limit = 8) {
  if (!suggestionListEl) return;
  state.loadingSuggestions = true;
  if (state.suggestionExpanded) suggestionListEl.textContent = 'Loading...';
  try {
    const res = await fetch(apiUrl(`/suggestions?limit=${limit}`), { headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      state.suggestions = data;
      renderSuggestionList();
      setSuggestionStatus('');
    }
  } catch (err) {
    console.error('fetchSuggestionsFromBackend failed', err);
    if (!state.suggestions.length) suggestionListEl.textContent = 'Unable to load suggestions right now.';
    setSuggestionStatus('Unable to load suggestions.', true);
  } finally {
    state.loadingSuggestions = false;
  }
}

async function submitSuggestionToBackend(payload) {
  if (!payload || state.submittingSuggestion) return null;
  state.submittingSuggestion = true;
  try {
    const res = await fetch(apiUrl('/suggestions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('submitSuggestionToBackend failed', err);
    return null;
  } finally {
    state.submittingSuggestion = false;
  }
}

async function deleteSuggestionFromBackend(id) {
  try {
    const res = await fetch(apiUrl(`/suggestions/${id}`), {
      method: 'DELETE',
      headers: { ...authHeaders() }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('deleteSuggestionFromBackend failed', err);
    return false;
  }
}

function deleteSuggestion(id) {
  if (!IS_LOCALHOST) return;
  deleteSuggestionFromBackend(id).then((ok) => {
    if (ok) {
      state.suggestions = state.suggestions.filter((s) => s.id !== id);
      renderSuggestionList();
    }
  });
}

async function updateSuggestionStatusBackend(id, status) {
  try {
    const res = await fetch(apiUrl(`/suggestions/${id}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('updateSuggestionStatusBackend failed', err);
    return null;
  }
}

function updateSuggestionStatus(id, status) {
  if (!IS_LOCALHOST) return;
  updateSuggestionStatusBackend(id, status).then((updated) => {
    if (updated) {
      state.suggestions = state.suggestions.map((s) => (s.id === id ? { ...s, status: updated.status } : s));
      renderSuggestionList();
    }
  });
}

function bindCommitToggle() {
  if (!commitToggle) return;
  commitToggle.addEventListener('click', () => {
    state.commitExpanded = !state.commitExpanded;
    updateCommitChevron();
    savePreferences();
    if (state.commitCache.length) {
      renderCommitList();
    } else {
      fetchCommits();
    }
  });
  updateCommitChevron();
}

function bindScoreToggle() {
  if (!scoreToggle) return;
  scoreToggle.addEventListener('click', () => {
    state.topScoresExpanded = !state.topScoresExpanded;
    updateScoreChevron();
    savePreferences();
    renderTopScoresPanel();
    if (state.topScoresExpanded && !state.backendTopScores.length) {
      fetchTopScoresFromBackend().catch(() => {});
    }
  });
  updateScoreChevron();
}

function bindScoreFilter() {
  if (!scoreFilterCheckbox) return;
  scoreFilterCheckbox.checked = state.filterCurrentBuild;
  scoreFilterCheckbox.addEventListener('change', (event) => {
    state.filterCurrentBuild = event.target.checked;
    savePreferences();
    renderTopScoresPanel();
  });
  if (scoreFilterMineCheckbox) {
    scoreFilterMineCheckbox.checked = state.filterMyScores;
    scoreFilterMineCheckbox.addEventListener('change', (event) => {
      state.filterMyScores = event.target.checked;
      savePreferences();
      renderTopScoresPanel();
    });
  }
  if (scoreSortSelect) {
    scoreSortSelect.value = state.scoreSort;
    scoreSortSelect.addEventListener('change', (event) => {
      const val = event.target.value === 'date' ? 'date' : 'score';
      state.scoreSort = val;
      savePreferences();
      renderTopScoresPanel();
    });
  }
}

function handleBackendScoreSubmit(payload) {
  state.pendingScoreRetry = payload;
  submitScoreToBackend(payload)
    ?.then((res) => {
      if (res) {
        state.pendingScoreRetry = null;
        fetchTopScoresFromBackend().catch(() => {});
        openScoreOkModal();
      } else {
        openScoreErrorModal(payload);
      }
    })
    .catch((err) => {
      console.error('handleBackendScoreSubmit error', err);
      openScoreErrorModal(payload);
    });
}

function handleSuggestionSubmit(event) {
  event.preventDefault();
  if (state.submittingSuggestion || state.loadingSuggestions) return;
  const message = (suggestionTextarea?.value || '').trim();
  const category = suggestionTypeSelect?.value === 'bug' ? 'bug' : 'feature';
  if (!state.playerName) {
    setSuggestionStatus('Pick a nickname before submitting.', true);
    openNameModal();
    return;
  }
  if (!message || message.length < 6) {
    setSuggestionStatus('Add a few details (6 characters min).', true);
    return;
  }
  const submitBtn = suggestionForm?.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  setSuggestionStatus('Sending...');
  const payload = {
    player: state.playerName,
    message: message.slice(0, 1000),
    category
  };
  submitSuggestionToBackend(payload)
    .then((created) => {
      if (created) {
        state.suggestions = [created, ...state.suggestions].slice(0, 10);
        renderSuggestionList();
        if (suggestionTextarea) suggestionTextarea.value = '';
        setSuggestionStatus('Thanks! Saved.');
      } else {
        setSuggestionStatus('Unable to send right now.', true);
      }
    })
    .catch((err) => {
      console.error('handleSuggestionSubmit failed', err);
      setSuggestionStatus('Unable to send right now.', true);
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
}

function bindSuggestionForm() {
  if (!suggestionForm) return;
  suggestionForm.addEventListener('submit', handleSuggestionSubmit);
  suggestionTextarea?.addEventListener('input', () => setSuggestionStatus(''));
}

function bindScoreErrorModal() {
  if (scoreErrorCancelBtn) {
    scoreErrorCancelBtn.onclick = () => closeScoreErrorModal();
  }
  if (scoreErrorRetryBtn) {
    scoreErrorRetryBtn.onclick = () => {
      if (state.submittingScore) return;
      const payload = state.pendingScoreRetry;
      if (!payload) {
        closeScoreErrorModal();
        return;
      }
      setScoreErrorStatus('Retrying...');
      submitScoreToBackend(payload)
        .then((res) => {
          if (res) {
            state.pendingScoreRetry = null;
            fetchTopScoresFromBackend().catch(() => {});
            closeScoreErrorModal();
          } else {
            setScoreErrorStatus('Still failing, try again.', true);
          }
        })
        .catch((err) => {
          console.error('retry submit score failed', err);
          setScoreErrorStatus('Still failing, try again.', true);
        });
    };
  }
  if (scoreOkClose) {
    scoreOkClose.onclick = () => closeScoreOkModal();
  }
}

function bindSuggestionToggle() {
  if (!suggestionToggle) return;
  suggestionToggle.addEventListener('click', () => {
    state.suggestionExpanded = !state.suggestionExpanded;
    updateSuggestionChevron();
    updateSuggestionVisibility();
    renderSuggestionList();
    savePreferences();
    if (state.suggestionExpanded && !state.suggestions.length && !state.loadingSuggestions) {
      fetchSuggestionsFromBackend().catch(() => {});
    }
  });
  updateSuggestionChevron();
  updateSuggestionVisibility();
}

function triggerGameOver() {
  if (state.gameOverHandled) return;
  state.running = false;
  state.gameOverHandled = true;
  const endedAt = new Date().toISOString();
  state.lastEndedAt = endedAt;
  const payload = {
          player: state.playerName || 'Anonymous',
    score: state.score,
    stage: state.level,
    level: state.playerLevel,
    endedAt
  };
  saveScore(payload);
  handleBackendScoreSubmit(payload);
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
  clampPaddlePosition();

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
    if (dist < drop.size + 16) {
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
    brick.poisonNextTick = now + 1000;
    damageBrick(brick, 1, now, 'Poison');
    if (brick.leechActive) {
      const maxLife = getMaxLives();
      if (state.lives < maxLife) {
        state.lives = Math.min(maxLife, state.lives + 0.5);
      }
    }
  }
}

// Propagation malédiction (si la brique est encore en vie après 1s)
  for (const brick of state.bricks) {
    if (!brick.alive) {
      brick.curseSpreadAt = null;
      continue;
    }
    if (brick.curseSpreadAt && brick.curseSpreadAt <= now) {
      brick.curseSpreadAt = null;
      const targets = state.bricks
        .filter((b) => b !== brick && b.alive)
        .map((b) => {
          const dx = (b.x + b.w / 2) - (brick.x + brick.w / 2);
          const dy = (b.y + b.h / 2) - (brick.y + brick.h / 2);
          return { b, dist: Math.hypot(dx, dy) };
        })
        .sort((a, b) => a.dist - b.dist);
      const target = targets.length ? targets[0].b : null;
      if (target) {
        target.curseTick = now + 3000;
        target.curseSpreadAt = now + 1000;
        target.effectColor = getPowerColor('Curse');
        target.effectUntil = target.curseTick;
      }
    }
  }

  // Tick malédiction (dégât différé)
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.curseTick && brick.curseTick <= now) {
      brick.curseTick = null;
      damageBrick(brick, 2, now, 'Curse');
    }
    if (brick.rustUntil && brick.rustUntil <= now) {
      brick.rustUntil = 0;
    }
  }

  // Vampire sustain: heal player while the marked brick is alive
  const maxLife = getMaxLives();
  for (const brick of state.bricks) {
    if (!brick.alive) {
      brick.vampireActive = false;
      brick.vampireNextTick = null;
      continue;
    }
    if (brick.vampireActive && brick.vampireNextTick && brick.vampireNextTick <= now) {
      if (state.lives < maxLife) {
        state.lives = Math.min(maxLife, state.lives + 1);
        state.lastVampireHeal = now;
      }
      brick.vampireNextTick = now + 3000;
      brick.effectColor = getPowerColor('Vampire');
      brick.effectUntil = brick.vampireNextTick;
    }
  }

  // Tick Thorns (continuous damage)
  for (const brick of state.bricks) {
    if (!brick.alive || !brick.thornActive) continue;
    if (brick.thornExpire && brick.thornExpire <= now) {
      brick.thornActive = false;
      brick.thornNextTick = 0;
      brick.thornSecondTick = 0;
      brick.thornExpire = 0;
      brick.gravebound = false;
      continue;
    }
    if (brick.thornNextTick && brick.thornNextTick <= now) {
      brick.thornNextTick = null;
      brick.effectColor = getPowerColor('Thorns');
      brick.effectUntil = brick.thornExpire;
      damageBrick(brick, 1.5, now, 'Thorns');
      if (brick.gravebound) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife) {
          state.lives = Math.min(maxLife, state.lives + 0.5);
        }
        brick.thornExpire = Math.max(brick.thornExpire || 0, now + 1500);
        brick.thornSecondTick = brick.thornSecondTick || now + 1200;
      }
    }
    if (brick.thornSecondTick && brick.thornSecondTick <= now) {
      brick.thornSecondTick = null;
      brick.effectColor = getPowerColor('Thorns');
      brick.effectUntil = brick.thornExpire;
      damageBrick(brick, 0.5, now, 'Thorns');
      if (brick.gravebound) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife) {
          state.lives = Math.min(maxLife, state.lives + 0.5);
        }
        brick.thornExpire = Math.max(brick.thornExpire || 0, now + 1500);
      }
      brick.thornActive = false;
      brick.thornExpire = 0;
      brick.gravebound = false;
    }
  }

  // Mouvement et collisions pour chaque balle active
  for (let i = state.balls.length - 1; i >= 0; i -= 1) {
    const ball = state.balls[i];
    const prevX = ball.x;
    const prevY = ball.y;
    // Jetstream: léger aim assist si balle spéciale Jetstream et non en retour
    if (ball.specialPower === 'Jetstream' && !ball.returning) {
      const target = selectTargetBrick();
      if (target) {
        const cx = target.x + target.w / 2;
        const cy = target.y + target.h / 2;
        const dx = cx - ball.x;
        const dy = cy - ball.y;
        const dist = Math.hypot(dx, dy) || 1;
        const homing = 0.6; // facteur de mélange faible pour éviter un virage brusque
        const speed = Math.hypot(ball.vx, ball.vy) || getBallSpeed(true);
        const desiredVx = (dx / dist) * speed;
        const desiredVy = (dy / dist) * speed;
        ball.vx = ball.vx * (1 - homing * dt) + desiredVx * (homing * dt);
        ball.vy = ball.vy * (1 - homing * dt) + desiredVy * (homing * dt);
      }
    }

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

    // Paddle
    const mirrorLevel = getTalentLevel('Mirror');
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

        if ((ball.specialPower === 'Wind' || ball.specialPower === 'Jetstream') && ball.windPierceLeft !== undefined) {
          if (ball.lastWindBrick === brick && ball.lastWindHit && now - ball.lastWindHit < 20) {
            // Already pierced this brick this frame; skip further processing.
          } else {
            if (ball.windPierceLeft > 0) ball.windPierceLeft -= 1;
            ball.lastWindBrick = brick;
            ball.lastWindHit = now;
          }
          // Push the ball just past the brick to avoid repeated hits.
          if (minOverlap === overlapLeft) {
            ball.x = brick.x - ball.r - 0.1;
          } else if (minOverlap === overlapRight) {
            ball.x = brick.x + brick.w + ball.r + 0.1;
          } else if (minOverlap === overlapTop) {
            ball.y = brick.y - ball.r - 0.1;
          } else {
            ball.y = brick.y + brick.h + ball.r + 0.1;
          }
          if (ball.windPierceLeft <= 0 && !ball.returning) {
            const snapSpeed = ball.specialPower === 'Jetstream' ? 0.8 : 0.5;
            redirectBallToPaddle(ball, snapSpeed);
          }
          continue;
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
        redirectBallToPaddle(ball);
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

function renderBricks() {
  const timeNow = performance.now ? performance.now() : Date.now();
  const hueShift = (timeNow / 50) % 360; // variation progressive des teintes
  for (const brick of state.bricks) {
    const baseHue = ((brick.hue ?? (200 + brick.row * 12)) + hueShift) % 360;
    const now = timeNow;
    if (!brick.alive && !brick.deathTime) continue;
    if (brick.w <= 0 || brick.h <= 0) continue; // données invalides, éviter les rayons négatifs
    let alpha = 1;
    let scale = 1;
    let explode = false;
    let shakeX = 0;
    let shakeY = 0;

    if (!brick.alive && brick.deathTime) {
      const t = Math.min((now - brick.deathTime) / 180, 1); // 180 ms
      alpha = 1 - t;
      scale = 1 + 0.3 * t;
      explode = true;
    }

    if (brick.shakeTime) {
      const elapsed = now - brick.shakeTime;
      if (elapsed <= 220) {
        const intensity = 1 - elapsed / 220;
        const magnitude = 3 * intensity;
        shakeX = Math.sin(now * 0.2 + brick.x) * magnitude;
        shakeY = Math.cos(now * 0.25 + brick.y) * magnitude;
      } else {
        brick.shakeTime = null;
      }
    }

    const bw = Math.max(1, Math.abs(Number.isFinite(brick.w) ? brick.w : CONFIG.brickHeight));
    const bh = Math.max(1, Math.abs(Number.isFinite(brick.h) ? brick.h : CONFIG.brickHeight));

    const drawX = (brick.x + shakeX) - (scale - 1) * bw / 2;
    const drawY = (brick.y + shakeY) - (scale - 1) * bh / 2;
    const drawW = bw * scale;
    const drawH = bh * scale;

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
      const radius = Math.max(drawW, drawH) * 0.35;
      if (radius > 0 && Number.isFinite(radius)) {
        ctx.arc(drawX + drawW / 2, drawY + drawH / 2, radius, 0, Math.PI * 2);
      }
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
  const raquetteLv = getTalentLevel('Paddle');
  const baseColor = raquetteLv > 0 ? '#22d3ee' : '#38bdf8';
  const drawSprite = (img, x, w, h) => {
    if (!img) return;
    const targetW = w;
    const targetH = h * 2; // allow some height beyond paddle
    const scale = Math.min(targetW / img.width, targetH / img.height);
    const drawW = targetW;
    const drawH = img.height * (drawW / img.width);
    const dx = x;
    const isModule = img === moduleSprite;
    const dy = paddle.y + (h - drawH) / 2 + (isModule ? drawH * 0.25 : 0);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  if (paddleSpriteReady && paddleSprite) {
    // Draw only the sprite for the main paddle; collision uses geometry, not fill.
    drawSprite(paddleSprite, paddle.x, paddle.w, paddle.h);
  } else {
    ctx.fillStyle = baseColor;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  }

  const mirrorLevel = getTalentLevel('Mirror');
  const halfWidth = paddle.w * 0.5;
  const gap = 8;
  if (mirrorLevel >= 1) {
    if (moduleSpriteReady && moduleSprite) {
      drawSprite(moduleSprite, paddle.x - halfWidth - gap, halfWidth, paddle.h);
    } else {
      ctx.fillStyle = baseColor;
      ctx.fillRect(paddle.x - halfWidth - gap, paddle.y, halfWidth, paddle.h);
    }
  }
  if (mirrorLevel >= 2) {
    if (moduleSpriteReady && moduleSprite) {
      drawSprite(moduleSprite, paddle.x + paddle.w + gap, halfWidth, paddle.h);
    } else {
      ctx.fillStyle = baseColor;
      ctx.fillRect(paddle.x + paddle.w + gap, paddle.y, halfWidth, paddle.h);
    }
  }
}

function renderAimCone() {
  // La ligne de visée apparaît seulement en manuel (autoPlay off)
  if (state.autoPlay) return;
  const { paddle } = state;
  const originX = paddle.x + paddle.w / 2;
  const originY = paddle.y;

  let targetPoint = null;
  if (state.aimPos) {
    targetPoint = { x: state.aimPos.x, y: state.aimPos.y };
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
      if (ball.specialPower === 'Fire') {
        const blink = (Math.sin(performance.now() / 80) + 1) / 2; // plus rapide
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha.toFixed(2)})`; // jaune doré
      } else if (ball.specialPower === 'Ice') {
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
      } else if (ball.specialPower === 'Light') {
        const blink = (Math.sin(performance.now() / 80) + 1) / 2;
        const alpha = 0.3 + 0.7 * blink;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`; // blanc pulsé
      } else if (ball.specialPower === 'Thorns') {
        const blink = (Math.sin(performance.now() / 100) + 1) / 2;
        const alpha = 0.35 + 0.65 * blink;
        ctx.fillStyle = `rgba(120, 72, 48, ${alpha.toFixed(2)})`; // marron pulsé
      } else if (ball.specialPower === 'Curse') {
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
  const sig = computeHudSignature();
  if (hudSignature !== sig) {
    hudSignature = sig;
    const h = hudCtx;
    h.clearRect(0, 0, CONFIG.width, CONFIG.height);
    const leftX = 14;
    let leftY = 32;
    h.font = '22px "Segoe UI", sans-serif';
    h.fillStyle = '#7dd3fc';
    h.fillText(`Version: ${BUILD_LABEL}`, leftX, leftY);
    leftY += 26;
    const displayName = state.playerName ? state.playerName : 'Name?';
    h.fillText(`Player: ${displayName}`, leftX, leftY);
    leftY += 26;
    h.fillStyle = '#e2e8f0';
    h.fillText(`Score: ${formatScore(state.score)}`, leftX, leftY);
    leftY += 26;
    if (state.showFps) {
      const fpsText = Number.isFinite(state.fps) && state.fps > 0 ? `${state.fps} fps` : '--';
      h.fillText(`FPS: ${fpsText}`, leftX, leftY);
      leftY += 26;
    }

    // Barres de progression (ordre: Vies, Stage, Level)
    const barW = 180;
    const barH = 8;
    const barX = CONFIG.width - barW - 20;
  const spacing = 40; // plus d'espace vertical entre les barres et les sections de droite
    let barY = 30;

    // Vies
    const maxLife = getMaxLives();
    const lifeProgress = Math.min(state.lives / maxLife, 1);
    h.fillStyle = '#34d399';
    h.fillText(`Lives: ${state.lives}/${maxLife}`, barX, barY - 8);
    h.fillStyle = 'rgba(255,255,255,0.12)';
    h.fillRect(barX, barY, barW, barH);
    h.fillStyle = '#34d399';
    h.fillRect(barX, barY, barW * lifeProgress, barH);
    h.strokeStyle = 'rgba(255,255,255,0.5)';
    h.lineWidth = 1;
    h.strokeRect(barX, barY, barW, barH);

    // Stage
    barY += spacing;
    const interval = CONFIG.speedIncreaseInterval;
    const progress = Math.min(state.speedTimer / interval, 1);
    h.fillStyle = '#38bdf8';
    h.fillText(`Stage: ${state.level}`, barX, barY - 8);
    h.fillStyle = 'rgba(255,255,255,0.12)';
    h.fillRect(barX, barY, barW, barH);
    h.fillStyle = '#38bdf8';
    h.fillRect(barX, barY, barW * progress, barH);
    h.strokeStyle = 'rgba(255,255,255,0.5)';
    h.lineWidth = 1;
    h.strokeRect(barX, barY, barW, barH);

    // Level (XP joueur)
    barY += spacing;
    const xpProgress = Math.min(state.xp / state.xpNeeded, 1);
    h.fillStyle = '#f472b6';
    h.fillText(`Level ${state.playerLevel}`, barX, barY - 8);
    h.fillStyle = 'rgba(255,255,255,0.12)';
    h.fillRect(barX, barY, barW, barH);
    h.fillStyle = '#f472b6';
    h.fillRect(barX, barY, barW * xpProgress, barH);
    h.strokeStyle = 'rgba(255,255,255,0.5)';
    h.lineWidth = 1;
    h.strokeRect(barX, barY, barW, barH);
    h.fillText(`${Math.floor(state.xp)}/${state.xpNeeded}`, barX + barW - 70, barY - 8);

    // Liste des pouvoirs acquis (à droite, sous les infos) avec léger fond.
    h.fillStyle = '#e2e8f0';
    let infoY = barY + 36; // espace accru au-dessus de la liste des pouvoirs
    const panelWidth = 220;
    const panelX = barX - 10;
    const powerLines = state.powers; // affiche tous
    let powersBlockHeight = 0;
    if (powerLines.length) {
      const powersY = infoY;
      const blockH = 26 + powerLines.length * 18;
      h.fillStyle = 'rgba(15,23,42,0.55)';
      h.fillRect(panelX, powersY - 22, panelWidth, blockH);
      h.strokeStyle = 'rgba(148,163,184,0.35)';
      h.strokeRect(panelX, powersY - 22, panelWidth, blockH);
      h.fillStyle = '#e2e8f0';
      h.fillText('Powers:', barX, powersY);
      powerLines.forEach((p, idx) => {
        const def = getPowerDef(p.name);
        const label = p.level >= def.maxLevel ? 'MAX' : `Lv. ${p.level}`;
        const fusion = getFusionDef(p.name);
        h.fillStyle = fusion ? '#16a34a' : '#e2e8f0';
        h.fillText(`- ${p.name} (${label})`, barX, powersY + 20 + idx * 18);
      });
      h.fillStyle = '#e2e8f0';
      powersBlockHeight = 20 + powerLines.length * 18;
      infoY += powersBlockHeight + 10;
    }

    // Talents
    const talentLines = state.talents;
    let talentsY = infoY;
    let talentsBlockHeight = 0;
    if (talentLines.length) {
      const blockH = 26 + talentLines.length * 18;
      h.fillStyle = 'rgba(15,23,42,0.55)';
      h.fillRect(panelX, talentsY - 22, panelWidth, blockH);
      h.strokeStyle = 'rgba(148,163,184,0.35)';
      h.strokeRect(panelX, talentsY - 22, panelWidth, blockH);
      h.fillStyle = '#e2e8f0';
      h.fillText('Talents:', barX, talentsY);
      talentLines.forEach((t, idx) => {
        const def = getTalentDef(t.name);
        const label = t.level >= def.maxLevel ? 'MAX' : `Lv. ${t.level}`;
        h.fillText(`- ${t.name} (${label})`, barX, talentsY + 20 + idx * 18);
      });
      talentsBlockHeight = 20 + talentLines.length * 18;
    }

    // Histogramme dégâts par pouvoir (en bas à droite)
    const listBottom = talentsY + talentsBlockHeight;
    const histY = Math.min(CONFIG.height - 140, listBottom + 50); // plus d'espace avant l'histogramme
    const histX = barX;
    const entries = Object.entries(state.damageByPower || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (state.showDamageByPower && entries.length) {
      const labelY = histY;
      const startY = labelY + 32; // plus d'espace avant le premier pouvoir
      h.fillText('Damage by power', histX, labelY);
      const barHeight = 8; // même hauteur que les barres de progression
      const barGap = 32; // même spacing vertical que les autres sections
      const maxVal = Math.max(...entries.map(([, v]) => v));
      const totalVal = entries.reduce((sum, [, v]) => sum + v, 0);
      entries.forEach(([name, val], idx) => {
        const y = startY + idx * (barHeight + barGap);
        const ratio = maxVal > 0 ? val / maxVal : 0;
        const w = barW * ratio;
        const owned = getPowerLevel(name) > 0 || getTalentLevel(name) > 0;
        const bgAlpha = owned ? 0.12 : 0.06;
        h.fillStyle = `rgba(255,255,255,${bgAlpha})`;
        h.fillRect(histX, y, barW, barHeight);
        const barColor = getPowerColor(name) || '#fbbf24';
        const inactiveColor = 'rgba(148, 163, 184, 0.35)';
        h.fillStyle = owned ? barColor : inactiveColor;
        h.fillRect(histX, y, w, barHeight);
        h.fillStyle = owned ? '#e2e8f0' : 'rgba(226,232,240,0.45)';
        h.font = owned ? '14px "Segoe UI", sans-serif' : '14px "Segoe UI", sans-serif';
        const pct = totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
        const label = `${name} (${pct}%)`;
        if (owned) {
          h.fillText(label, histX, y - 8);
        } else {
          h.save();
          h.globalAlpha = 0.7;
          h.fillText(label, histX, y - 8);
          h.restore();
        }
      });
    }

    if (state.manualPause) {
      h.fillStyle = 'rgba(0,0,0,0.6)';
      h.fillRect(0, 0, CONFIG.width, CONFIG.height);
      h.fillStyle = '#e2e8f0';
      h.font = '32px "Segoe UI", sans-serif';
      h.fillText('Paused', 120, CONFIG.height / 2);
      h.font = '20px "Segoe UI", sans-serif';
      h.fillText('Press Resume to continue', 120, CONFIG.height / 2 + 32);
    }

    if (!state.running) {
      h.fillStyle = 'rgba(0,0,0,0.6)';
      h.fillRect(0, 0, CONFIG.width, CONFIG.height);
      h.fillStyle = '#e2e8f0';
      h.font = '32px "Segoe UI", sans-serif';
      h.fillText('Game over - Press Enter to replay', 120, CONFIG.height / 2);
      h.fillText(`Score: ${formatScore(state.score)}`, 120, CONFIG.height / 2 + 36);
    }
  }

  ctx.drawImage(hudBuffer, 0, 0);
}

function render() {
  renderBackground();
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
    fpsLastTime = timestamp;
  }
  const dt = Math.min((timestamp - loop.lastTime) / 1000, 0.033);
  loop.lastTime = timestamp;

  fpsCounter += 1;
  const fpsElapsed = timestamp - fpsLastTime;
  if (fpsElapsed >= 400) {
    const fps = Math.round((fpsCounter / fpsElapsed) * 1000);
    state.fps = fps;
    fpsCounter = 0;
    fpsLastTime = timestamp;
  }

  const scaledDt = dt * (state.timeScale || 1);
  update(scaledDt);
  render();
  maybeSaveSession(timestamp);
  requestAnimationFrame(loop);
}

function bindControls() {
  const isKeyBinding = (event, binding) => {
    const eventKey = normalizeKeyValue(event?.key || event?.code);
    const bindingKey = normalizeKeyValue(binding);
    return !!eventKey && !!bindingKey && eventKey === bindingKey;
  };
  const isSettingsOpen = () => settingsModalBackdrop?.classList.contains('open');
  const isCatalogOpen = () => catalogModalBackdrop?.classList.contains('open');

  window.addEventListener('keydown', (event) => {
    if (state.awaitingName || isSettingsOpen() || isCatalogOpen()) return;
    const keyValue = normalizeKeyValue(event.key || event.code);
    if (state.powerModalOpen) {
      if (keyValue === 'enter') {
        event.preventDefault();
        handlePowerConfirm();
      } else if (keyValue === 'escape' || keyValue === 'esc') {
        event.preventDefault();
        handlePowerPass();
      }
      return;
    }
    if (
      state.ballHeld &&
      (isKeyBinding(event, state.keyBindings.launch) || keyValue === 'enter' || keyValue === 'arrowup')
    ) {
      launchBall();
      return;
    }
    if (isKeyBinding(event, state.keyBindings.left)) state.keys.left = true;
    if (isKeyBinding(event, state.keyBindings.right)) state.keys.right = true;
    if (keyValue === 'enter' && !state.running) {
      state.running = true;
      resetGame();
    }
  });
  window.addEventListener('keyup', (event) => {
    if (isSettingsOpen() || isCatalogOpen()) return;
    if (isKeyBinding(event, state.keyBindings.left)) state.keys.left = false;
    if (isKeyBinding(event, state.keyBindings.right)) state.keys.right = false;
  });
  autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    autoBtn.textContent = state.autoPlay ? 'Disable auto' : 'Enable auto';
    savePreferences();
  });
  pauseBtn?.addEventListener('click', () => {
    state.manualPause = !state.manualPause;
    refreshPauseState();
    updatePauseButton();
  });
  if (autoFireToggle) {
    autoFireToggle.addEventListener('change', (event) => {
      state.autoFire = event.target.checked;
    });
  }
  abandonBtn?.addEventListener('click', () => {
    if (!state.running || state.gameOverHandled) return;
    state.lives = 0;
    triggerGameOver();
  });
  infoBtn?.addEventListener('click', () => openInfoModal());
  infoCloseBtn?.addEventListener('click', () => closeInfoModal());
  infoModalBackdrop?.addEventListener('click', (event) => {
    if (event.target === infoModalBackdrop) closeInfoModal();
  });
  settingsBtn?.addEventListener('click', () => openSettingsModal());
  settingsCancelBtn?.addEventListener('click', () => closeSettingsModal());
  settingsModalBackdrop?.addEventListener('click', (event) => {
    if (event.target === settingsModalBackdrop) closeSettingsModal();
  });
  settingsSaveBtn?.addEventListener('click', () => {
    applySettingsBindings();
    closeSettingsModal();
  });
  catalogOpenBtn?.addEventListener('click', openCatalogModal);
  catalogCloseBtn?.addEventListener('click', closeCatalogModal);
  catalogModalBackdrop?.addEventListener('click', (event) => {
    if (event.target === catalogModalBackdrop) closeCatalogModal();
  });
  const captureKey = (input) => {
    if (!input) return;
    input.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = event.key === ' ' ? 'Space' : event.key;
      input.value = key;
    });
  };
  captureKey(settingsLeftInput);
  captureKey(settingsRightInput);
  captureKey(settingsLaunchInput);
  timeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number(btn.dataset.speed) || 1;
      setTimeScale(val);
      savePreferences();
    });
  });
  playerNameSubmit?.addEventListener('click', handleNameSubmit);
  playerNameInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleNameSubmit();
    }
  });
  powerPassBtn?.addEventListener('click', handlePowerPass);
  powerCatalogBtn?.addEventListener('click', () => {
    state.catalogReturnToPower = state.powerModalOpen;
    closePowerModal();
    openCatalogModal();
  });
  powerConfirmBtn?.addEventListener('click', handlePowerConfirm);
  const updateAim = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    state.aimPos = {
      x: ((clientX - rect.left) / rect.width) * CONFIG.width,
      y: ((clientY - rect.top) / rect.height) * CONFIG.height
    };
  };

  canvas.addEventListener('click', (event) => {
    if (!state.running) {
      state.running = true;
      resetGame();
      return;
    }
    if (state.ballHeld) {
      updateAim(event.clientX, event.clientY);
      launchBall();
    }
  });

  canvas.addEventListener('mousemove', (event) => {
    updateAim(event.clientX, event.clientY);
  });

  canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateAim(touch.clientX, touch.clientY);
    if (!state.running) {
      state.running = true;
      resetGame();
      return;
    }
    if (state.ballHeld) launchBall();
  }, { passive: true });

  canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateAim(touch.clientX, touch.clientY);
  }, { passive: true });
}

function init() {
  warnMissingMediaMappings();
  preloadAssets(['bl_paddle_cp.png', 'bl_module_cp.png', ...FUSION_SPRITES]).catch(() => {});
  loadImage('bl_paddle_cp.png')
    .then((img) => {
      paddleSprite = img;
      paddleSpriteReady = true;
    })
    .catch(() => {
      console.warn('Paddle sprite failed to load, using default shape.');
      paddleSpriteReady = false;
    });
  loadImage('bl_module_cp.png')
    .then((img) => {
      moduleSprite = img;
      moduleSpriteReady = true;
    })
    .catch(() => {
      console.warn('Module sprite failed to load, using default shapes.');
      moduleSpriteReady = false;
    });
  resizeCanvas();
  bindControls();
  window.addEventListener('resize', () => {
    resizeCanvas();
    hudSignature = null;
    clampPaddlePosition();
    if (state.ballHeld) placeBallOnPaddle({ centerPaddle: true });
  });
  bindCommitToggle();
  bindScoreToggle();
  bindScoreFilter();
  bindSuggestionForm();
  bindSuggestionToggle();
  bindScoreErrorModal();
  const savedName = loadPlayerName();
  resetGame();
  loadPreferences();
  const restored = loadSession();
  autoBtn.textContent = state.autoPlay ? 'Disable auto' : 'Enable auto';
  if (autoFireToggle) autoFireToggle.checked = state.autoFire;
  updatePauseButton();
  if (!savedName && !state.playerName) {
    openNameModal();
  }
  if (!restored) {
    setTimeScale(state.timeScale || 1);
  }
  renderTopScoresPanel();
  fetchTopScoresFromBackend(TOP_LIMIT);
  fetchSuggestionsFromBackend();
  fetchCommits();
  setInterval(() => {
    fetchTopScoresFromBackend().catch(() => {});
  }, 30000);
  requestAnimationFrame(loop);
}

init();
function applyPowerOnHit(ball, brick, now, options = {}) {
  const { allowSplash = true } = options;
  if (!brick.alive) return;
  const power = ball.specialPower;
  const fusion = getFusionDef(power);
  if (fusion && fusionKind(fusion) === 'talent') return; // shouldn't be on power balls
  const isJetstream = power === 'Jetstream';
  if (power === 'Ice') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 3000); // 3s de gel
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.slowUntil;
  } else if (power === 'Poison') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = Number.POSITIVE_INFINITY;
  } else if (power === 'Fire') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 3000; // halo feu 3s
  } else if (power === 'Metal') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 500;
  } else if (power === 'Light') {
    applyLightStun(brick, ball, now);
  } else if (power === 'Curse') {
    brick.curseTick = now + 3000;
    brick.curseSpreadAt = now + 1000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
  } else if (power === 'Thorns') {
    brick.thornActive = true;
    brick.thornNextTick = now + 1000; // +1.5 dmg
    brick.thornSecondTick = now + 2000; // +0.5 dmg
    brick.thornExpire = brick.thornSecondTick;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
  } else if (power === 'Vampire') {
    brick.vampireActive = true;
    brick.vampireNextTick = now + 3000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.vampireNextTick;
  } else if (power === 'Sun') {
    // Apply both Fire and Light effects
    applyLightStun(brick, ball, now);
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 3000;
  } else if (power === 'Tundra') {
    applyLightStun(brick, ball, now); // reuse stun for freeze effect
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 3000;
    // Also freeze 2 nearby bricks
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const others = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { b } of others) {
      b.slowUntil = Math.max(b.slowUntil || 0, now + 3000);
      b.poisonActive = true;
      b.poisonNextTick = now + 1000;
      b.effectColor = getPowerColor(power);
      b.effectUntil = now + 3000;
    }
  } else if (power === 'Forge') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 400;
    // Splash cone: pick 3 nearby targets and deal boosted damage
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const baseDamage = getBallBaseDamage(ball) * 2.5; // ~+150%
    const targets = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
    for (const { b } of targets) {
      damageBrick(b, baseDamage, now, 'Forge');
    }
  } else if (power === 'Leech') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = Number.POSITIVE_INFINITY;
    brick.leechActive = true;
  } else if (power === 'Prism') {
    applyLightStun(brick, ball, now);
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 800;
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const targets = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { b } of targets) {
      applyLightStun(b, ball, now);
      b.effectColor = getPowerColor(power);
      b.effectUntil = now + 600;
    }
  } else if (power === 'Spikes') {
    // On-hit bonus damage and later paddle reflect handled elsewhere
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 600;
    damageBrick(brick, 1, now, 'Spikes');
  } else if (power === 'Aurora') {
    applyLightStun(brick, ball, now + 500); // shorter extension
    brick.curseTick = now + 3000;
    brick.curseSpreadAt = now + 1000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const nearby = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { b } of nearby) {
      b.curseTick = now + 3000;
      b.effectColor = getPowerColor(power);
      b.effectUntil = b.curseTick;
    }
  } else if (power === 'Frostbite') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 3000);
    brick.thornActive = true;
    brick.thornNextTick = now + 800;
    brick.thornSecondTick = now + 1600;
    brick.thornExpire = now + 2000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
  } else if (power === 'Gravebound') {
    brick.thornActive = true;
    brick.thornNextTick = now + 800;
    brick.thornSecondTick = now + 1600;
    brick.thornExpire = now + 2000;
    brick.gravebound = true;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
  } else if (power === 'Storm') {
    applyLightStun(brick, ball, now);
    const base = getBallBaseDamage(ball) * 1.5;
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const targets = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { b } of targets) {
      applyLightStun(b, ball, now);
      damageBrick(b, base, now, 'Storm');
    }
  } else if (power === 'Rust') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.rustUntil = now + 4000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.rustUntil;
  } else if (power === 'Echo') {
    applyLightStun(brick, ball, now + 200);
    ball.echoBonus = (ball.echoBonus || 0) + 1;
  } else if (power === 'Bramble') {
    brick.thornActive = true;
    brick.thornNextTick = now + 600;
    brick.thornSecondTick = now + 1400;
    brick.thornExpire = now + 2000;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
    ball.vx *= 1.05;
    ball.vy *= 1.05;
  } else if (power === 'Radiance') {
    applyLightStun(brick, ball, now);
    const maxLife = getMaxLives();
    state.lives = Math.min(maxLife + 2, state.lives + 2);
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 1000;
  } else if (power === 'Shard') {
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const shards = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
    for (const { b } of shards) {
      damageBrick(b, 1, now, 'Shard');
    }
  } else if (power === 'Plaguefire') {
    brick.curseTick = now + 3000;
    brick.curseSpreadAt = now + 800;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
    if (allowSplash) {
      applyFireSplash({ ...ball, specialPower: 'Plaguefire' }, brick, now, getBallBaseDamage(ball));
    }
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    const targets = state.bricks
      .filter((b) => b.alive && b !== brick)
      .map((b) => {
        const dx = b.x + b.w / 2 - cx;
        const dy = b.y + b.h / 2 - cy;
        return { b, dist: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { b } of targets) {
      b.curseTick = now + 3000;
      b.effectColor = getPowerColor(power);
      b.effectUntil = b.curseTick;
    }
  }
}

function damageBrick(brick, amount, now, sourcePower = null) {
  brick.flashTime = now;
  brick.shakeTime = now;
  if (brick.rustUntil && brick.rustUntil > now) {
    amount *= 1.2;
  }
  brick.hp = Math.max(0, (brick.hp || 1) - amount);

  if (sourcePower) {
    state.damageByPower[sourcePower] = (state.damageByPower[sourcePower] || 0) + amount;
  }

  const destroyed = brick.hp <= 0;
  if (destroyed) {
    brick.alive = false;
    brick.deathTime = now;
    state.score += 50 + brick.row * 10;
    brick.vampireActive = false;
    brick.vampireNextTick = null;
    brick.rustUntil = 0;
    brick.leechActive = false;
    brick.gravebound = false;
    const xpDropCount = brick.type === 'boss' ? 5 : 1;
    for (let k = 0; k < xpDropCount; k += 1) {
      spawnXpDrop(brick);
    }
    // bonus/speed retirés
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
  if (ball.specialPower !== 'Fire' && ball.specialPower !== 'Sun' && ball.specialPower !== 'Plaguefire' && ball.specialPower !== 'Forge') return;
  const sourcePower = ball.specialPower === 'Sun' ? 'Sun' : ball.specialPower === 'Plaguefire' ? 'Plaguefire' : ball.specialPower === 'Forge' ? 'Forge' : 'Fire';
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
  const targets = nearest.slice(0, 2);
  for (const { brick } of targets) {
    applyPowerOnHit(ball, brick, now, { allowSplash: false });
    damageBrick(brick, baseDamage, now, sourcePower);
  }
}
