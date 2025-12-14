// DO NOT REMOVE
import.meta.env.VITE_API_TOKEN;
import.meta.env.VITE_API_KEY;

import buildInfo from './build-info.json';
import mediaList, { MEDIA_BY_NAME as MEDIA_MAP } from './assets/media-map.js';
import enLocale from './locales/en.json';
import frLocale from './locales/fr.json';
import esLocale from './locales/es.json';
import { loadImage, preloadAssets } from './assets.js';
import { buildSettingsModal } from './ui/organisms/settings-modal.js';

buildSettingsModal();

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const autoBtn = document.getElementById('auto-toggle');
const aimToggle = null;
const autoFireToggle = null;
const powerModalBackdrop = document.getElementById('power-modal-backdrop');
const powerPassBtn = document.getElementById('power-pass-btn');
const powerRerollBtn = document.getElementById('power-reroll-btn');
const powerCatalogBtn = document.getElementById('power-open-catalog');
const powerConfirmBtn = document.getElementById('power-confirm-btn');
const powerButtons = Array.from(document.querySelectorAll('.power-btn'));
const talentButtons = Array.from(document.querySelectorAll('.talent-btn'));
const powerPreviewName = document.getElementById('power-preview-name');
const powerPreviewDesc = document.getElementById('power-preview-desc');
const powerPreviewIcon = document.getElementById('power-preview-icon');
const notificationPanel = document.getElementById('notification-panel');
const nameModalBackdrop = document.getElementById('name-modal-backdrop');
const playerNameInput = document.getElementById('player-name-input');
const playerNameSubmit = document.getElementById('player-name-submit');
const pilotModalBackdrop = document.getElementById('pilot-modal-backdrop');
const pilotListEl = document.getElementById('pilot-list');
const pilotConfirmBtn = document.getElementById('pilot-confirm-btn');
const pilotSubtitle = document.getElementById('pilot-subtitle');
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
const settingsUpInput = document.getElementById('key-up');
const settingsDownInput = document.getElementById('key-down');
const settingsLaunchInput = document.getElementById('key-launch');
const settingsSaveBtn = document.getElementById('settings-save');
const settingsCancelBtn = document.getElementById('settings-cancel');
const settingsDamageToggle = document.getElementById('toggle-damage-graph');
const settingsFpsToggle = document.getElementById('toggle-fps');
const settingsPaddleRectToggle = document.getElementById('toggle-paddle-rect');
const settingsBallTrailsToggle = document.getElementById('toggle-ball-trails');
const settingsAutoPauseToggle = document.getElementById('toggle-auto-pause');
const settingsLoadoutSidebarToggle = document.getElementById('toggle-loadout-sidebar');
const languageSelect = document.getElementById('language-select');
const powerSlotsLabel = document.getElementById('power-slots-label');
const talentSlotsLabel = document.getElementById('talent-slots-label');
const ownedPowersGrid = document.getElementById('owned-powers-grid');
const ownedTalentsGrid = document.getElementById('owned-talents-grid');
const timeButtons = Array.from(document.querySelectorAll('.time-btn'));
const speedThumb = document.getElementById('speed-thumb');
const speedFill = document.getElementById('speed-fill');
const speedStops = Array.from(document.querySelectorAll('.speed-stop'));
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
let ballSprite = null;
let ballSpriteReady = false;
let paddleSprite = null;
let paddleSpriteReady = false;
let moduleSprite = null;
let moduleSpriteReady = false;
let brickSprite = null;
let brickSpriteReady = false;
let bossBrickSprite = null;
let bossBrickSpriteReady = false;
let bossFrameOverlays = [];
let bossFrameReady = false;
const iconCache = {};
let brickVariants = [];
let brickVariantsReady = false;
let bossVariants = [];
let bossVariantsReady = false;
const TOP_LIMIT = Infinity;
const PASS_LIMIT_PER_MODAL = 2;
const REROLL_LIMIT_PER_MODAL = 2;
const BUILD_LABEL = 'b24';
const STARFIELD_LAYERS = [
  { count: 110, speed: 14, size: [0.4, 1.1], alpha: [0.25, 0.55] },
  { count: 65, speed: 28, size: [0.6, 1.6], alpha: [0.35, 0.8] }
];
const BRICK_VARIANT_FILES = [
  'brick-variant1.svg',
  'brick-variant2.svg',
  'brick-variant3.svg',
  'brick-variant4.svg',
  'brick-variant5.svg'
];
const BOSS_VARIANT_FILES = [
  'boss-variant1.svg',
  'boss-variant2.svg',
  'boss-variant3.svg',
  'boss-variant4.svg',
  'boss-variant5.svg',
  'boss-variant6.svg',
  'boss-variant7.svg',
  'boss-variant8.svg',
  'boss-variant9.svg',
  'boss-variant10.svg',
  'boss-variant-devil.svg',
  'boss-variant-devil2.svg',
  'boss-variant-devil3.svg',
  'boss-variant-devil4.svg',
  'boss-variant-devil5.svg',
  'boss-variant-devil6.svg'
];
const BOSS_FRAME_FILES = [
  'boss-frame-epic1.svg',
  'boss-frame-epic2.svg',
  'boss-frame-epic3.svg'
];
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
  up: 'ArrowUp',
  down: 'ArrowDown',
  launch: 'Space'
};
const MAX_POWERS = 4;
const MAX_TALENTS = 4;
const formatDesc = (desc) => desc?.plain || desc?.rich || '';
const SCORE_PAGE_SIZE = 20;

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
  { name: 'Wind', maxLevel: 3 },
  { name: 'Beamline', maxLevel: 3 },
  { name: 'Pillar', maxLevel: 3 },
  { name: 'Crusher', maxLevel: 3 }
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
    ingredients: ['Pillar', 'Curse'],
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
    ingredients: ['Pillar', 'Metal'],
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
    ingredients: ['Beamline', 'Mirror'],
    color: 'rgba(203, 213, 225, 0.55)'
  },
  {
    name: 'Bramble',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Vampire', 'Feather'],
    color: 'rgba(74, 222, 128, 0.5)'
  },
  {
    name: 'Radiance',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Pillar', 'Stim Pack'],
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
    ingredients: ['Beamline', 'Wind'],
    color: 'rgba(94, 234, 212, 0.5)'
  },
  {
    name: 'Cyclone',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Wind', 'Curse'],
    color: 'rgba(52, 211, 153, 0.5)'
  },
  {
    name: 'Crossfire',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Beamline', 'Pillar'],
    color: 'rgba(250, 204, 21, 0.5)'
  },
  {
    name: 'Mirrorwind',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Wind', 'Mirror'],
    color: 'rgba(125, 211, 252, 0.55)'
  },
  {
    name: 'Gale',
    maxLevel: 1,
    fusion: true,
    kind: 'power',
    ingredients: ['Crusher', 'Wind'],
    color: 'rgba(14, 165, 233, 0.55)'
  },
  {
    name: 'Radiant',
    maxLevel: 1,
    fusion: true,
    kind: 'power',
    ingredients: ['Vampire', 'Resilience'],
    color: 'rgba(253, 230, 138, 0.55)'
  },
  {
    name: 'Thornstep',
    maxLevel: 1,
    fusion: true,
    kind: 'talent',
    ingredients: ['Thorns', 'Boots'],
    color: 'rgba(34, 197, 94, 0.55)'
  },
  {
    name: 'Scopebeam',
    maxLevel: 1,
    fusion: true,
    kind: 'power',
    ingredients: ['Beamline', 'Scope'],
    color: 'rgba(34, 211, 238, 0.55)'
  },
  {
    name: 'Meteor',
    maxLevel: 1,
    fusion: true,
    kind: 'power',
    ingredients: ['Fire', 'Crusher'],
    color: 'rgba(248, 113, 113, 0.6)'
  },
  {
    name: 'Prism Paddle',
    maxLevel: 1,
    fusion: true,
    kind: 'talent',
    ingredients: ['Paddle', 'Mirror'],
    color: 'rgba(148, 163, 184, 0.5)'
  },
  {
    name: 'Royal Surge',
    maxLevel: 1,
    fusion: true,
    kind: 'talent',
    ingredients: ['Crown', 'Surge'],
    color: 'rgba(250, 204, 21, 0.6)'
  },
  {
    name: 'Photon',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Light', 'Crusher'],
    color: 'rgba(250, 204, 21, 0.55)'
  },
  {
    name: 'Pestilence',
    maxLevel: 1,
    fusion: true,
    ingredients: ['Poison', 'Curse'],
    color: 'rgba(74, 222, 128, 0.5)'
  }
];
const ALL_POWER_DEFS = [...POWER_DEFS, ...FUSION_DEFS];

const TALENT_DEFS = [
  { name: 'Boots', maxLevel: 3 },
  { name: 'Feather', maxLevel: 3 },
  { name: 'Gloves', maxLevel: 3 },
  { name: 'Paddle', maxLevel: 3 },
  { name: 'Mirror', maxLevel: 2 },
  { name: 'Stim Pack', maxLevel: 3 },
  { name: 'Scope', maxLevel: 3 },
  { name: 'Momentum', maxLevel: 3 },
  { name: 'Resilience', maxLevel: 3 },
  { name: 'Surge', maxLevel: 3 },
  { name: 'Gravity', maxLevel: 3 },
  { name: 'Crown', maxLevel: 3 },
  { name: 'Regen', maxLevel: 3 },
  { name: 'Booster', maxLevel: 3 },
  { name: 'Twin Core', maxLevel: 2 }
];

const TALENT_SHIP_SKINS = {
  Boots: { tint: '#f97316', glow: 'rgba(249, 115, 22, 0.55)' },
  Feather: { tint: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
  Gloves: { tint: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' },
  Paddle: { tint: '#fb7185', glow: 'rgba(251, 113, 133, 0.55)' },
  Mirror: { tint: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.55)' },
  'Stim Pack': { tint: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' },
  Scope: { tint: '#f472b6', glow: 'rgba(244, 114, 182, 0.55)' },
  Momentum: { tint: '#fb923c', glow: 'rgba(251, 146, 60, 0.5)' },
  Resilience: { tint: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.55)' },
  Surge: { tint: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
  Gravity: { tint: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)' },
  Crown: { tint: '#facc15', glow: 'rgba(250, 204, 21, 0.5)' },
  Booster: { tint: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' },
  Regen: { tint: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
  'Twin Core': { tint: '#ec4899', glow: 'rgba(236, 72, 153, 0.55)' }
};

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
  paddleSpeed: 200,
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
  speedIncreaseInterval: 45,
  speedIncreaseMultiplier: 1.05,
  xpSpeed: 2000,
  xpSize: 7,
  maxLives: 10,
  startLives: 10,
  maxNormalBalls: 3,
  specialShotCooldownMs: 200, // 5 tirs/s pour les spéciales
  normalShotCooldownMs: 250, // 4 tirs/s pour les normales
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
const PILOT_PROGRESS_KEY = 'brickidle_pilot_progress_v1';
let starfieldLastTime = 0;

const state = {
  keys: {
    left: false,
    right: false,
    up: false,
    down: false
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
    r: baseBallRadius(false),
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
  activePilotId: null,
  selectedPilotId: null,
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
  awaitingPilot: false,
  gameOverHandled: false,
  lastEndedAt: null,
  awaitingName: false,
  scoreSubmitted: false,
  commitExpanded: false,
  commitCache: [],
  filterCurrentBuild: true,
  filterMyScores: false,
  scoreSort: 'score',
  topScoresPage: 0,
  modalSelectionIndex: 0,
  timeScale: 1,
  fps: 0,
  showDamageByPower: false,
  showFps: false,
  showPaddleRects: false,
  showBallTrails: false,
  showLoadoutSidebar: false,
  autoPauseEnabled: true,
  pendingPowerChoices: 0,
  powerModalOpen: false,
  currentPowerOptions: [],
  currentTalentOptions: [],
  currentSelection: null, // { kind: 'power'|'talent', name }
  language: 'en',
  passRemaining: PASS_LIMIT_PER_MODAL,
  rerollRemaining: REROLL_LIMIT_PER_MODAL,
  lastHitSpecial: null,
  lastVampireHeal: 0,
  lastBossLevelSpawned: 0,
  tempHpCooldown: {},
  damageByPower: {},
  beamCooldown: {},
  beamEffects: [],
  starfield: [],
  damageFlashUntil: 0,
  damageShakeUntil: 0,
  shotEffects: [],
  activeShipSkins: [],
  regenStageHeals: 0,
  royalSurgeUntil: 0,
  royalSurgeXpMult: 1,
  migratedFusionKinds: false,
  stageScalingNotified: false,
  maxLifeBonus: 0,
  cachedMaxLives: 0,
  pilotFeats: {},
  pilotUnlocks: []
};
globalThis.__brickidle_state = state;

const bonusState = {};
const beamCooldownMs = 800;
const LOCALES = { en: enLocale, fr: frLocale, es: esLocale };

function makePilotPortrait({ initials, bgStart, bgEnd, face, accent, visor, stroke = accent }) {
  const safeId = (initials || 'P').replace(/[^A-Za-z0-9]/g, '') || 'P';
  const bgId = `pilotBg${safeId}`;
  const visorId = `pilotVisor${safeId}`;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="${bgId}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${bgStart}"/>
      <stop offset="100%" stop-color="${bgEnd}"/>
    </linearGradient>
    <linearGradient id="${visorId}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="${visor}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="88" height="88" rx="20" fill="url(#${bgId})" stroke="${stroke}" stroke-width="3" opacity="0.92"/>
  <circle cx="48" cy="52" r="26" fill="${face}" stroke="${stroke}" stroke-width="3"/>
  <path d="M28 54 Q48 46 68 54 Q64 70 48 74 Q32 70 28 54 Z" fill="${accent}" opacity="0.18"/>
  <rect x="24" y="34" width="48" height="20" rx="10" fill="url(#${visorId})" stroke="${stroke}" stroke-width="2.4" opacity="0.95"/>
  <path d="M32 44 L40 42 M56 42 L64 44" stroke="rgba(11,18,35,0.8)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="48" cy="58" r="8" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <path d="M30 30 C34 20 62 20 66 32" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
  <text x="48" y="88" text-anchor="middle" font-family="Inter, 'Segoe UI', sans-serif" font-size="14" font-weight="800" fill="${accent}" opacity="0.9">${initials}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PILOT_PORTRAITS = {
  pyra: makePilotPortrait({
    initials: 'Py',
    bgStart: '#1f0a15',
    bgEnd: '#f97316',
    face: '#2b1120',
    accent: '#fbbf24',
    visor: '#fb7185',
    stroke: '#fb923c'
  }),
  frostbyte: makePilotPortrait({
    initials: 'Fb',
    bgStart: '#0a1f3f',
    bgEnd: '#38bdf8',
    face: '#0b172a',
    accent: '#7dd3fc',
    visor: '#22d3ee',
    stroke: '#38bdf8'
  }),
  nosfer: makePilotPortrait({
    initials: 'Ns',
    bgStart: '#200018',
    bgEnd: '#ef4444',
    face: '#1b0b17',
    accent: '#c084fc',
    visor: '#f87171',
    stroke: '#f43f5e'
  }),
  atlas: makePilotPortrait({
    initials: 'At',
    bgStart: '#2a1a00',
    bgEnd: '#f59e0b',
    face: '#1f1300',
    accent: '#f8fafc',
    visor: '#fbbf24',
    stroke: '#eab308'
  })
};

const PILOT_DEFS = [
  {
    id: 'pyra',
    name: 'Pyra',
    start: { kind: 'power', name: 'Fire' },
    tagline: '',
    color: '#f97316'
  },
  {
    id: 'frostbyte',
    name: 'Frostbyte',
    start: { kind: 'power', name: 'Ice' },
    tagline: '',
    color: '#38bdf8'
  },
  {
    id: 'nosfer',
    name: 'Nosfer',
    start: { kind: 'power', name: 'Vampire' },
    tagline: '',
    color: '#f43f5e'
  },
  {
    id: 'atlas',
    name: 'Atlas',
    start: { kind: 'power', name: 'Crusher' },
    tagline: '',
    color: '#f59e0b'
  }
];

function t(key) {
  const lang = state?.language || 'en';
  const locale = LOCALES[lang] || LOCALES.en || {};
  const fallback = LOCALES.en || {};
  const resolve = (dict, path) => path.reduce((acc, p) => (acc && acc[p] !== undefined ? acc[p] : null), dict);
  const parts = key.split('.');
  return resolve(locale, parts) ?? resolve(fallback, parts) ?? key;
}

function setAutoButtonLabel() {
  if (!autoBtn) return;
  autoBtn.textContent = 'Auto';
  autoBtn.classList.toggle('active', !!state.autoPlay);
}

function applyTranslations() {
  const lang = state.language || 'en';
  const locale = LOCALES[lang] || LOCALES.en;
  if (!locale) return;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.type === 'text' || el.tagName === 'TEXTAREA') el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-list]').forEach((el) => {
    const key = el.dataset.i18nList;
    const list = t(key);
    if (Array.isArray(list)) {
      el.innerHTML = '';
      list.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        el.appendChild(li);
      });
    }
  });
  if (languageSelect) {
    ['en', 'fr', 'es'].forEach((code) => {
      const opt = languageSelect.querySelector(`option[value="${code}"]`);
      if (opt) opt.textContent = t(`settings.lang_${code}`);
    });
    languageSelect.value = lang;
  }
  if (state.awaitingPilot && (pilotConfirmBtn || pilotListEl)) {
    const defaultPilotId = state.selectedPilotId || PILOT_DEFS[0]?.id;
    if (defaultPilotId) {
      handlePilotSelect(defaultPilotId, { silent: true });
    }
  }
  setAutoButtonLabel();
  updatePauseButton();
  if (powerPassBtn) {
    powerPassBtn.textContent = `${t('power_modal.pass')} (${state.passRemaining})`;
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.classList.toggle('disabled', state.passRemaining <= 0);
  }
  if (powerConfirmBtn) powerConfirmBtn.textContent = t('power_modal.confirm');
  if (powerCatalogBtn) powerCatalogBtn.textContent = t('power_modal.catalog');
  if (powerRerollBtn) {
    powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
    powerRerollBtn.disabled = state.rerollRemaining <= 0;
    powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
    powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
  }
}

function pushNotification(text, duration = 3000) {
  if (!notificationPanel || !text) return;
  const item = document.createElement('div');
  item.className = 'notification';
  item.textContent = text;
  notificationPanel.appendChild(item);
  setTimeout(() => {
    item.classList.add('hide');
    setTimeout(() => item.remove(), 250);
  }, duration);
}

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
    ['left', 'right', 'up', 'down', 'launch'].forEach((key) => {
      const val = (raw[key] || '').trim();
      if (val) next[key] = val;
    });
  }
  return next;
}

function clampPaddlePosition() {
  const { paddle } = state;
  const mirrorLevel = Math.max(
    getTalentLevel('Mirror'),
    getTalentLevel('Prism Paddle') > 0 ? getTalentDef('Mirror').maxLevel : 0
  );
  const halfWidth = paddle.w * 0.5;
  const gap = 8;
  const minOffset = mirrorLevel >= 1 ? -halfWidth - gap : 0;
  const maxOffset = mirrorLevel >= 2 ? paddle.w + gap + halfWidth : paddle.w;

  // Bordures extérieures
  paddle.x = clamp(paddle.x, -minOffset, CONFIG.width - maxOffset);

  // Clamp final aux bords après ajustements
  paddle.x = clamp(paddle.x, -minOffset, CONFIG.width - maxOffset);

  // Clamp vertical
  const minY = CONFIG.height * 0.5;
  const maxY = CONFIG.height - 40;
  paddle.y = clamp(paddle.y, minY, maxY);
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
    showBallTrails: state.showBallTrails,
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
    r: safeNumber(ball.r, defaults.r ?? baseBallRadius(Boolean(ball.specialPower))),
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
    shakeTime: safeNumber(brick.shakeTime, null),
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
    effectUntil: safeNumber(brick.effectUntil, 0),
    renderScale: safeNumber(brick.renderScale, 1)
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
    if (!raw) {
      if (settingsDamageToggle) settingsDamageToggle.checked = state.showDamageByPower;
      if (settingsFpsToggle) settingsFpsToggle.checked = state.showFps;
      if (settingsPaddleRectToggle) settingsPaddleRectToggle.checked = state.showPaddleRects;
      if (settingsBallTrailsToggle) settingsBallTrailsToggle.checked = state.showBallTrails;
      if (settingsAutoPauseToggle) settingsAutoPauseToggle.checked = state.autoPauseEnabled;
      if (settingsLoadoutSidebarToggle) settingsLoadoutSidebarToggle.checked = state.showLoadoutSidebar;
      if (languageSelect) languageSelect.value = state.language;
    if (settingsLeftInput && settingsRightInput && settingsUpInput && settingsDownInput) {
      settingsLeftInput.value = state.keyBindings.left;
      settingsRightInput.value = state.keyBindings.right;
      settingsUpInput.value = state.keyBindings.up;
      settingsDownInput.value = state.keyBindings.down;
      if (settingsLaunchInput) settingsLaunchInput.value = state.keyBindings.launch;
    }
      return;
    }
    const data = JSON.parse(raw);
    if ([1, 2, 3, 5].includes(Number(data.timeScale))) {
      setTimeScale(Number(data.timeScale));
    }
    if (typeof data.autoPlay === 'boolean') {
      state.autoPlay = data.autoPlay;
      setAutoButtonLabel();
    }
    if (typeof data.language === 'string' && ['en', 'fr', 'es'].includes(data.language)) {
      state.language = data.language;
      if (languageSelect) languageSelect.value = state.language;
    } else if (languageSelect) {
      languageSelect.value = state.language;
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
    }
    if (scoreSortSelect) {
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
    if (typeof data.showPaddleRects === 'boolean') {
      state.showPaddleRects = data.showPaddleRects;
      if (settingsPaddleRectToggle) settingsPaddleRectToggle.checked = state.showPaddleRects;
    } else if (settingsPaddleRectToggle) {
      settingsPaddleRectToggle.checked = state.showPaddleRects;
    }
    if (typeof data.showBallTrails === 'boolean') {
      state.showBallTrails = data.showBallTrails;
      if (settingsBallTrailsToggle) settingsBallTrailsToggle.checked = state.showBallTrails;
    } else if (settingsBallTrailsToggle) {
      settingsBallTrailsToggle.checked = state.showBallTrails;
    }
    if (typeof data.autoPauseEnabled === 'boolean') {
      state.autoPauseEnabled = data.autoPauseEnabled;
      if (settingsAutoPauseToggle) settingsAutoPauseToggle.checked = state.autoPauseEnabled;
    } else if (settingsAutoPauseToggle) {
      settingsAutoPauseToggle.checked = state.autoPauseEnabled;
    }
    if (typeof data.showLoadoutSidebar === 'boolean') {
      state.showLoadoutSidebar = data.showLoadoutSidebar;
      if (settingsLoadoutSidebarToggle) settingsLoadoutSidebarToggle.checked = state.showLoadoutSidebar;
    } else if (settingsLoadoutSidebarToggle) {
      settingsLoadoutSidebarToggle.checked = state.showLoadoutSidebar;
    }
    if (data.keyBindings) {
      state.keyBindings = sanitizeKeyBindings(data.keyBindings);
    }
    if (settingsLeftInput && settingsRightInput && settingsUpInput && settingsDownInput) {
      settingsLeftInput.value = state.keyBindings.left;
      settingsRightInput.value = state.keyBindings.right;
      settingsUpInput.value = state.keyBindings.up;
      settingsDownInput.value = state.keyBindings.down;
      if (settingsLaunchInput) settingsLaunchInput.value = state.keyBindings.launch;
    }
    if (!data.prefsVersion || Number(data.prefsVersion) < 1) {
      state.scoreSort = 'score';
      state.showDamageByPower = false;
      state.showFps = false;
      state.showPaddleRects = false;
      state.showBallTrails = false;
      state.showLoadoutSidebar = false;
      state.autoPauseEnabled = true;
      if (scoreSortSelect) scoreSortSelect.value = state.scoreSort;
      if (settingsDamageToggle) settingsDamageToggle.checked = state.showDamageByPower;
      if (settingsFpsToggle) settingsFpsToggle.checked = state.showFps;
      if (settingsPaddleRectToggle) settingsPaddleRectToggle.checked = state.showPaddleRects;
      if (settingsBallTrailsToggle) settingsBallTrailsToggle.checked = state.showBallTrails;
      if (settingsAutoPauseToggle) settingsAutoPauseToggle.checked = state.autoPauseEnabled;
      if (settingsLoadoutSidebarToggle) settingsLoadoutSidebarToggle.checked = state.showLoadoutSidebar;
      data.prefsVersion = 1;
    }
    if (!state.migratedFusionKinds) {
      // Move Prism Paddle / Royal Surge from powers to talents if present
      const talentFusions = ['Prism Paddle', 'Royal Surge', 'Thornstep'];
      const moved = [];
      state.powers = state.powers.filter((p) => {
        if (talentFusions.includes(p.name)) {
          moved.push({ name: p.name, level: p.level || 1 });
          return false;
        }
        return true;
      });
      moved.forEach((t) => {
        const existing = state.talents.find((x) => x.name === t.name);
        if (existing) existing.level = Math.max(existing.level, t.level);
        else state.talents.push({ name: t.name, level: t.level });
      });
      state.migratedFusionKinds = true;
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
      language: state.language,
      commitExpanded: state.commitExpanded,
      topScoresExpanded: state.topScoresExpanded,
      suggestionExpanded: state.suggestionExpanded,
      filterCurrentBuild: state.filterCurrentBuild,
      filterMyScores: state.filterMyScores,
      scoreSort: state.scoreSort,
      showDamageByPower: state.showDamageByPower,
      showFps: state.showFps,
      showPaddleRects: state.showPaddleRects,
      showBallTrails: state.showBallTrails,
      showLoadoutSidebar: state.showLoadoutSidebar,
      autoPauseEnabled: state.autoPauseEnabled,
      prefsVersion: 1,
      keyBindings: {
        ...state.keyBindings,
        launch: undefined
      }
    };
    localStorage.setItem(PREFS_KEY, JSON.stringify(payload));
  } catch (_) {
    // ignore storage errors
  }
}

function markSessionDirty() {
  sessionDirty = true;
}

function savePilotProgress() {
  try {
    const payload = {
      feats: state.pilotFeats || {},
      unlocks: state.pilotUnlocks || []
    };
    localStorage.setItem(PILOT_PROGRESS_KEY, JSON.stringify(payload));
  } catch (_) {
    // ignore
  }
}

function loadPilotProgress() {
  try {
    const raw = localStorage.getItem(PILOT_PROGRESS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed?.feats) state.pilotFeats = parsed.feats;
    if (Array.isArray(parsed?.unlocks)) state.pilotUnlocks = parsed.unlocks;
    ensurePilotUnlocks();
  } catch (_) {
    // ignore
  }
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
      awaitingPilot: state.awaitingPilot,
      activePilotId: state.activePilotId,
      selectedPilotId: state.selectedPilotId,
      pilotFeats: state.pilotFeats,
      pilotUnlocks: state.pilotUnlocks,
      playerName: state.playerName,
      backendTopScores: state.backendTopScores
    }
  };
}

function saveSession() {
  clearSession(); // on ne persiste plus la partie, juste les feats/pilots via prefs
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
  maybeOpenPilotModal();
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

function renderPilotModal() {
  if (!pilotListEl) return;
  if (pilotSubtitle) {
    pilotSubtitle.textContent = t('pilot_modal.subtitle');
  }
  ensurePilotUnlocks();
  // reset scroll to avoid content hidden on top when re-opening
  pilotListEl.scrollTop = 0;
  pilotListEl.innerHTML = '';
  PILOT_DEFS.forEach((pilot, idx) => {
    const { title, desc } = getPilotStartDescription(pilot);
    const startMedia = MEDIA_BY_NAME[pilot.start?.name];
    const startIcon = startMedia?.imageUrl
      ? `<img src="${startMedia.imageUrl}" alt="${pilot.start?.name || ''}" class="pilot-start-icon" style="width:28px; height:28px;" />`
      : '';
    const locked = !state.pilotUnlocks[idx];
    const feats = getPilotFeats(pilot.id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `pilot-card${locked ? ' locked' : ''}`;
    card.dataset.pilotId = pilot.id;
    card.innerHTML = `
      <div class="pilot-avatar" style="border-color:${pilot.color || '#334155'};">
        <img src="${PILOT_PORTRAITS[pilot.id] || ''}" alt="${pilot.name}" />
      </div>
      <div class="pilot-card-body" style="display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <span class="pilot-name">${pilot.name}</span>
          <span class="pilot-start-title" style="display:inline-flex; align-items:center; gap:6px; font-weight:700;">
            ${startIcon ? `<span class="pilot-start-icon-wrap">${startIcon}</span>` : ''}
            <span>${title}</span>
          </span>
        </div>
        ${pilot.tagline ? `<span class="pilot-tagline">${pilot.tagline}</span>` : ''}
        <span class="pilot-start-desc">${desc}</span>
        <div class="pilot-feats">
          ${[0, 1, 2].map((i) => `<span class="pilot-feat ${feats[i] ? 'checked' : ''}"></span>`).join('')}
        </div>
      </div>
    `;
    card.onclick = () => handlePilotSelect(pilot.id);
    pilotListEl.appendChild(card);
    if (idx === 0 && !state.selectedPilotId) {
      handlePilotSelect(pilot.id, { silent: true });
    }
  });
  if (pilotConfirmBtn) {
    pilotConfirmBtn.disabled = !state.selectedPilotId;
  }
}

function handlePilotSelect(pilotId, options = {}) {
  const pilot = getPilotDef(pilotId);
  if (!pilot) return;
  state.selectedPilotId = pilot.id;
  if (pilotListEl) {
    const cards = Array.from(pilotListEl.querySelectorAll('.pilot-card'));
    cards.forEach((card) => {
      const isActive = card.dataset.pilotId === pilot.id;
      card.classList.toggle('selected', isActive);
    });
  }
  if (pilotConfirmBtn) {
    pilotConfirmBtn.disabled = false;
    const baseLabel = t('pilot_modal.confirm');
    pilotConfirmBtn.textContent = `${baseLabel} · ${pilot.name}`;
  }
  if (!options.silent) {
    const activeCard = pilotListEl?.querySelector('.pilot-card.selected');
    if (activeCard) activeCard.focus();
  }
}

function grantStartingLoadout(pilot) {
  if (!pilot?.start) return;
  if (pilot.start.kind === 'power') {
    applyPower(pilot.start.name, { consumeChoice: false, skipClose: true, fromPilot: true });
  } else if (pilot.start.kind === 'talent') {
    applyTalent(pilot.start.name, { consumeChoice: false, skipClose: true, fromPilot: true });
  }
  refreshPauseState();
}

function closePilotModal() {
  if (pilotModalBackdrop) pilotModalBackdrop.classList.remove('open');
  state.awaitingPilot = false;
  refreshPauseState();
}

function maybeOpenPilotModal() {
  if (
    !state.awaitingPilot ||
    state.awaitingName ||
    state.infoOpen ||
    state.catalogOpen ||
    state.settingsOpen ||
    state.powerModalOpen
  ) {
    refreshPauseState();
    return;
  }
  if (!pilotModalBackdrop) return;
  renderPilotModal();
  pilotModalBackdrop.classList.add('open');
  state.paused = true;
  refreshPauseState();
}

function openPilotModal() {
  state.awaitingPilot = true;
  maybeOpenPilotModal();
}

function handlePilotConfirm() {
  const pilot = getPilotDef(state.selectedPilotId);
  if (!pilot) return;
  const idx = getPilotIndex(pilot.id);
  ensurePilotUnlocks();
  if (idx > 0 && !state.pilotUnlocks[idx]) return; // verrouillé
  state.activePilotId = pilot.id;
  state.selectedPilotId = pilot.id;
  closePilotModal();
  grantStartingLoadout(pilot);
  pushNotification(`${pilot.name} ready (Lv.1 ${pilot.start?.name || 'Loadout'})`, 5000);
  markSessionDirty();
  refreshPauseState();
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
  maybeOpenPilotModal();
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
  maybeOpenPilotModal();
}

function openSettingsModal() {
  if (!settingsModalBackdrop) return;
  state.paused = true;
  state.settingsOpen = true;
  settingsLeftInput.value = state.keyBindings.left;
  settingsRightInput.value = state.keyBindings.right;
  if (settingsUpInput) settingsUpInput.value = state.keyBindings.up;
  if (settingsDownInput) settingsDownInput.value = state.keyBindings.down;
  if (settingsLaunchInput) settingsLaunchInput.value = state.keyBindings.launch;
  if (settingsDamageToggle) settingsDamageToggle.checked = !!state.showDamageByPower;
  if (settingsFpsToggle) settingsFpsToggle.checked = !!state.showFps;
  if (settingsPaddleRectToggle) settingsPaddleRectToggle.checked = !!state.showPaddleRects;
  if (settingsBallTrailsToggle) settingsBallTrailsToggle.checked = !!state.showBallTrails;
  if (settingsAutoPauseToggle) settingsAutoPauseToggle.checked = !!state.autoPauseEnabled;
  if (settingsLoadoutSidebarToggle) settingsLoadoutSidebarToggle.checked = !!state.showLoadoutSidebar;
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
  maybeOpenPilotModal();
}

function applySettingsBindings() {
    const left = (settingsLeftInput?.value || '').trim();
    const right = (settingsRightInput?.value || '').trim();
    const up = (settingsUpInput?.value || '').trim();
    const down = (settingsDownInput?.value || '').trim();
    state.keyBindings = sanitizeKeyBindings({
      left,
      right,
      up,
      down,
      launch: state.keyBindings.launch
    });
  if (settingsDamageToggle) {
    state.showDamageByPower = !!settingsDamageToggle.checked;
  }
  if (settingsFpsToggle) {
    state.showFps = !!settingsFpsToggle.checked;
  }
  if (settingsPaddleRectToggle) {
    state.showPaddleRects = !!settingsPaddleRectToggle.checked;
  }
  if (settingsBallTrailsToggle) {
    state.showBallTrails = !!settingsBallTrailsToggle.checked;
  }
  if (settingsAutoPauseToggle) {
    state.autoPauseEnabled = !!settingsAutoPauseToggle.checked;
  }
  if (settingsLoadoutSidebarToggle) {
    state.showLoadoutSidebar = !!settingsLoadoutSidebarToggle.checked;
  }
  savePreferences();
}

function setTimeScale(scale) {
  state.timeScale = scale;
  // Legacy buttons removed; slider updates below
  updateSpeedSlider();
}

function updateSpeedSlider() {
  if (!speedThumb || !speedFill || !speedStops.length) return;
  const speeds = [1, 2, 3, 5];
  const idx = Math.max(0, speeds.indexOf(state.timeScale));
  const pct = (idx / (speeds.length - 1)) * 100;
  speedThumb.style.left = `${pct}%`;
  speedFill.style.width = `${pct}%`;
  speedStops.forEach((stop) => {
    const val = Number(stop.dataset.speed);
    const active = val === state.timeScale;
    stop.classList.toggle('active', active);
  });
}

function getBallSpeed(isSpecial) {
  const base = CONFIG.ballSpeed;
  const plumeLevel = getTalentLevel('Feather');
  const surgeLevel = getTalentLevel('Surge');
  const surgeActive = surgeLevel > 0 && state.surgeUntil && state.surgeUntil > (performance.now ? performance.now() : Date.now());
  const surgeMult = surgeActive ? 1.2 : 1;
  const mult = (1 + 0.1 * plumeLevel) * surgeMult;
  return (isSpecial ? base : base * CONFIG.standardBallSpeedMultiplier) * mult;
}

function getBallBaseDamage(ball) {
  const base = ball?.specialPower === 'Metal' ? 3 : 1;
  const boost = 1 + 0.1 * getTalentLevel('Booster');
  return base * boost;
}

function baseBallRadius(isSpecial, antiGravityLevel = 0) {
  const base = CONFIG.ballRadius;
  const mult = 1 + 0.15 * Math.max(0, antiGravityLevel);
  return (isSpecial ? base : base * CONFIG.standardBallRadiusMultiplier) * mult;
}

function getBallRadius(isSpecial) {
  const st = globalThis.__brickidle_state;
  const gravityLv = Array.isArray(st?.talents)
    ? st.talents.find((t) => t.name === 'Gravity')?.level || 0
    : 0;
  return baseBallRadius(isSpecial, gravityLv);
}

function grantTempHpOnce(powerName, amount = 2, cooldownMs = 5000) {
  const now = performance.now ? performance.now() : Date.now();
  state.tempHpCooldown = state.tempHpCooldown || {};
  const last = state.tempHpCooldown[powerName] || 0;
  if (now - last < cooldownMs) return false;
  state.tempHpCooldown[powerName] = now;
  const maxLife = getMaxLives();
  state.lives = Math.min(maxLife + amount, state.lives + amount);
  return true;
}

function getMaxLives() {
  const stimLevel = getTalentLevel('Stim Pack');
  const playerBracketBonus = Math.floor((state.playerLevel || 0) / 5);
  const bonus = state.maxLifeBonus || 0;
  return CONFIG.maxLives + stimLevel * 5 + playerBracketBonus + bonus;
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
  const aimMult = state.autoPlay ? 0.5 : 2; // slower in auto-aim, faster in manual
  return CONFIG.paddleSpeed * mult * aimMult;
}

function getPaddleMaxSpeed() {
  const level = getTalentLevel('Boots');
  const mult = 1 + 0.1 * level;
  const aimMult = state.autoPlay ? 0.5 : 2;
  return CONFIG.paddleMaxSpeed * mult * aimMult;
}

function getCooldowns(nextIsSpecial) {
  const level = getTalentLevel('Gloves');
  const mult = 1 / (1 + 0.1 * level + (level === 3 ? 0.05 : 0));
  const base = nextIsSpecial ? CONFIG.specialShotCooldownMs : CONFIG.normalShotCooldownMs;
  return base * mult;
}

function getPaddleWidth() {
  const level = Math.max(
    getTalentLevel('Paddle'),
    getTalentLevel('Prism Paddle') > 0 ? getTalentDef('Paddle').maxLevel : 0
  );
  const mult = 1 + 0.2 * level;
  return CONFIG.paddleWidth * mult;
}

function getPowerDef(name) {
  return ALL_POWER_DEFS.find((p) => p.name === name) || { name, maxLevel: 1 };
}

function getTalentDef(name) {
  return TALENT_DEFS.find((t) => t.name === name) || { name, maxLevel: 1 };
}

function getPilotDef(id) {
  return PILOT_DEFS.find((p) => p.id === id) || null;
}

function getPilotIndex(id) {
  return PILOT_DEFS.findIndex((p) => p.id === id);
}

function getPilotStartDescription(pilot) {
  if (!pilot?.start) return { title: '', desc: '' };
  const isPower = pilot.start.kind === 'power';
  const name = pilot.start.name;
  const desc = isPower ? getPowerDescription(name) : getTalentDescription(name);
  const titleKey = isPower ? 'pilot_modal.start_power' : 'pilot_modal.start_talent';
  const levelLabel = state.language === 'fr' ? 'Niv. 1' : state.language === 'es' ? 'Nv. 1' : 'Lv. 1';
  const title = `${name} (${levelLabel})`;
  return { title, desc: desc?.plain || '' };
}

function getPilotFeats(pilotId) {
  const feats = state.pilotFeats || {};
  const entry = feats[pilotId];
  if (Array.isArray(entry) && entry.length === 3) return entry;
  return [false, false, false];
}

function setPilotFeat(pilotId, index, value = true) {
  if (!state.pilotFeats) state.pilotFeats = {};
  const arr = Array.isArray(state.pilotFeats[pilotId]) ? [...state.pilotFeats[pilotId]] : [false, false, false];
  arr[index] = value;
  state.pilotFeats[pilotId] = arr;
  savePilotProgress();
}

function ensurePilotUnlocks() {
  if (!Array.isArray(state.pilotUnlocks)) {
    state.pilotUnlocks = [];
  }
  while (state.pilotUnlocks.length < PILOT_DEFS.length) {
    state.pilotUnlocks.push(false);
  }
  state.pilotUnlocks[0] = true; // le premier est toujours disponible
}

function unlockPilot(index) {
  ensurePilotUnlocks();
  if (index >= 0 && index < state.pilotUnlocks.length) {
    state.pilotUnlocks[index] = true;
    savePilotProgress();
  }
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
        plain: 'Deals delayed damage (+1 at 1.5s, +2 at 3s) and spreads to 2 nearby bricks after 1s if the target survives',
        rich: 'Delayed hits: <span class="power-desc-accent">+1 @1.5s</span>, <span class="power-desc-accent">+2 @3s</span>; spreads to <span class="power-desc-accent">2 nearby</span> after <span class="power-desc-accent">1s</span> if target survives'
      };
    case 'Wind':
      return {
        plain: 'Ball pierces up to 3 bricks then returns to the paddle (1 hit per brick)',
        rich: 'Ball pierces <span class="power-desc-accent">up to 3 bricks</span> then returns to the paddle <span class="power-desc-muted">(1 hit per brick)</span>'
      };
    case 'Crusher':
      return {
        plain: 'On hit, shoves the brick slightly (up to 3 pushes before the ball snaps back if not blocked)',
        rich: 'On hit, <span class="power-desc-accent">shoves</span> the brick slightly <span class="power-desc-muted">(max 3 pushes before snapping back; blocked bricks won’t move)</span>'
      };
    case 'Meteor':
      return {
        plain: 'Fusion of Fire + Crusher: stronger shove, stacks small burns, and triggers a cone blast after 2 pushes before returning',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Fire + Crusher</span>: stronger shove, small burns, cone blast after <span class="power-desc-accent">2 pushes</span> then returns'
      };
    case 'Beamline':
      return {
        plain: 'On hit: spawns a horizontal laser that hits all bricks on that row (1 dmg, 0.8s cooldown)',
        rich: 'On hit: fires a <span class="power-desc-accent">horizontal laser</span> hitting all bricks on that row <span class="power-desc-muted">(1 dmg, 0.8s cd)</span>'
      };
    case 'Pillar':
      return {
        plain: 'On hit: spawns a vertical laser that hits all bricks on that column (1 dmg, 0.8s cooldown)',
        rich: 'On hit: fires a <span class="power-desc-accent">vertical laser</span> hitting all bricks on that column <span class="power-desc-muted">(1 dmg, 0.8s cd)</span>'
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
        plain: 'Fusion of Pillar + Curse: longer stun/curse and spreads curse to 3 nearby bricks',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Pillar + Curse</span>: longer stun/curse and spreads curse to <span class="power-desc-accent">3 nearby</span> bricks'
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
        plain: 'Fusion of Beamline + Mirror: small stun on ricochets and a bonus rebound that deals extra chip damage',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Beamline + Mirror</span>: small stun on ricochets and one bonus rebound with extra <span class="power-desc-accent">chip damage</span>'
      };
    case 'Bramble':
      return {
        plain: 'Fusion of Vampire + Feather: lifesteal vines, faster thorn ticks, slight ball speed on return',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Vampire + Feather</span>: lifesteal vines, faster thorn ticks, slight ball speed boost on return'
      };
    case 'Radiance':
      return {
        plain: 'Fusion of Pillar + Stim Pack: on pick gain +15 max HP, and hits briefly stun',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Pillar + Stim Pack</span>: on pick gain <span class="power-desc-accent">+15 max HP</span> and hits briefly stun'
      };
    case 'Shard':
      return {
        plain: 'Fusion of Ice + Gloves: fires 4 ice shards in a cone (1.5 damage each)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Ice + Gloves</span>: cone of <span class="power-desc-accent">4 shards</span> (<span class="power-desc-accent">1.5 dmg</span> each)'
      };
    case 'Plaguefire':
      return {
        plain: 'Fusion of Fire + Curse: applies fire splash and a curse that can spread to 2',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Fire + Curse</span>: fire splash + curse that can spread to <span class="power-desc-accent">2</span>'
      };
    case 'Jetstream':
      return {
        plain: 'Fusion of Beamline + Wind: pierces 3 bricks with light auto-steer, then snaps back faster',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Beamline + Wind</span>: pierces <span class="power-desc-accent">3 bricks</span> with light auto-steer, then <span class="power-desc-accent">snaps back faster</span>'
      };
    case 'Cyclone':
      return {
        plain: 'Fusion of Wind + Curse: pierces 3 bricks, curses each pierced brick (+2 dmg after 2s), then snaps back fast',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Wind + Curse</span>: pierces <span class="power-desc-accent">3 bricks</span>, curses pierced bricks (<span class="power-desc-accent">+2 dmg @2s</span>), then <span class="power-desc-accent">snaps back fast</span>'
      };
    case 'Crossfire':
      return {
        plain: 'Fusion of Beamline + Pillar: fires both horizontal and vertical lasers on hit (1 dmg, ~0.65s cooldown)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Beamline + Pillar</span>: fires <span class="power-desc-accent">horizontal + vertical</span> lasers on hit <span class="power-desc-muted">(1 dmg, ~0.65s cd)</span>'
      };
    case 'Storm':
      return {
        plain: 'Fusion of Pillar + Metal: chains to 2 nearby with +50% damage and a brief stun',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Pillar + Metal</span>: chains to <span class="power-desc-accent">2 nearby</span> with <span class="power-desc-accent">+50% damage</span> and brief stun'
      };
    case 'Aurora':
      return {
        plain: 'Fusion of Pillar + Curse: longer stun/curse and spreads curse to 3 nearby bricks',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Pillar + Curse</span>: longer stun/curse and spreads to <span class="power-desc-accent">3 nearby</span> bricks'
      };
    case 'Radiant':
      return {
        plain: 'Fusion of Vampire + Resilience: stun on hit + +2 temp HP shield for 5s',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Vampire + Resilience</span>: stun on hit + <span class="power-desc-accent">+2 temp HP</span> shield for <span class="power-desc-accent">5s</span>'
      };
    case 'Mirrorwind':
      return {
        plain: 'Fusion of Wind + Mirror: pierces more and spawns a mirrored ghost ball (50% dmg)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Wind + Mirror</span>: extra pierce and a mirrored ghost ball <span class="power-desc-accent">(50% dmg)</span>'
      };
    case 'Gale':
      return {
        plain: 'Fusion of Crusher + Wind: pierces then returns, while each hit shoves the brick unless blocked',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Crusher + Wind</span>: pierces then returns, each hit <span class="power-desc-accent">shoves</span> the brick unless blocked'
      };
    case 'Photon':
      return {
        plain: 'Fusion of Light + Crusher: shoves the brick and briefly stuns it and up to 2 nearby, snapping back sooner after 2 pushes',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Crusher</span>: shoves target, <span class="power-desc-accent">stuns</span> target + up to 2 nearby, snaps back after <span class="power-desc-accent">2 pushes</span>'
      };
    case 'Pestilence':
      return {
        plain: 'Fusion of Poison + Curse: longer DoT/curse; spreads infection to 1 nearby every 1.5s while alive (limited)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Poison + Curse</span>: longer DoT/curse; spreads to <span class="power-desc-accent">1 nearby</span> every <span class="power-desc-accent">1.5s</span> while alive (limited)'
      };
    case 'Prism Paddle':
      return {
        plain: 'Fusion of Paddle + Mirror: adds two short side mirrors that grant angled rebounds and slight width increase; mirror hits give a small speed bump',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Paddle + Mirror</span>: short side mirrors for angled rebounds + slight width; mirror hits add a <span class="power-desc-accent">speed bump</span>'
      };
    case 'Royal Surge':
      return {
        plain: 'Fusion of Crown + Surge: on stage start, gain surge speed + bonus XP buff for a few seconds; while buffed, deal +10% damage',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Crown + Surge</span>: stage start surge + <span class="power-desc-accent">bonus XP buff</span>; while active, damage <span class="power-desc-accent">+10%</span>'
      };
    case 'Radiant':
      return {
        plain: 'Fusion of Light + Resilience: stuns on hit and grants a brief shield (+2 temp HP, 5s)',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Light + Resilience</span>: stun on hit + <span class="power-desc-accent">+2 temp HP</span> shield for <span class="power-desc-accent">5s</span>'
      };
    case 'Thornstep':
      return {
        plain: 'Fusion of Thorns + Boots: faster thorn ticks and a brief slow on hit',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Thorns + Boots</span>: faster thorn ticks + short slow on hit'
      };
    case 'Scopebeam':
      return {
        plain: 'Fusion of Beamline + Scope: fires both horizontal and vertical beams with better focus',
        rich: '<strong>Fusion</strong> of <span class="power-desc-accent">Beamline + Scope</span>: fires <span class="power-desc-accent">horizontal + vertical</span> beams with focused aim'
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
        plain: 'Increases fire rate by 10% per level (Lv3: +35% total)',
        rich: 'Fire rate <span class="power-desc-accent">+10%</span> per level <span class="power-desc-muted">(Lv3 = <span class="power-desc-accent">+35%</span>)</span>'
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
    case 'Stim Pack':
      return {
        plain: 'Increases max HP by 5 per level and +5 per player level bracket (every 5 levels) while owned',
        rich: 'Max HP <span class=\"power-desc-accent\">+5</span> per level and <span class=\"power-desc-accent\">+5</span> per player <span class=\"power-desc-accent\">5-level</span> bracket while owned'
      };
    case 'Scope':
      return {
        plain: 'Reduces aim jitter cone by 1.5° per level (more precise shots)',
        rich: 'Aim jitter cone <span class=\"power-desc-accent\">-1.5°</span> per level <span class=\"power-desc-muted\">(more precise)</span>'
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
        plain: 'On new stage: ball speed +20% for 4s (+1s per level)',
        rich: 'On stage start: ball speed <span class=\"power-desc-accent\">+20%</span> for <span class=\"power-desc-accent\">4s</span> <span class=\"power-desc-muted\">(+1s per level)</span>'
      };
    case 'Gravity':
      return {
        plain: 'Increases ball size by 15% per level (max 45%)',
        rich: 'Ball size <span class=\"power-desc-accent\">+15%</span> per level <span class=\"power-desc-muted\">(max 45%)</span>'
      };
    case 'Crown':
      return {
        plain: 'Gain +10% XP per level from all sources',
        rich: 'XP gain <span class=\"power-desc-accent\">+10%</span> per level from all sources'
      };
    case 'Regen':
      return {
        plain: 'Gain +1 HP per stage at level 1 (+1 per level)',
        rich: 'Heal <span class=\"power-desc-accent\">+1 HP</span> per stage <span class=\"power-desc-muted\">(+1 per level)</span>'
      };
    case 'Prism Paddle':
      return {
        plain: 'Fusion (Paddle + Mirror): short side mirrors, slight width & speed bump on rebounds',
        rich: '<strong>Fusion</strong> Paddle + Mirror: side mirrors for angled rebounds; slight width & speed bump'
      };
    case 'Royal Surge':
      return {
        plain: 'Fusion (Crown + Surge): stage start speed + bonus XP buff; while active, damage +10%',
        rich: '<strong>Fusion</strong> Crown + Surge: stage start surge + <span class=\"power-desc-accent\">bonus XP</span>; buff gives <span class=\"power-desc-accent\">+10% dmg</span>'
      };
    case 'Booster':
      return {
        plain: 'Boosts all damage by 10% per level (max 30%)',
        rich: 'All damage <span class=\"power-desc-accent\">+10%</span> per level <span class=\"power-desc-muted\">(max 30%)</span>'
      };
    case 'Twin Core':
      return {
        plain: 'Lv1: max-level powers grant +1 extra ball when picked. Lv2: fusions grant +1 extra ball.',
        rich: '<span class=\"power-desc-accent\">Lv1</span>: max-level powers grant <span class=\"power-desc-accent\">+1 extra ball</span> when picked. <span class=\"power-desc-accent\">Lv2</span>: fusions grant <span class=\"power-desc-accent\">+1 ball</span>.'
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

function getFusionsForName(name) {
  return FUSION_DEFS.filter((f) => Array.isArray(f.ingredients) && f.ingredients.includes(name));
}

function hasOwnedFusionPartner(name) {
  return getFusionsForName(name).some((fusion) => {
    const others = (fusion.ingredients || []).filter((ing) => ing !== name);
    return others.some((ing) => getPowerLevel(ing) > 0 || getTalentLevel(ing) > 0);
  });
}

function getActiveTalentIcons() {
  return uniqueIconList(state.activeShipSkins || []);
}

function getActivePowerIcons() {
  return uniqueIconList((state.powers || []).map((p) => p.name));
}

function removeShipSkins(names = []) {
  if (!Array.isArray(names) || !names.length) return;
  const removal = new Set(names);
  state.activeShipSkins = (state.activeShipSkins || []).filter((name) => !removal.has(name));
}

function uniqueIconList(names = []) {
  const seen = new Set();
  const list = [];
  names.forEach((name) => {
    if (!name || seen.has(name)) return;
    seen.add(name);
    const img = getIconImage(name);
    if (img) list.push({ name, img });
  });
  return list;
}

function getIconImage(name) {
  if (!name) return null;
  if (iconCache[name]) return iconCache[name];
  const media = MEDIA_BY_NAME[name];
  if (!media?.imageUrl) return null;
  const img = new Image();
  img.src = media.imageUrl;
  iconCache[name] = img;
  return img;
}

function isTalentName(name) {
  return TALENT_DEFS.some((t) => t.name === name);
}

function fusionKind(fusion) {
  if (!fusion?.fusion) return 'power';
  if (fusion?.kind === 'talent') return 'talent';
  if (fusion?.kind === 'power') return 'power';
  const ingredients = fusion?.ingredients || [];
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
  if (fusion && fusionKind(fusion) === 'talent' && hasFusionIngredients(fusion)) {
    // Block ingredients if fusion already owned
    const ownedFusion = getTalentLevel(name) > 0;
    const ingredientOwned = fusion.ingredients.some((ing) => getPowerLevel(ing) > 0 || getTalentLevel(ing) > 0);
    if (ownedFusion && ingredientOwned) return false;
  }
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
    case 'Beamline':
      return 'rgba(94, 234, 212, 0.35)';
    case 'Pillar':
      return 'rgba(192, 132, 252, 0.35)';
    case 'Mirrorwind':
      return 'rgba(125, 211, 252, 0.45)';
    case 'Radiant Shield':
      return 'rgba(253, 230, 138, 0.45)';
    case 'Thornstep':
      return 'rgba(52, 211, 153, 0.45)';
    case 'Scopebeam':
      return 'rgba(94, 234, 212, 0.45)';
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
  const jitter = degToRad(Math.max(0, CONFIG.aimJitterDeg - 1.5 * getTalentLevel('Scope')));
  const offset = (Math.random() * 2 - 1) * jitter;
  const speed = Math.hypot(vx, vy);
  const nx = Math.cos(angle + offset);
  const ny = Math.sin(angle + offset);
  return { vx: nx * speed, vy: ny * speed };
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
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

function initStarfield() {
  state.starfield = STARFIELD_LAYERS.flatMap((layer) =>
    Array.from({ length: layer.count }, () => ({
      x: Math.random() * CONFIG.width,
      y: Math.random() * CONFIG.height,
      r: randomBetween(layer.size[0], layer.size[1]),
      speed: layer.speed,
      alpha: randomBetween(layer.alpha[0], layer.alpha[1])
    }))
  );
  starfieldLastTime = performance.now ? performance.now() : Date.now();
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
  const raw = Math.min(base + ramp, 5);
  const stage = state.level || 1;
  const extraScale = stage >= 20 ? 1 + 0.01 * (stage - 19) : 1;
  return Math.max(1, Math.ceil(raw * extraScale));
}

function xpForLevel(level) {
  const base = 10 + (level - 1) * 5;
  return Math.ceil(base * 1.25);
}

function gainXp(amount) {
  const now = performance.now ? performance.now() : Date.now();
  const crownLv = getTalentLevel('Crown');
  const crownMult = 1 + 0.1 * crownLv;
  const surgeMult = state.royalSurgeUntil && state.royalSurgeUntil > now ? state.royalSurgeXpMult || 1 : 1;
  const totalMult = crownMult * surgeMult;
  const gained = Math.max(1, Math.round(amount * totalMult));
  state.xp += gained;
  let leveled = false;
  let prevMaxLife = getMaxLives();
  while (state.xp >= state.xpNeeded) {
    state.xp -= state.xpNeeded;
    state.playerLevel += 1;
    state.xpNeeded = xpForLevel(state.playerLevel);
    state.pendingPowerChoices += 1;
    const newMaxLife = getMaxLives();
    if (newMaxLife > prevMaxLife) {
      const delta = newMaxLife - prevMaxLife;
      state.lives = Math.min(newMaxLife, state.lives + delta);
      pushNotification(`Max HP +${delta} (Level ${state.playerLevel})`, 5000);
    }
    prevMaxLife = newMaxLife;
    checkPilotFeatProgress(state.level);
    leveled = true;
  }
  state.cachedMaxLives = prevMaxLife;
  if (leveled) {
    tryOpenPowerModal();
  }
}

function checkPilotFeatProgress(stageLevel) {
  if (!state.activePilotId) return;
  ensurePilotUnlocks();
  const caps = [10, 40, 60];
  caps.forEach((cap, idx) => {
    if (stageLevel >= cap && !getPilotFeats(state.activePilotId)[idx]) {
      setPilotFeat(state.activePilotId, idx, true);
      const pilotName = getPilotDef(state.activePilotId)?.name || 'Pilot';
      pushNotification(`${pilotName}: Stage ${cap} reached`, 5000);
      if (idx === 0) {
        const currentIndex = getPilotIndex(state.activePilotId);
        const nextIndex = currentIndex + 1;
        if (nextIndex < PILOT_DEFS.length && !state.pilotUnlocks[nextIndex]) {
          unlockPilot(nextIndex);
          const nextName = PILOT_DEFS[nextIndex]?.name || `Pilot ${nextIndex + 1}`;
          pushNotification(`${nextName} unlocked!`, 5000);
        }
      }
    }
  });
}

function tryOpenPowerModal() {
  if (state.powerModalOpen || state.pendingPowerChoices <= 0) return;
  const availablePowers = ALL_POWER_DEFS
    .filter((p) => fusionKind(p) === 'power')
    .map((p) => p.name)
    .filter((name) => canUpgradePower(name));
  const blockedTalentIngredients = state.talents
    .filter((t) => {
      const fusion = getFusionDef(t.name);
      return fusion && fusionKind(fusion) === 'talent' && getTalentLevel(t.name) > 0;
    })
    .flatMap((t) => getFusionDef(t.name)?.ingredients || []);
  const blockedByActiveFusion = [...state.powers, ...state.talents]
    .map((p) => getFusionDef(p.name))
    .filter(Boolean)
    .filter((f) => Array.isArray(f.ingredients))
    .flatMap((f) => f.ingredients.filter((ing) => isTalentName(ing)));
  const blockedTalents = new Set([...blockedTalentIngredients, ...blockedByActiveFusion]);
  const availableTalents = [...TALENT_DEFS, ...FUSION_DEFS.filter((f) => fusionKind(f) === 'talent')]
    .map((t) => t.name)
    .filter((name) => !blockedTalents.has(name))
    .filter((name) => canUpgradeTalent(name));

  if (!availablePowers.length && !availableTalents.length) {
    state.pendingPowerChoices = 0;
    refreshPauseState();
    return;
  }

  const powerOptions = sampleOptions(availablePowers, 4);
  const talentOptions = sampleOptions(availableTalents, 4);
  state.currentPowerOptions = powerOptions;
  state.currentTalentOptions = talentOptions;
  renderPowerModal(powerOptions, talentOptions);
  state.paused = true;
  state.powerModalOpen = true;
  state.currentSelection = null;
  powerModalBackdrop.classList.add('open');
  if (powerPassBtn) {
    powerPassBtn.textContent = `${t('power_modal.pass')} (${state.passRemaining})`;
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.classList.toggle('disabled', state.passRemaining <= 0);
  }
  if (powerRerollBtn) {
    powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
    powerRerollBtn.disabled = state.rerollRemaining <= 0;
    powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
    powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
  }
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

function applyPower(powerName, options = {}) {
  const { consumeChoice = true, skipClose = false } = options;
  const def = getPowerDef(powerName);
  const existing = state.powers.find((p) => p.name === powerName);
  const fusion = getFusionDef(powerName);
  const twinCoreLevel = getTalentLevel('Twin Core');
  if (fusion && fusionKind(fusion) === 'talent') return; // route talent fusions elsewhere
  const powerCount = state.powers.length;
  const consumedPower = fusion ? fusion.ingredients.filter((n) => !isTalentName(n)).length : 0;
  if (!existing && !fusion && powerCount >= MAX_POWERS) return;
  if (!existing && fusion && powerCount - consumedPower + 1 > MAX_POWERS) return;
  let newLevel = 1;
  if (existing) {
    if (existing.level >= def.maxLevel) {
      if (consumeChoice) state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
      if (!skipClose) {
        closePowerModal();
        refreshPauseState();
      }
      if (consumeChoice && state.pendingPowerChoices > 0) tryOpenPowerModal();
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
      removeShipSkins(fusion.ingredients);
      purgeFusionIngredients(fusion);
    }
    if (powerName === 'Radiance') {
      state.maxLifeBonus = (state.maxLifeBonus || 0) + 15;
      const maxLife = getMaxLives();
      state.cachedMaxLives = maxLife;
      state.lives = Math.min(maxLife, state.lives + 15);
      pushNotification('Radiance: Max HP +15', 5000);
    }
  }
  if (newLevel <= 2) {
    const bonusBalls = fusion ? 2 : 1;
    for (let i = 0; i < bonusBalls; i += 1) {
      state.specialPocket.push(powerName);
    }
  }
  if (!fusion && twinCoreLevel >= 1 && newLevel === def.maxLevel) {
    state.specialPocket.push(powerName);
  }
  if (fusion && twinCoreLevel >= 2) {
    state.specialPocket.push(powerName);
  }
  clampLivesToMax();
  if (consumeChoice) {
    state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  }
  if (!skipClose) {
    closePowerModal();
  }
  pushNotification(`${powerName} ${existing ? `Lv.${newLevel}` : 'unlocked'}`, 5000);
  if (consumeChoice) {
    if (state.pendingPowerChoices > 0) {
      tryOpenPowerModal();
    } else {
      refreshPauseState();
    }
  } else if (!skipClose) {
    refreshPauseState();
  }
  markSessionDirty();
}

function selectPowerOrTalent(selection) {
  if (!selection || !selection.name) return;
  state.currentSelection = selection;
  const isFusion = Boolean(getFusionDef(selection.name));
  const highlight = (btnList, key, name) => {
    btnList.forEach((btn) => {
      if (btn.dataset[key] === name) {
        btn.classList.add('selected');
        btn.classList.toggle('power', selection.kind === 'power');
        btn.classList.toggle('talent', selection.kind === 'talent');
        btn.classList.toggle('fusion', isFusion);
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
  if (!state.currentSelection) {
    const entries = getModalEntries();
    const idx = clamp(state.modalSelectionIndex || 0, 0, entries.length - 1);
    const target = entries[idx]?.btn;
    if (target?.dataset.power) {
      selectPowerOrTalent({ kind: 'power', name: target.dataset.power });
    } else if (target?.dataset.talent) {
      selectPowerOrTalent({ kind: 'talent', name: target.dataset.talent });
    } else {
      return;
    }
  }
  const sel = state.currentSelection;
  if (sel.kind === 'power') {
    applyPower(sel.name);
  } else if (sel.kind === 'talent') {
    applyTalent(sel.name);
  }
}

function applyTalent(talentName, options = {}) {
  const { consumeChoice = true, skipClose = false } = options;
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
      if (consumeChoice) state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    } else {
      existing.level = Math.min(existing.level + 1, def.maxLevel);
      if (consumeChoice) state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
    }
  } else {
    state.talents.push({ name: talentName, level: 1 });
    if (fusion && Array.isArray(fusion.ingredients)) {
    state.powers = state.powers.filter((p) => !fusion.ingredients.includes(p.name));
    state.talents = state.talents.filter((t) => !fusion.ingredients.includes(t.name));
    removeShipSkins(fusion.ingredients);
    }
    if (consumeChoice) state.pendingPowerChoices = Math.max(0, state.pendingPowerChoices - 1);
  }
  if (!state.activeShipSkins.includes(talentName)) {
    state.activeShipSkins.push(talentName);
  }
  if (talentName === 'Stim Pack') {
    const maxLife = getMaxLives();
    state.lives = Math.min(maxLife, maxLife);
  }
  clampLivesToMax();
  if (!skipClose) {
    closePowerModal();
  }
  pushNotification(`${talentName} ${existing ? `Lv.${existing.level || 1}` : 'unlocked'}`, 5000);
  if (consumeChoice) {
    if (state.pendingPowerChoices > 0) {
      tryOpenPowerModal();
    } else {
      refreshPauseState();
    }
  } else if (!skipClose) {
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

function handlePowerReroll() {
  if (!state.powerModalOpen || state.pendingPowerChoices <= 0) return;
  if (state.rerollRemaining <= 0) return;
  state.rerollRemaining = Math.max(0, state.rerollRemaining - 1);
  state.currentSelection = null;
  powerButtons.forEach((btn) => btn.classList.remove('selected'));
  talentButtons.forEach((btn) => btn.classList.remove('selected'));
  if (powerConfirmBtn) powerConfirmBtn.disabled = true;
  const availablePowers = ALL_POWER_DEFS
    .filter((p) => fusionKind(p) === 'power')
    .map((p) => p.name)
    .filter((name) => canUpgradePower(name));
  const blockedTalentIngredients = state.talents
    .filter((t) => {
      const fusion = getFusionDef(t.name);
      return fusion && fusionKind(fusion) === 'talent' && getTalentLevel(t.name) > 0;
    })
    .flatMap((t) => getFusionDef(t.name)?.ingredients || []);
  const blockedByActiveFusion = [...state.powers, ...state.talents]
    .map((p) => getFusionDef(p.name))
    .filter(Boolean)
    .filter((f) => Array.isArray(f.ingredients))
    .flatMap((f) => f.ingredients.filter((ing) => isTalentName(ing)));
  const blockedTalents = new Set([...blockedTalentIngredients, ...blockedByActiveFusion]);
  const availableTalents = [...TALENT_DEFS, ...FUSION_DEFS.filter((f) => fusionKind(f) === 'talent')]
    .map((t) => t.name)
    .filter((name) => !blockedTalents.has(name))
    .filter((name) => canUpgradeTalent(name));
  state.currentPowerOptions = sampleOptions(availablePowers, 4);
  state.currentTalentOptions = sampleOptions(availableTalents, 4);
  renderPowerModal(state.currentPowerOptions, state.currentTalentOptions);
  powerModalBackdrop.classList.add('open');
  if (powerRerollBtn) {
    powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
    powerRerollBtn.disabled = state.rerollRemaining <= 0;
    powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
    powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
  }
  if (powerPassBtn) {
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.classList.toggle('disabled', state.passRemaining <= 0);
  }
  refreshPauseState();
}

function closePowerModal() {
  powerModalBackdrop.classList.remove('open');
  state.powerModalOpen = false;
  state.currentSelection = null;
  powerButtons.forEach((btn) => {
    btn.classList.remove('selected');
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.style.pointerEvents = 'none';
    btn.style.visibility = 'hidden';
  });
  talentButtons.forEach((btn) => {
    btn.classList.remove('selected');
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.style.pointerEvents = 'none';
    btn.style.visibility = 'hidden';
  });
  if (powerConfirmBtn) powerConfirmBtn.disabled = true;
  if (powerPassBtn) {
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.textContent = `${t('power_modal.pass')} (${state.passRemaining})`;
    powerPassBtn.classList.toggle('disabled', state.passRemaining <= 0);
  }
  if (powerRerollBtn) {
    powerRerollBtn.disabled = state.rerollRemaining <= 0;
    powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
    powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
    powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
  }
}

function renderPowerModal(powerOptions, talentOptions) {
  if (powerPassBtn) {
    powerPassBtn.disabled = state.passRemaining <= 0;
    powerPassBtn.textContent = `${t('power_modal.pass')} (${state.passRemaining})`;
    powerPassBtn.classList.toggle('disabled', state.passRemaining <= 0);
  }
  if (powerRerollBtn) {
    powerRerollBtn.disabled = state.rerollRemaining <= 0;
    powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
    powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
    powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
  }
  powerButtons.forEach((btn) => { btn.disabled = false; btn.tabIndex = 0; btn.style.pointerEvents = 'auto'; btn.style.visibility = 'visible'; });
  talentButtons.forEach((btn) => { btn.disabled = false; btn.tabIndex = 0; btn.style.pointerEvents = 'auto'; btn.style.visibility = 'visible'; });
  if (ownedPowersGrid) {
    ownedPowersGrid.style.transform = 'scale(1.1)';
    ownedPowersGrid.style.transformOrigin = 'center center';
    ownedPowersGrid.style.justifyItems = 'center';
    ownedPowersGrid.style.margin = '0';
    ownedPowersGrid.style.padding = '0';
    ownedPowersGrid.style.marginBottom = '12px';
  }
  if (ownedTalentsGrid) {
    ownedTalentsGrid.style.transform = 'scale(1.1)';
    ownedTalentsGrid.style.transformOrigin = 'center center';
    ownedTalentsGrid.style.justifyItems = 'center';
    ownedTalentsGrid.style.margin = '0';
    ownedTalentsGrid.style.padding = '0';
    ownedTalentsGrid.style.marginTop = '8px';
    ownedTalentsGrid.style.marginBottom = '12px';
  }
  const modalGrids = document.querySelectorAll('.power-grid');
  modalGrids.forEach((grid) => {
    grid.style.marginTop = '12px';
  });
  renderOwnedGrid(ownedPowersGrid, state.powers, 'power');
  renderOwnedGrid(ownedTalentsGrid, state.talents, 'talent');
  state.modalSelectionIndex = 0;
  powerButtons.forEach((btn, idx) => {
    const power = powerOptions[idx];
    if (power) {
      btn.classList.remove('has-fusion-partner');
      btn.style.display = 'flex';
      btn.style.visibility = 'visible';
      btn.style.pointerEvents = 'auto';
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
      const status = currentLv === 0
        ? fusion ? 'FUSION' : 'NEW'
        : `Lv. ${currentLv} → ${nextLv}`;
      const hasFusionPartner = currentLv === 0 && hasOwnedFusionPartner(power);
      const label = `${power} ${status}${hasFusionPartner ? ' F' : ''}`;
      const badgeHtml = hasFusionPartner ? '<span class="fusion-badge" title="Fusion ready">F</span>' : '';
      const media = MEDIA_BY_NAME[power];
      const iconHtml = media?.imageUrl
        ? `<img class="btn-icon" src="${media.imageUrl}" alt="${power} icon" style="width: 20%; height: 20%; object-fit: contain; margin-right: 8px;" />`
        : '';
      btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; font-size:90%; font-weight:700;">${iconHtml}<span>${power}</span></span><span class="btn-right"><span class="btn-state ${fusion ? 'fusion' : ''}">${status}</span>${badgeHtml}</span>`;
      btn.dataset.power = power;
      btn.title = getPowerDescription(power).plain;
      const showPreview = () => updatePowerPreview(power, { label, statusText: status, fusionBadge: hasFusionPartner }, 'power', fusion);
      btn.onmouseenter = showPreview;
      btn.onpointerenter = showPreview;
      btn.ontouchstart = showPreview;
      btn.onfocus = showPreview;
      btn.onclick = () => handlePowerSelect(power);
    } else {
      btn.style.display = 'none';
      btn.style.visibility = 'hidden';
      btn.style.pointerEvents = 'none';
      btn.innerHTML = '';
      btn.dataset.power = '';
    }
  });

  talentButtons.forEach((btn, idx) => {
      const talent = talentOptions[idx];
      if (talent) {
        btn.classList.remove('has-fusion-partner');
        btn.style.display = 'flex';
        const fusion = getFusionDef(talent);
        if (fusion) {
          btn.style.background = 'linear-gradient(135deg, #2dd4bf, #16a34a)';
          btn.style.border = '1px solid rgba(16, 185, 129, 0.6)';
          btn.style.color = '#0b172a';
        } else {
          btn.style.background = '';
          btn.style.border = '';
          btn.style.color = '';
        }
        const currentLv = getTalentLevel(talent);
        const nextLv = nextTalentLevel(talent);
      const status = currentLv === 0
        ? fusion ? 'FUSION' : 'NEW'
        : `Lv. ${currentLv} → ${nextLv}`;
        const hasFusionPartner = currentLv === 0 && hasOwnedFusionPartner(talent);
        const label = `${talent} ${status}${hasFusionPartner ? ' F' : ''}`;
        const badgeHtml = hasFusionPartner ? '<span class="fusion-badge" title="Fusion ready">F</span>' : '';
        const media = MEDIA_BY_NAME[talent];
        const iconHtml = media?.imageUrl
          ? `<img class="btn-icon" src="${media.imageUrl}" alt="${talent} icon" style="width: 20%; height: 20%; object-fit: contain; margin-right: 8px;" />`
          : '';
        btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; font-size:90%; font-weight:700;">${iconHtml}<span>${talent}</span></span><span class="btn-right"><span class="btn-state ${fusion ? 'fusion' : ''}">${status}</span>${badgeHtml}</span>`;
        btn.dataset.talent = talent;
        btn.title = getTalentDescription(talent).plain;
      const showPreview = () => updatePowerPreview(talent, { label, statusText: status, fusionBadge: hasFusionPartner }, 'talent');
      btn.onmouseenter = showPreview;
      btn.onpointerenter = showPreview;
      btn.ontouchstart = showPreview;
      btn.onfocus = showPreview;
      btn.onclick = () => handleTalentSelect(talent);
    } else {
      btn.style.display = 'none';
      btn.style.visibility = 'hidden';
      btn.style.pointerEvents = 'none';
      btn.innerHTML = '';
      btn.dataset.talent = '';
    }
  });

  const firstPower = powerOptions && powerOptions.find(Boolean);
  const firstTalent = talentOptions && talentOptions.find(Boolean);
  const powerSlots = `${state.powers.length}/${MAX_POWERS} slots`;
  const talentSlots = `${state.talents.length}/${MAX_TALENTS} slots`;
  if (powerSlotsLabel) powerSlotsLabel.textContent = powerSlots;
  if (talentSlotsLabel) talentSlotsLabel.textContent = talentSlots;
  focusModalSelection(true);
  if (firstPower) {
    const currentLv = getPowerLevel(firstPower);
    const nextLv = nextPowerLevel(firstPower);
    const status = currentLv === 0 ? 'NEW' : `Lv. ${currentLv} → ${nextLv}`;
    const label = `${firstPower} ${status}`;
    const hasFusionPartner = currentLv === 0 && hasOwnedFusionPartner(firstPower);
    updatePowerPreview(firstPower, { label, statusText: status, fusionBadge: hasFusionPartner }, 'power', getFusionDef(firstPower));
  } else if (firstTalent) {
    const currentLv = getTalentLevel(firstTalent);
    const nextLv = nextTalentLevel(firstTalent);
    const status = currentLv === 0 ? 'NEW' : `Lv. ${currentLv} → ${nextLv}`;
    const label = `${firstTalent} ${status}`;
    const hasFusionPartner = currentLv === 0 && hasOwnedFusionPartner(firstTalent);
    updatePowerPreview(firstTalent, { label, statusText: status, fusionBadge: hasFusionPartner }, 'talent');
  }
  selectFirstModalEntry();
}

function getModalEntries() {
  const entries = [];
  let powerIdx = 0;
  let rowOffset = 0;
  if (Array.isArray(state.currentPowerOptions)) {
    state.currentPowerOptions.forEach((p, i) => {
      if (p && powerButtons[i]) {
        entries.push({
          btn: powerButtons[i],
          group: 'power',
          row: Math.floor(powerIdx / 2),
          col: powerIdx % 2
        });
        powerIdx += 1;
      }
    });
  }
  rowOffset = Math.ceil(powerIdx / 2);
  let talentIdx = 0;
  if (Array.isArray(state.currentTalentOptions)) {
    state.currentTalentOptions.forEach((t, i) => {
      if (t && talentButtons[i]) {
        entries.push({
          btn: talentButtons[i],
          group: 'talent',
          row: rowOffset + Math.floor(talentIdx / 2),
          col: talentIdx % 2
        });
        talentIdx += 1;
      }
    });
  }
  return entries;
}

function focusModalSelection(reset = false) {
  const entries = getModalEntries();
  if (!entries.length) return;
  const maxIndex = entries.length - 1;
  const idx = reset ? 0 : clamp(state.modalSelectionIndex || 0, 0, maxIndex);
  state.modalSelectionIndex = idx;
  entries.forEach((entry, i) => {
    entry.btn.classList.toggle('modal-selected', i === idx);
    entry.btn.style.boxShadow = i === idx ? '0 0 0 3px rgba(56,189,248,0.75)' : '';
  });
  const target = entries[idx]?.btn;
  if (target) target.focus();
}

function selectFirstModalEntry() {
  const entries = getModalEntries();
  if (!entries.length) return;
  const first = entries[0]?.btn;
  if (!first) return;
  if (first.dataset.power) {
    selectPowerOrTalent({ kind: 'power', name: first.dataset.power });
  } else if (first.dataset.talent) {
    selectPowerOrTalent({ kind: 'talent', name: first.dataset.talent });
  }
  state.modalSelectionIndex = 0;
  focusModalSelection(true);
  if (powerConfirmBtn) powerConfirmBtn.disabled = false;
}

function moveModalSelection(dx, dy) {
  const entries = getModalEntries();
  const total = entries.length;
  if (!total) return;
  const cols = 2;
  const currentIdx = clamp(state.modalSelectionIndex || 0, 0, total - 1);
  const current = entries[currentIdx];
  const curRow = current?.row ?? 0;
  const curCol = current?.col ?? 0;
  const maxRow = Math.max(...entries.map((e) => e.row));
  const minRow = Math.min(...entries.map((e) => e.row));

  let targetRow = Math.max(minRow, Math.min(maxRow, curRow + dy));
  let targetCol = Math.max(0, Math.min(cols - 1, curCol + dx));

  const candidates = entries.filter((e) => e.row === targetRow);
  let candidate = candidates.find((e) => e.col === targetCol) || candidates[0];

  if (!candidate) {
    focusModalSelection();
    return;
  }

  state.modalSelectionIndex = entries.indexOf(candidate);
  if (candidate.btn.dataset.power) {
    selectPowerOrTalent({ kind: 'power', name: candidate.btn.dataset.power });
  } else if (candidate.btn.dataset.talent) {
    selectPowerOrTalent({ kind: 'talent', name: candidate.btn.dataset.talent });
  }
  focusModalSelection();
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
  let options = {};
  if (labelOverride && typeof labelOverride === 'object') {
    options = labelOverride;
    labelOverride = options.label || null;
  }
  if (!name) return;
  const isPower = kind === 'power';
  const desc = isPower ? getPowerDescription(name) : getTalentDescription(name);
  const color = isPower ? getPowerColor(name) : 'rgba(148, 163, 184, 0.4)';
  const tag = fusionDef ? 'Fusion · ' : '';
  if (powerPreviewName) {
    powerPreviewName.innerHTML = '';
  const titleSpan = document.createElement('span');
    titleSpan.textContent = tag ? `${tag}${name}` : name;
  powerPreviewName.appendChild(titleSpan);
}
  if (powerPreviewDesc) {
    powerPreviewDesc.innerHTML = desc.rich || desc.plain || 'No details available.';
    const chipsRow = document.createElement('div');
    chipsRow.className = 'fusion-chip-row';
    const fusions = getFusionsForName(name);
    fusions.forEach((fusion) => {
      const chip = document.createElement('span');
      chip.className = 'fusion-chip';
      const ready = hasFusionIngredients(fusion);
      if (ready) chip.classList.add('ready');
      const ingredients = (fusion.ingredients || []).filter((ing) => ing !== name);
      const missing = ingredients.filter((ing) => {
        const powerLv = getPowerLevel(ing);
        const talentLv = getTalentLevel(ing);
        return !(powerLv > 0 || talentLv > 0);
      });
      const label = document.createElement('span');
      label.textContent = fusion.name;
      chip.appendChild(label);
      if (ingredients.length) {
        if (ingredients.length === 1) {
          const ing = ingredients[0];
          const owned = !missing.includes(ing);
          const part = document.createElement('span');
          part.textContent = ing;
          part.style.color = owned ? '#34d399' : 'rgba(226,232,240,0.6)';
          chip.appendChild(part);
        } else {
          const spanList = document.createElement('span');
          spanList.style.marginLeft = '4px';
          ingredients.forEach((ing, idx) => {
            const part = document.createElement('span');
            const owned = !missing.includes(ing);
            part.textContent = ing;
            part.style.color = owned ? '#34d399' : 'rgba(226,232,240,0.6)';
            if (idx < ingredients.length - 1) {
              part.textContent += ' + ';
            }
            spanList.appendChild(part);
          });
          chip.appendChild(spanList);
        }
      }
      chipsRow.appendChild(chip);
    });
    if (fusions.length) powerPreviewDesc.appendChild(chipsRow);
  }
  if (powerPreviewIcon) {
    const media = MEDIA_BY_NAME[name];
    powerPreviewIcon.textContent = '';
    powerPreviewIcon.classList.toggle('has-image', !!media?.imageUrl);
    powerPreviewIcon.style.background = media?.imageUrl ? 'transparent' : color.replace('0.35', '0.55');
    powerPreviewIcon.style.borderColor = media?.imageUrl ? 'transparent' : '#334155';
    if (media?.imageUrl) {
      const img = document.createElement('img');
      img.src = media.imageUrl;
      img.alt = name;
      powerPreviewIcon.appendChild(img);
    } else {
      powerPreviewIcon.textContent = name.slice(0, 2).toUpperCase();
    }
    powerPreviewIcon.style.boxShadow = `0 0 12px ${color}`;
  }
}

function renderOwnedGrid(container, items, kind = 'power') {
  if (!container) return;
  const cells = [...items];
  const minCells = 4;
  const target = Math.max(minCells, Math.ceil(cells.length / 4) * 4);
  while (cells.length < target) cells.push(null);
  container.innerHTML = '';
  container.style.transform = 'scale(1.1)';
  container.style.transformOrigin = 'center center';
  cells.forEach((entry) => {
    const cell = document.createElement('div');
    cell.className = 'owned-cell';
    if (!entry) {
      cell.classList.add('empty');
      container.appendChild(cell);
      return;
    }
    const isPower = kind === 'power';
    const fusionDef = isPower ? getFusionDef(entry.name) : null;
    const desc = isPower ? getPowerDescription(entry.name) : getTalentDescription(entry.name);
    const label = `${entry.name} (Lv. ${entry.level || 1})`;
    const showPreview = () => updatePowerPreview(entry.name, label, isPower ? 'power' : 'talent', fusionDef);
    cell.title = desc?.plain || entry.name;
    cell.tabIndex = 0;
    cell.onmouseenter = showPreview;
    cell.onpointerenter = showPreview;
    cell.onfocus = showPreview;
    const media = MEDIA_BY_NAME[entry.name];
    const badge = document.createElement('span');
    badge.className = 'badge';
    const lvl = entry.level || 1;
    badge.textContent = lvl >= (isPower ? getPowerDef(entry.name).maxLevel : getTalentDef(entry.name).maxLevel) ? 'M' : `${lvl}`;
    badge.style.fontSize = '10px';
    badge.style.padding = '2px 5px';
    badge.style.position = 'absolute';
    badge.style.top = '2px';
    badge.style.right = '2px';
    badge.style.left = 'auto';
    badge.style.transform = 'none';
    badge.style.whiteSpace = 'nowrap';
    if (isPower) badge.style.background = '#38bdf8';
    else badge.style.background = '#c084fc';
    if (media?.imageUrl) {
      const img = document.createElement('img');
      img.src = media.imageUrl;
      img.alt = entry.name;
      cell.appendChild(img);
    } else {
      cell.textContent = entry.name.slice(0, 2).toUpperCase();
    }
    cell.appendChild(badge);
    container.appendChild(cell);
  });
}

function tryCrusherPush(brick, ball, distance = 14) {
  if (!brick || !brick.alive || brick.type === 'boss') return false;
  const len = Math.hypot(ball.vx, ball.vy) || 1;
  const dx = (ball.vx / len) * distance;
  const dy = (ball.vy / len) * distance;
  const nextX = clamp(brick.x + dx, 0, CONFIG.width - brick.w);
  const nextY = clamp(brick.y + dy, -CONFIG.height, CONFIG.height);
  const nextRect = { x: nextX, y: nextY, w: brick.w, h: brick.h };
  const blocked = state.bricks.some((b) => (
    b !== brick &&
    b.alive &&
    b.x < nextRect.x + nextRect.w &&
    b.x + b.w > nextRect.x &&
    b.y < nextRect.y + nextRect.h &&
    b.y + b.h > nextRect.y
  ));
  if (blocked) return false;
  brick.x = nextX;
  brick.y = nextY;
  return true;
}

function applyLightStun(target, ball, now) {
  const duration = 562; // 25% shorter stun
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
  const BOSS_HITBOX_SCALE = 1;
  const BOSS_RENDER_SCALE = 0.85;
  const totalWidth = CONFIG.brickCols * brickWidth + brickPadding * (CONFIG.brickCols - 1);
  const hitW = brickWidth * 2 * BOSS_HITBOX_SCALE;
  const hitH = brickHeight * 2 * BOSS_HITBOX_SCALE;
  const x = startX + (totalWidth - hitW) / 2;
  const y = -hitH - brickTopOffset;
  // Libère l'espace pour le boss en supprimant les briques qui chevauchent sa zone
  const margin = brickPadding * 2;
  state.bricks = state.bricks.filter((b) => {
    if (!b.alive || b.type === 'boss') return true;
    const overlap = (
      b.x < x + hitW + margin &&
      b.x + b.w + margin > x &&
      b.y < y + hitH + margin &&
      b.y + b.h + margin > y
    );
    return !overlap;
  });
  state.bricks.push({
    x,
    y,
    w: hitW,
    h: hitH,
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
    effectUntil: Number.POSITIVE_INFINITY,
    renderScale: BOSS_RENDER_SCALE
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

function getDangerBrick() {
  const dangerY = CONFIG.height * 0.78;
  return state.bricks
    .filter((b) => b.alive && b.y + b.h >= dangerY)
    .sort((a, b) => (b.y + b.h) - (a.y + a.h))[0] || null;
}

function getCriticalBall() {
  const limitY = CONFIG.height * 0.78;
  return state.balls
    .filter((b) => b.vy > 0 && b.y >= limitY)
    .sort((a, b) => b.y - a.y)[0] || null;
}

function reflectInBounds(x, min, max) {
  const span = max - min;
  if (span <= 0) return min;
  let wrapped = (x - min) % (span * 2);
  if (wrapped < 0) wrapped += span * 2;
  if (wrapped > span) {
    return max - (wrapped - span);
  }
  return min + wrapped;
}

function predictBallInterceptX(ball) {
  if (!ball || ball.vy <= 0) return null;
  const targetY = state.paddle.y;
  const time = (targetY - ball.y) / ball.vy;
  if (!Number.isFinite(time) || time <= 0) return null;
  const minX = ball.r;
  const maxX = CONFIG.width - ball.r;
  return reflectInBounds(ball.x + ball.vx * time, minX, maxX);
}

function getLoadoutSummary() {
  const toEntry = (item) => `${item.name}:${item.level || 1}`;
  const powers = [];
  const talents = [];
  const fusions = [];
  state.powers.forEach((p) => {
    const fusionDef = getFusionDef(p.name);
    if (fusionDef && fusionKind(fusionDef) === 'power') fusions.push(toEntry(p));
    else powers.push(toEntry(p));
  });
  state.talents.forEach((t) => {
    const fusionDef = getFusionDef(t.name);
    if (fusionDef && fusionKind(fusionDef) === 'talent') fusions.push(toEntry(t));
    else talents.push(toEntry(t));
  });
  return { powers, talents, fusions };
}

function buildScorePayload(endedAt) {
  const loadout = getLoadoutSummary();
  const pilot = state.activePilotId ? { pilot: state.activePilotId } : {};
  return {
    player: state.playerName || 'Anonymous',
    score: state.score,
    stage: state.level,
    level: state.playerLevel,
    endedAt,
    ...loadout,
    ...pilot
  };
}

function placeBallOnPaddle({ centerPaddle = false, refill = false, preserveY = false } = {}) {
  const { paddle, heldBall } = state;
  paddle.w = getPaddleWidth();
  paddle.h = CONFIG.paddleHeight;
  if (centerPaddle) {
    paddle.x = (CONFIG.width - paddle.w) / 2;
  }
  if (!preserveY) {
    paddle.y = CONFIG.height - 60;
  }
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
      let aimX = target.x + target.w / 2;
      const aimY = target.y + target.h / 2;
      const nearLeftWall = aimX < 100;
      const nearRightWall = aimX > CONFIG.width - 100;
      if (nearLeftWall) aimX -= 60; // petit angle sur le mur pour exploiter les rebonds
      if (nearRightWall) aimX += 60;
      const dx = aimX - originX;
      const dy = aimY - originY;
      const len = Math.hypot(dx, dy) || 1;
      const baseVx = (dx / len) * speed;
      const baseVy = (dy / len) * speed;
      const minRatio = 0.2;
      const maxRatio = 0.9;
      const ratio = clamp(Math.abs(baseVx) / speed, minRatio, maxRatio);
      const vxSign = Math.sign(baseVx) || 1;
      const tunedVx = vxSign * ratio * speed;
      const tunedVy = -Math.sqrt(Math.max(speed ** 2 - tunedVx ** 2, 0.001));
      const aimed = withAimJitter(tunedVx, tunedVy);
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
    windPierceLeft: specialPower === 'Wind' || specialPower === 'Jetstream' || specialPower === 'Cyclone' || specialPower === 'Gale' ? 3 : 0,
    crusherPushCount: 0
  });
  state.shotEffects.push({
    x: originX,
    y: originY,
    length: CONFIG.paddleHeight * 2.4,
    baseWidth: Math.max(12, CONFIG.paddleWidth * 0.45),
    duration: 220,
    until: now + 220
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

function purgeFusionIngredients(fusion) {
  if (!fusion?.ingredients?.length) return;
  const ingredients = new Set(fusion.ingredients);
  state.specialPocket = state.specialPocket.filter((p) => !ingredients.has(p));
  state.balls.forEach((b) => {
    if (ingredients.has(b.specialPower)) b.specialPower = null;
  });
  removeShipSkins(fusion.ingredients);
}

function fireLaser(powerName, brick, now, modes = []) {
  if (!Array.isArray(modes) || modes.length === 0) return;
  const cooldown = powerName === 'Crossfire' ? beamCooldownMs * 0.66 : beamCooldownMs;
  const last = state.beamCooldown[powerName] || 0;
  if (now - last < cooldown) return;
  state.beamCooldown[powerName] = now;
  const dmg = getBallBaseDamage({ specialPower: powerName }) + Math.max(0, getPowerLevel(powerName) - 1);
  const cx = brick.x + brick.w / 2;
  const cy = brick.y + brick.h / 2;
  const color = getPowerColor(powerName);
  const duration = powerName === 'Crossfire' ? 260 : 200;
  for (const mode of modes) {
    if (mode === 'h') {
      const targets = state.bricks.filter((b) => b.alive && b !== brick && cy >= b.y && cy <= b.y + b.h);
      targets.forEach((b) => damageBrick(b, dmg, now, powerName));
      state.beamEffects.push({
        mode: 'h',
        y: cy,
        color,
        until: now + duration,
        glow: powerName === 'Crossfire',
        glowWidth: powerName === 'Crossfire' ? 12 : undefined,
        lineWidth: powerName === 'Crossfire' ? 6 : undefined
      });
    } else if (mode === 'v') {
      const targets = state.bricks.filter((b) => b.alive && b !== brick && cx >= b.x && cx <= b.x + b.w);
      targets.forEach((b) => damageBrick(b, dmg, now, powerName));
      state.beamEffects.push({
        mode: 'v',
        x: cx,
        color,
        until: now + duration,
        glow: powerName === 'Crossfire',
        glowWidth: powerName === 'Crossfire' ? 12 : undefined,
        lineWidth: powerName === 'Crossfire' ? 6 : undefined
      });
    }
  }
}

function resetGame() {
  state.score = 0;
  state.activeShipSkins = [];
  state.maxLifeBonus = 0;
  state.cachedMaxLives = 0;
  state.stageScalingNotified = false;
  state.activePilotId = null;
  state.selectedPilotId = null;
  state.awaitingPilot = false;
  ensurePilotUnlocks();
  const maxLife = getMaxLives();
  state.cachedMaxLives = maxLife;
  state.lives = Math.min(maxLife, CONFIG.startLives + 5 * getTalentLevel('Stim Pack'));
  const now = performance.now ? performance.now() : Date.now();
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
  state.regenStageHeals = 0;
  state.royalSurgeUntil = 0;
  state.royalSurgeXpMult = 1;
  state.tempHpCooldown = {};
  state.rerollRemaining = REROLL_LIMIT_PER_MODAL;
  state.passRemaining = PASS_LIMIT_PER_MODAL;
  state.lastVampireHeal = 0;
  state.lastBossLevelSpawned = 0;
  state.damageByPower = {};
  state.beamCooldown = {};
  state.beamEffects = [];
  state.surgeUntil = 0;
  state.backendTopScores = [];
  state.gameOverHandled = false;
  state.lastEndedAt = null;
  state.scoreSubmitted = false;
  state.stageScalingNotified = false;
  powerModalBackdrop.classList.remove('open');
  if (pilotModalBackdrop) pilotModalBackdrop.classList.remove('open');
  placeBallOnPaddle({ centerPaddle: true });
  spawnBrickRow();
  openPilotModal();
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
    if (!entry.build) entry.build = BUILD_LABEL;
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
    const msg = document.createElement('div');
    msg.className = 'commit-msg';
    msg.textContent = c.message || '';

    const meta = document.createElement('div');
    meta.className = 'commit-meta';
    const date = document.createElement('span');
    date.className = 'commit-date';
    date.textContent = c.date || '';
    const hash = document.createElement('span');
    hash.className = 'commit-hash';
    hash.textContent = c.hash || '';
    hash.style.marginLeft = '8px';
    hash.style.fontSize = '90%';
    meta.appendChild(date);
    meta.appendChild(hash);

    item.appendChild(msg);
    item.appendChild(meta);
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
        item.ingredients.forEach((ingr, idx) => {
          const span = document.createElement('span');
          const owned = getPowerLevel(ingr) > 0 || getTalentLevel(ingr) > 0;
          span.textContent = ingr;
          span.style.color = owned ? '#34d399' : 'rgba(226,232,240,0.75)';
          ing.appendChild(span);
          if (idx < item.ingredients.length - 1) {
            const plus = document.createElement('span');
            plus.textContent = ' + ';
            plus.style.color = 'rgba(226,232,240,0.6)';
            ing.appendChild(plus);
          }
        });
        titleWrap.appendChild(ing);
      }
      const chipsRow = document.createElement('div');
      chipsRow.className = 'fusion-chip-row';
      const relatedFusions = getFusionsForName(item.name);
      relatedFusions.forEach((fusion) => {
        const chip = document.createElement('span');
        chip.className = 'fusion-chip';
        const ready = hasFusionIngredients(fusion);
        if (ready) chip.classList.add('ready');
        const ingredients = (fusion.ingredients || []).filter((ing) => ing !== item.name);
        const missing = ingredients.filter((ing) => {
          const powerLv = getPowerLevel(ing);
          const talentLv = getTalentLevel(ing);
          return !(powerLv > 0 || talentLv > 0);
        });
        if (ingredients.length) {
          const label = document.createElement('span');
          label.textContent = fusion.name;
          chip.appendChild(label);
          const spanList = document.createElement('span');
          spanList.style.marginLeft = '4px';
          if (ingredients.length === 1) {
            const ing = ingredients[0];
            const owned = !missing.includes(ing);
            const part = document.createElement('span');
            part.textContent = ing;
            part.style.color = owned ? '#34d399' : 'rgba(226,232,240,0.6)';
            spanList.appendChild(part);
          } else {
            ingredients.forEach((ing, idx) => {
              const part = document.createElement('span');
              const owned = !missing.includes(ing);
              part.textContent = ing;
              part.style.color = owned ? '#34d399' : 'rgba(226,232,240,0.6)';
              if (idx < ingredients.length - 1) {
                part.textContent += ' + ';
              }
              spanList.appendChild(part);
            });
          }
          chip.appendChild(spanList);
        } else {
          chip.textContent = fusion.name;
        }
        chipsRow.appendChild(chip);
      });
      header.appendChild(titleWrap);
      el.appendChild(header);
      if (relatedFusions.length) el.appendChild(chipsRow);
      const p = document.createElement('p');
      p.textContent = formatDesc(desc);
      el.appendChild(p);
      container.appendChild(el);
    });
  };
  renderList(catalogPowers, POWER_DEFS, 'power');
  renderList(catalogTalents, TALENT_DEFS, 'talent');
  renderList(catalogFusions, FUSION_DEFS, 'power');
}

function parseLoadoutList(val) {
  const arr = Array.isArray(val)
    ? val
    : typeof val === 'string'
      ? val.split('|')
      : [];
  return arr
    .map((entry) => {
      if (!entry) return null;
      const [name, levelRaw] = String(entry).split(':');
      const nameClean = (name || '').trim();
      if (!nameClean) return null;
      const level = Number(levelRaw);
      return { name: nameClean, level: Number.isFinite(level) ? level : 1 };
    })
    .filter(Boolean);
}

function parseScoreLoadout(entry) {
  return {
    powers: parseLoadoutList(entry?.powers),
    talents: parseLoadoutList(entry?.talents),
    fusions: parseLoadoutList(entry?.fusions)
  };
}

function makeIconBadge(item, type) {
  const badge = document.createElement('div');
  const size = 22;
  const media = MEDIA_BY_NAME[item.name];
  badge.className = 'score-loadout-icon';
  badge.style.width = `${size}px`;
  badge.style.height = `${size}px`;
  badge.style.borderRadius = '6px';
  badge.style.backgroundSize = 'cover';
  badge.style.backgroundPosition = 'center';
  badge.style.backgroundRepeat = 'no-repeat';
  badge.style.display = 'inline-flex';
  badge.style.alignItems = 'center';
  badge.style.justifyContent = 'center';
  badge.style.marginRight = '6px';
  badge.style.marginBottom = '4px';
  badge.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.35)';
  badge.style.backgroundColor = 'rgba(15,23,42,0.7)';
  const borderColors = {
    power: '#38bdf8',
    talent: '#c084fc',
    fusion: '#34d399'
  };
  badge.style.outline = `2px solid ${borderColors[type] || 'rgba(226,232,240,0.5)'}`;
  if (media?.imageUrl) {
    const img = document.createElement('img');
    img.src = media.imageUrl;
    img.alt = `${item.name} icon`;
    img.style.width = '18px';
    img.style.height = '18px';
    img.style.objectFit = 'contain';
    badge.appendChild(img);
  } else {
    badge.textContent = item.name.slice(0, 2).toUpperCase();
    badge.style.fontSize = '10px';
    badge.style.color = '#e2e8f0';
  }
  const levelText = item.level && item.level > 1 ? ` Lv.${item.level}` : '';
  badge.title = `${item.name}${levelText} (${type})`;
  return badge;
}

const mockLoadoutCache = new Map();
function pickRandom(list, maxCount) {
  const src = [...list];
  const count = Math.max(0, Math.min(maxCount, src.length));
  const picked = [];
  while (picked.length < count && src.length) {
    const idx = Math.floor(Math.random() * src.length);
    const [item] = src.splice(idx, 1);
    picked.push(item);
  }
  return picked;
}

function getMockLoadout(entry) {
  const key = `${entry.player || 'anon'}|${entry.score || 0}|${entry.endedAt || ''}`;
  if (mockLoadoutCache.has(key)) return mockLoadoutCache.get(key);
  const powers = pickRandom(POWER_DEFS.map((p) => p.name), 3).map((name) => ({ name, level: 1 }));
  const talents = pickRandom(TALENT_DEFS.map((t) => t.name), 2).map((name) => ({ name, level: 1 }));
  const fusions = pickRandom(FUSION_DEFS.map((f) => f.name), 2).map((name) => ({ name, level: 1 }));
  const loadout = { powers, talents, fusions };
  mockLoadoutCache.set(key, loadout);
  return loadout;
}

function renderTopScoresPanel() {
  if (!scoreListEl) return;
  scoreListEl.innerHTML = '';
  scoreListEl.style.display = state.topScoresExpanded ? 'block' : 'none';
  if (!state.topScoresExpanded) return;
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
  const sortBy = 'score';
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
  const pageSize = SCORE_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (state.topScoresPage >= totalPages) state.topScoresPage = totalPages - 1;
  if (state.topScoresPage < 0) state.topScoresPage = 0;
  const page = state.topScoresPage;
  const start = page * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  slice.forEach((entry, idx) => {
    const e = typeof entry === 'object' ? entry : { score: entry };
    const item = document.createElement('div');
    item.className = 'score-item';
    const buildLabel = e.build ? e.build : 'Old';
    const faded = !buildLabel || buildLabel === 'Old' || (/^b(\d+)/i.test(buildLabel) && Number(RegExp.$1) < 21);
    if (faded) {
      item.style.opacity = '0.55';
    }
    const name = document.createElement('div');
    name.className = 'score-player';
    name.style.fontSize = '75%';
    const playerName = (e.player || '???').slice(0, 12);
    name.textContent = `${start + idx + 1}. ${playerName} (${buildLabel})`;
    const pilotName = e.pilot ? (getPilotDef(e.pilot)?.name || e.pilot) : null;
    const pilotTag = pilotName ? (() => {
      const tag = document.createElement('span');
      tag.textContent = pilotName;
      tag.style.fontSize = '10px';
      tag.style.padding = '2px 6px';
      tag.style.marginTop = '4px';
      tag.style.borderRadius = '999px';
      tag.style.background = 'rgba(99,102,241,0.15)';
      tag.style.border = '1px solid rgba(99,102,241,0.35)';
      tag.style.color = '#cbd5e1';
      tag.style.display = 'inline-flex';
      tag.style.alignItems = 'center';
      return tag;
    })() : null;
    if (player && playerBest !== null && (e.player || '').trim() === player) {
      const sc = Number(e.score) || 0;
      if (sc === playerBest) {
        const badge = document.createElement('span');
        badge.className = 'score-badge';
        badge.textContent = 'PB';
        name.appendChild(badge);
      }
    }
    const stageBadge = Number.isFinite(e.stage) && e.stage > 0
      ? (() => {
        const badge = document.createElement('span');
        badge.textContent = `Stage ${e.stage}`;
        badge.style.fontSize = '10px';
        badge.style.padding = '2px 6px';
        badge.style.borderRadius = '10px';
        badge.style.background = 'rgba(56,189,248,0.18)';
        badge.style.color = '#bae6fd';
        badge.style.border = '1px solid rgba(56,189,248,0.45)';
        return badge;
      })()
      : null;
    const dateLabel = document.createElement('div');
    dateLabel.style.fontSize = '11px';
    dateLabel.style.color = 'rgba(226,232,240,0.65)';
    const dateVal = e.endedAt || e.updatedAt || e.created_at || null;
    dateLabel.textContent = dateVal ? new Date(dateVal).toLocaleDateString() : '';
    const loadout = (() => {
      const parsed = parseScoreLoadout(e);
      return parsed;
    })();
    const combined = [
      ...loadout.powers.map((p) => ({ ...p, type: 'power' })),
      ...loadout.talents.map((t) => ({ ...t, type: 'talent' })),
      ...loadout.fusions.map((f) => ({ ...f, type: 'fusion' }))
    ];
    if (combined.length) {
      item.style.display = 'grid';
      item.style.gridTemplateColumns = 'auto 1fr auto';
      item.style.alignItems = 'center';
      item.style.columnGap = '12px';

      // Name on the left (stacked with date)
      const nameWrap = document.createElement('div');
      nameWrap.style.display = 'flex';
      nameWrap.style.flexDirection = 'column';
      nameWrap.style.alignItems = 'flex-start';
      nameWrap.style.justifyContent = 'center';
      nameWrap.appendChild(name);
      if (pilotTag) nameWrap.appendChild(pilotTag);
      if (dateLabel.textContent) nameWrap.appendChild(dateLabel);
      item.appendChild(nameWrap);

      // Loadout centered vertically/horizontally in its own column
      const iconRow = document.createElement('div');
      iconRow.className = 'score-loadout-row';
      iconRow.style.display = 'grid';
      iconRow.style.gridTemplateColumns = 'repeat(4, auto)';
      iconRow.style.justifyItems = 'center';
      iconRow.style.alignItems = 'center';
      iconRow.style.transform = 'scale(0.75)';
      iconRow.style.transformOrigin = 'center center';
      iconRow.style.rowGap = '4px';
      iconRow.style.columnGap = '6px';
      iconRow.style.margin = '0';
      combined.slice(0, 8).forEach((itm) => {
        const badge = makeIconBadge(itm, itm.type);
        iconRow.appendChild(badge);
      });
      iconRow.style.justifySelf = 'center';
      iconRow.style.alignSelf = 'center';
      item.appendChild(iconRow);

      const ptsWrap = document.createElement('div');
      ptsWrap.style.display = 'flex';
      ptsWrap.style.flexDirection = 'column';
      ptsWrap.style.alignItems = 'flex-end';
      ptsWrap.style.gap = '4px';
      if (stageBadge) {
        stageBadge.style.margin = '0';
        stageBadge.style.alignSelf = 'flex-end';
        ptsWrap.appendChild(stageBadge);
      }
      const pts = document.createElement('div');
      pts.className = 'score-points';
      pts.textContent = `${formatScore(e.score || 0)} pts`;
      ptsWrap.appendChild(pts);
      item.appendChild(ptsWrap);
    } else {
      const pts = document.createElement('div');
      pts.className = 'score-points';
      pts.textContent = `${formatScore(e.score || 0)} pts`;
      item.appendChild(name);
      if (stageBadge) {
        const ptsWrap = document.createElement('div');
        ptsWrap.style.display = 'flex';
        ptsWrap.style.flexDirection = 'column';
        ptsWrap.style.alignItems = 'flex-end';
        ptsWrap.style.gap = '4px';
        stageBadge.style.margin = '0';
        stageBadge.style.alignSelf = 'flex-end';
        ptsWrap.appendChild(stageBadge);
        ptsWrap.appendChild(pts);
        item.appendChild(ptsWrap);
      } else {
        item.appendChild(pts);
      }
    }

    scoreListEl.appendChild(item);
  });

  if (totalPages > 1) {
    const nav = document.createElement('div');
    nav.className = 'score-nav';
    nav.style.display = 'flex';
    nav.style.alignItems = 'center';
    nav.style.justifyContent = 'center';
    nav.style.gap = '10px';
    nav.style.marginTop = '8px';

    const prev = document.createElement('button');
    prev.textContent = '◀ Prev';
    prev.disabled = page === 0;
    prev.className = 'score-nav-btn';
    prev.onclick = () => {
      if (state.topScoresPage > 0) {
        state.topScoresPage -= 1;
        renderTopScoresPanel();
      }
    };

    const info = document.createElement('span');
    info.textContent = `Page ${page + 1} / ${totalPages}`;
    info.style.color = '#e2e8f0';
    info.style.fontSize = '12px';

    const next = document.createElement('button');
    next.textContent = 'Next ▶';
    next.disabled = page >= totalPages - 1;
    next.className = 'score-nav-btn';
    next.onclick = () => {
      if (state.topScoresPage < totalPages - 1) {
        state.topScoresPage += 1;
        renderTopScoresPanel();
      }
    };

    nav.appendChild(prev);
    nav.appendChild(info);
    nav.appendChild(next);
    scoreListEl.appendChild(nav);
  }
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
  pauseBtn.textContent = state.manualPause ? t('controls.resume') : t('controls.pause');
}

function refreshPauseState() {
  const modalPause = state.powerModalOpen || state.awaitingName || state.awaitingPilot || state.infoOpen || state.catalogOpen || state.settingsOpen;
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
  renderTopScoresPanel();
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
  if (scoreSortSelect && document.body.contains(scoreSortSelect)) {
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
  state.manualPause = false;
  state.paused = false;
  updatePauseButton();
  const endedAt = new Date().toISOString();
  state.lastEndedAt = endedAt;
  const payload = buildScorePayload(endedAt);
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
    checkPilotFeatProgress(state.level);
    if (state.level === 20 && !state.stageScalingNotified) {
      pushNotification('Bricks now gain +1% HP per stage', 5000);
      state.stageScalingNotified = true;
    }
    if (state.level % 5 === 0 && state.rerollRemaining < REROLL_LIMIT_PER_MODAL) {
      state.rerollRemaining = Math.min(REROLL_LIMIT_PER_MODAL, state.rerollRemaining + 1);
      if (powerRerollBtn) {
        powerRerollBtn.textContent = `Roll (${state.rerollRemaining})`;
        powerRerollBtn.disabled = state.rerollRemaining <= 0;
        powerRerollBtn.classList.toggle('success', state.rerollRemaining > 0);
        powerRerollBtn.classList.toggle('disabled', state.rerollRemaining <= 0);
      }
    }
    const surgeLevel = getTalentLevel('Surge');
    const crownSurge = getFusionDef('Royal Surge') && getTalentLevel('Royal Surge') > 0;
    if (surgeLevel > 0) {
      const surgeDuration = 4000 + 1000 * surgeLevel;
      state.surgeUntil = now + surgeDuration;
    }
    if (crownSurge) {
      state.royalSurgeUntil = now + 6000;
      state.royalSurgeXpMult = 1.15;
    }
    const regenLv = getTalentLevel('Regen');
    if (regenLv > 0) {
      const maxLife = getMaxLives();
      state.lives = Math.min(maxLife, state.lives + regenLv);
      state.regenStageHeals += regenLv;
    }
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

  // Vibrations des briques proches du bas de l'écran (warning).
  const dangerY = CONFIG.height - CONFIG.brickHeight * 1.1;
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    const bottom = brick.y + brick.h;
    if (bottom >= dangerY && bottom < CONFIG.height) {
      brick.shakeTime = now;
    }
  }

  // Collision brique/paddle : considéré comme une sortie (perte de vie) et la brique est détruite.
  const paddleRects = (() => {
    const rects = [{ x: paddle.x, y: paddle.y, w: paddle.w, h: paddle.h }];
    const mirrorLevel = Math.max(
      getTalentLevel('Mirror'),
      getTalentLevel('Prism Paddle') > 0 ? getTalentDef('Mirror').maxLevel : 0
    );
    const halfWidth = paddle.w * 0.5;
    const gap = 8;
    if (mirrorLevel >= 1) rects.push({ x: paddle.x - halfWidth - gap, y: paddle.y, w: halfWidth, h: paddle.h });
    if (mirrorLevel >= 2) rects.push({ x: paddle.x + paddle.w + gap, y: paddle.y, w: halfWidth, h: paddle.h });
    return rects;
  })();
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    const hitPaddleRect = paddleRects.some((rect) => (
      brick.x < rect.x + rect.w &&
      brick.x + brick.w > rect.x &&
      brick.y < rect.y + rect.h &&
      brick.y + brick.h > rect.y
    ));
    if (hitPaddleRect) {
      brick.alive = false;
      brick.deathTime = now;
      state.lives -= 1;
      state.damageFlashUntil = now + 700;
      state.damageShakeUntil = now + 500;
      if (state.lives <= 0) {
        triggerGameOver();
      }
    }
  }

  // Si une brique atteint le bas, perte de vie.
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.y + brick.h >= CONFIG.height) {
      brick.alive = false;
      state.lives -= 1;
      state.damageFlashUntil = now + 700;
      state.damageShakeUntil = now + 500;
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
    const defaultY = CONFIG.height - 60;
    const criticalBall = getCriticalBall();
    const trackedBall = criticalBall || state.balls.find((b) => b.vy > 0) || state.balls[0] || refBall;
    let targetX = CONFIG.width / 2 - paddle.w / 2;
    let targetY = defaultY;

    if (trackedBall && trackedBall.vy > 0) {
      const interceptX = predictBallInterceptX(trackedBall);
      if (interceptX !== null) {
        targetX = interceptX - paddle.w / 2;
      }
    }

    const dangerBrick = getDangerBrick() || selectTargetBrick();
    if (!trackedBall || trackedBall.vy <= 0) {
      if (dangerBrick) {
        targetX = dangerBrick.x + dangerBrick.w / 2 - paddle.w / 2;
        targetY = clamp(dangerBrick.y + dangerBrick.h + 40, CONFIG.height * 0.55, CONFIG.height - 40);
      }
    } else if (dangerBrick && !criticalBall) {
      const biasX = dangerBrick.x + dangerBrick.w / 2 - paddle.w / 2;
      targetX = targetX * 0.6 + biasX * 0.4;
    }

    const smoothing = 7;
    const maxStep = getPaddleMaxSpeed() * dt * 0.8;
    const deltaX = (targetX - paddle.x) * smoothing * dt;
    paddle.x += clamp(deltaX, -maxStep, maxStep);
    const deltaY = (targetY - paddle.y) * smoothing * dt;
    paddle.y += clamp(deltaY, -maxStep, maxStep);
  } else {
    const paddleSpeed = getPaddleSpeed();
    if (keys.left) {
      paddle.x -= paddleSpeed * dt;
    }
    if (keys.right) {
      paddle.x += paddleSpeed * dt;
    }
    if (keys.up) {
      paddle.y -= paddleSpeed * dt;
    }
    if (keys.down) {
      paddle.y += paddleSpeed * dt;
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
    const step = CONFIG.xpSpeed * dt;
    if (dist <= drop.size + 16 || step >= dist) {
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
      const source = brick.poisonSource || (brick.leechActive ? 'Leech' : 'Poison');
      damageBrick(brick, 1, now, source);
      if (brick.leechActive) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife && (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000)) {
          state.lives = Math.min(maxLife, state.lives + 0.25);
          state.lastVampireHeal = now;
        }
      }
    }
    if (brick.pestSpreadUntil && brick.pestSpreadUntil > now && brick.pestSpreadNext && brick.pestSpreadNext <= now) {
      brick.pestSpreadNext = now + 1500;
      const cx = brick.x + brick.w / 2;
      const cy = brick.y + brick.h / 2;
      const target = state.bricks
        .filter((b) => b.alive && b !== brick && !b.curseSource && !b.poisonActive)
        .map((b) => {
          const dx = b.x + b.w / 2 - cx;
          const dy = b.y + b.h / 2 - cy;
          return { b, dist: Math.hypot(dx, dy) };
        })
        .sort((a, b) => a.dist - b.dist)[0];
      if (target) {
        target.b.poisonActive = true;
        target.b.poisonNextTick = now + 1000;
        target.b.poisonSource = 'Pestilence';
        target.b.curseTick = now + 2500;
        target.b.curseMidTick = now + 1300;
        target.b.curseSpreadAt = now + 900;
        target.b.curseSource = 'Pestilence';
        target.b.effectColor = getPowerColor('Pestilence');
        target.b.effectUntil = target.b.curseTick;
        target.b.pestSpreadUntil = now + 3000;
        target.b.pestSpreadNext = now + 1500;
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
      const picks = targets.slice(0, 2);
      picks.forEach((entry) => {
        const target = entry?.b;
        if (target) {
          target.curseTick = now + 3000;
          target.curseMidTick = now + 1500;
          target.curseSpreadAt = now + 1000;
          target.curseSource = brick.curseSource || 'Curse';
          target.effectColor = getPowerColor('Curse');
          target.effectUntil = target.curseTick;
        }
      });
    }
  }

  // Tick malédiction (dégât différé)
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (brick.curseMidTick && brick.curseMidTick <= now) {
      brick.curseMidTick = null;
      damageBrick(brick, 1, now, brick.curseSource || 'Curse');
    }
    if (brick.curseTick && brick.curseTick <= now) {
      brick.curseTick = null;
      damageBrick(brick, 2, now, brick.curseSource || 'Curse');
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
      if (state.lives < maxLife && (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000)) {
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
      const source = brick.thornSource || 'Thorns';
      damageBrick(brick, 1.5, now, source);
      if (brick.leechActive) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife && (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000)) {
          state.lives = Math.min(maxLife, state.lives + 0.5);
          state.lastVampireHeal = now;
        }
      }
      if (brick.gravebound) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife && (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000)) {
          state.lives = Math.min(maxLife, state.lives + 0.25);
          state.lastVampireHeal = now;
        }
        brick.thornExpire = Math.max(brick.thornExpire || 0, now + 1500);
        brick.thornSecondTick = brick.thornSecondTick || now + 1200;
      }
    }
    if (brick.thornSecondTick && brick.thornSecondTick <= now) {
      brick.thornSecondTick = null;
      brick.effectColor = getPowerColor('Thorns');
      brick.effectUntil = brick.thornExpire;
      const source = brick.thornSource || 'Thorns';
      damageBrick(brick, 0.5, now, source);
      if (brick.gravebound) {
        const maxLife = getMaxLives();
        if (state.lives < maxLife && (!state.lastVampireHeal || now - state.lastVampireHeal >= 1000)) {
          state.lives = Math.min(maxLife, state.lives + 0.25);
          state.lastVampireHeal = now;
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
          if (!state.ballHeld) placeBallOnPaddle({ preserveY: true });
        } else if (ball.specialPower) {
          state.specialPocket.push(ball.specialPower);
          placeBallOnPaddle({ preserveY: true });
        } else {
          placeBallOnPaddle({ refill: true, preserveY: true });
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
    const mirrorLevel = Math.max(
      getTalentLevel('Mirror'),
      getTalentLevel('Prism Paddle') > 0 ? getTalentDef('Mirror').maxLevel : 0
    );
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

      // Rebond : bonus de vitesse et de dégâts cumulatif (max +50%)
      const bounceSpeedMult = 1.1;
      const damageMult = 1.1;
      const currentBoost = Math.max(1, ball.damageScale || 1);
      const nextBoost = Math.min(currentBoost * damageMult, 1.1 ** 3); // max ~1.331
      const speedBoost = Math.min(Math.hypot(ball.vx, ball.vy) * bounceSpeedMult, getBallSpeed(Boolean(ball.specialPower)) * 1.35);
      const speedRatio = speedBoost / (Math.hypot(ball.vx, ball.vy) || 1);
      ball.vx *= speedRatio;
      ball.vy *= speedRatio;
      ball.damageScale = nextBoost;
      ball.maxBoosted = nextBoost >= 1.1 ** 3;

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

        const damageScale = Number.isFinite(ball.damageScale) ? ball.damageScale : 1;
        const damage = (ball.specialPower === 'Metal' ? 3 : 1) * damageScale;
        state.lastHitSpecial = ball.specialPower || null;
        applyPowerOnHit(ball, brick, now);
        const source = ball.specialPower || 'Standard';
        damageBrick(brick, damage, now, source);
        applyFireSplash(ball, brick, now, damage);
        if (ball.echoBonus && ball.echoBonus > 0) {
          damageBrick(brick, 0.5, now, 'Echo');
          ball.echoBonus = Math.max(0, ball.echoBonus - 1);
        }

    if ((ball.specialPower === 'Wind' || ball.specialPower === 'Jetstream' || ball.specialPower === 'Cyclone' || ball.specialPower === 'Gale') && ball.windPierceLeft !== undefined) {
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
            const snapSpeed = ball.specialPower === 'Jetstream' || ball.specialPower === 'Cyclone' ? 0.8 : 0.5;
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
  const now = performance.now ? performance.now() : Date.now();
  if (!state.starfield.length) initStarfield();
  if (!starfieldLastTime) starfieldLastTime = now;
  const dt = Math.min((now - starfieldLastTime) / 1000, 0.05);
  starfieldLastTime = now;

  ctx.fillStyle = '#050915';
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  for (const star of state.starfield) {
    star.y += star.speed * dt;
    if (star.y > CONFIG.height + star.r) {
      star.y = -randomBetween(0, CONFIG.height * 0.2);
      star.x = Math.random() * CONFIG.width;
    }
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const gradient = ctx.createLinearGradient(0, 0, CONFIG.width, CONFIG.height);
  gradient.addColorStop(0, 'rgba(94, 234, 212, 0.08)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.12)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
}

function renderBeams(timeNow) {
  if (!state.beamEffects) state.beamEffects = [];
  state.beamEffects = state.beamEffects.filter((beam) => beam.until > timeNow);
  if (!state.beamEffects.length) return;
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.lineCap = 'round';
  state.beamEffects.forEach((beam) => {
    const color = beam.color || 'rgba(94,234,212,0.7)';
    if (beam.glow) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = beam.glowWidth || 10;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = color;
      ctx.beginPath();
      if (beam.mode === 'h') {
        ctx.moveTo(0, beam.y);
        ctx.lineTo(CONFIG.width, beam.y);
      } else if (beam.mode === 'v') {
        ctx.moveTo(beam.x, 0);
        ctx.lineTo(beam.x, CONFIG.height);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.lineWidth = beam.lineWidth || 4;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (beam.mode === 'h') {
      ctx.moveTo(0, beam.y);
      ctx.lineTo(CONFIG.width, beam.y);
    } else if (beam.mode === 'v') {
      ctx.moveTo(beam.x, 0);
      ctx.lineTo(beam.x, CONFIG.height);
    }
    ctx.stroke();
  });
  ctx.restore();
}

function getDamageEntries(maxCount = 8) {
  return Object.entries(state.damageByPower || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount);
}

function drawDamageOverlay(ctxTarget, title = 'Damage by power', options = {}) {
  const maxRows = 10;
  const entries = getDamageEntries(maxRows);
  if (!entries.length) return;
  const { topY = null } = options;
  const panelW = 540;
  const barH = 14;
  const barGap = 22;
  const panelH = 90 + entries.length * barGap;
  const x = (CONFIG.width - panelW) / 2;
  const isPause = state.paused && state.manualPause;
  const maxY = isPause ? CONFIG.height - CONFIG.height * 0.25 : CONFIG.height - 40;
  const minY = isPause ? CONFIG.height / 2 + 60 : 20;
  let y;
  if (Number.isFinite(topY)) {
    y = Math.min(topY, maxY - panelH);
  } else {
    y = maxY - panelH;
  }
  if (y < minY) y = minY;
  ctxTarget.save();
  ctxTarget.fillStyle = '#e2e8f0';
  ctxTarget.font = '26px "Segoe UI", sans-serif';
  ctxTarget.fillText(title, x + 12, y + 28);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  entries.forEach(([name, val], idx) => {
    const yPos = y + 52 + idx * (barGap * 2);
    const ratio = maxVal > 0 ? val / maxVal : 0;
    const owned = getPowerLevel(name) > 0 || getTalentLevel(name) > 0;
    const barColor = getPowerColor(name) || '#60a5fa';
    const width = (panelW - 80) * ratio;
    ctxTarget.fillStyle = 'rgba(15,23,42,0.3)';
    ctxTarget.fillRect(x + 12, yPos, panelW - 80, barH);
    ctxTarget.fillStyle = owned ? barColor : 'rgba(148,163,184,0.45)';
    ctxTarget.fillRect(x + 12, yPos, width, barH);
    ctxTarget.fillStyle = owned ? '#e2e8f0' : 'rgba(226,232,240,0.6)';
    ctxTarget.font = '18px "Segoe UI", sans-serif';
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    ctxTarget.fillText(`${name} · ${pct}%`, x + 12, yPos - 6);
  });
  ctxTarget.restore();
}

function drawRoundedRectPath(c, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  c.beginPath();
  c.moveTo(x + radius, y);
  c.lineTo(x + w - radius, y);
  c.quadraticCurveTo(x + w, y, x + w, y + radius);
  c.lineTo(x + w, y + h - radius);
  c.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  c.lineTo(x + radius, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - radius);
  c.lineTo(x, y + radius);
  c.quadraticCurveTo(x, y, x + radius, y);
  c.closePath();
}

function renderBricks() {
  const timeNow = performance.now ? performance.now() : Date.now();
  const hueShift = (timeNow / 50) % 360; // variation progressive des teintes
  const sortedBricks = [...state.bricks].sort((a, b) => {
    const ay = (a?.y || 0) + (a?.h || 0) / 2;
    const by = (b?.y || 0) + (b?.h || 0) / 2;
    if (ay !== by) return ay - by; // plus haut d'abord, plus bas en dernier (au-dessus)
    if (a?.type === 'boss' && b?.type !== 'boss') return 1;
    if (b?.type === 'boss' && a?.type !== 'boss') return -1;
    return 0;
  });
  for (const brick of sortedBricks) {
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
      const duration = 360;
      if (elapsed <= duration) {
        const intensity = 1 - elapsed / duration;
        const magnitudeX = 6 * intensity;
        const magnitudeY = 3 * intensity;
        shakeX = Math.sin(now * 0.14 + brick.x) * magnitudeX;
        shakeY = Math.cos(now * 0.16 + brick.y) * magnitudeY;
      } else {
        brick.shakeTime = null;
      }
    }

    const bw = Math.max(1, Math.abs(Number.isFinite(brick.w) ? brick.w : CONFIG.brickHeight));
    const bh = Math.max(1, Math.abs(Number.isFinite(brick.h) ? brick.h : CONFIG.brickHeight));
    const renderScale = Number.isFinite(brick.renderScale) ? brick.renderScale : 1;
    const totalScale = scale * renderScale;

    const drawX = (brick.x + shakeX) - (totalScale - 1) * bw / 2;
    const drawY = (brick.y + shakeY) - (totalScale - 1) * bh / 2;
    const drawW = bw * totalScale;
    const drawH = bh * totalScale;

    let flashAlpha = 0;
    if (brick.flashTime) {
      const f = Math.max(0, 1 - (now - brick.flashTime) / 200);
      if (f > 0) flashAlpha = 0.4 * f * (0.5 + 0.5 * Math.sin(now / 40));
      else brick.flashTime = null;
    }

    const tint = `hsla(${baseHue}, 70%, 60%, ${0.55 * alpha})`;
    const isBoss = brick.type === 'boss';
    const spritePad = isBoss ? Math.max(6, Math.min(drawW, drawH) * 0.1) : Math.max(2, Math.min(drawW, drawH) * 0.04);
    const spriteX = drawX - spritePad;
    const spriteY = drawY - spritePad;
    const spriteW = drawW + spritePad * 2;
    const spriteH = drawH + spritePad * 2;

    let spriteImg = isBoss && bossBrickSpriteReady ? bossBrickSprite : brickSprite;
    if (isBoss && bossVariantsReady && bossVariants.length) {
      const normW = Math.max(1, brick.w || 1);
      const normH = Math.max(1, brick.h || 1);
      const basis =
        (Number.isFinite(brick.row) ? brick.row : 0) * 68 +
        Math.floor((brick.x || 0) / normW) * 36 +
        Math.floor((brick.y || 0) / normH) * 20;
      const idx = Math.abs(basis) % bossVariants.length;
      spriteImg = bossVariants[idx] || spriteImg;
    } else if (!isBoss && brickVariantsReady && brickVariants.length) {
      const normW = Math.max(1, brick.w || 1);
      const normH = Math.max(1, brick.h || 1);
      const basis =
        (Number.isFinite(brick.row) ? brick.row : 0) * 7 +
        Math.floor((brick.x || 0) / normW) * 3 +
        Math.floor((brick.y || 0) / normH);
      const idx = Math.abs(basis) % brickVariants.length;
      spriteImg = brickVariants[idx] || spriteImg;
    }
    const drewSprite = Boolean(spriteImg);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (drewSprite) {
      ctx.drawImage(spriteImg, spriteX, spriteY, spriteW, spriteH);
    } else {
      ctx.fillStyle = tint;
      const radius = Math.max(4, Math.min(spriteW, spriteH) * 0.12);
      drawRoundedRectPath(ctx, spriteX, spriteY, spriteW, spriteH, radius);
      ctx.fill();
    }
    ctx.restore();

    if (isBoss && bossFrameReady && bossFrameOverlays.length) {
      const normW = Math.max(1, brick.w || 1);
      const normH = Math.max(1, brick.h || 1);
      const basis =
        (Number.isFinite(brick.row) ? brick.row : 0) * 11 +
        Math.floor((brick.x || 0) / normW) * 5 +
        Math.floor((brick.y || 0) / normH) * 3;
      const idx = Math.abs(basis) % bossFrameOverlays.length;
      const frame = bossFrameOverlays[idx];
      const cx = drawX + drawW / 2;
      const cy = drawY + drawH / 2;
      const frameW = drawW * 1.35;
      const frameH = frameW * (140 / 220);
      const fx = cx - frameW / 2;
      const fy = cy - frameH / 2;
      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha * 0.95);
      ctx.drawImage(frame, fx, fy, frameW, frameH);
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = drewSprite ? Math.min(1, alpha * 0.85) : Math.min(1, alpha * 0.45);
    ctx.fillStyle = tint;
    const radius = Math.max(4, Math.min(spriteW, spriteH) * 0.12);
    drawRoundedRectPath(ctx, spriteX, spriteY, spriteW, spriteH, radius);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = `rgba(15, 23, 42, ${0.45 * alpha})`;
    ctx.lineWidth = 1.5;
    const radiusStroke = Math.max(4, Math.min(drawW, drawH) * 0.12);
    drawRoundedRectPath(ctx, drawX, drawY, drawW, drawH, radiusStroke);
    ctx.stroke();
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
      const pad = brick.type === 'boss' ? 1 : 4;
      const radius = Math.max(3, Math.min(drawW, drawH) * 0.12);
      ctx.save();
      ctx.fillStyle = brick.effectColor;
      drawRoundedRectPath(ctx, drawX - pad, drawY - pad, drawW + pad * 2, drawH + pad * 2, radius);
      ctx.fill();
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
  const now = performance.now ? performance.now() : Date.now();
  const { paddle } = state;
  const raquetteLv = getTalentLevel('Paddle');
  const baseColor = raquetteLv > 0 ? '#22d3ee' : '#38bdf8';
  const damageActive = state.damageFlashUntil && state.damageFlashUntil > now;
  const shakeActive = state.damageShakeUntil && state.damageShakeUntil > now;
  const shakeT = shakeActive ? (state.damageShakeUntil - now) / 500 : 0;
  const shakeAmp = shakeActive ? 6 * shakeT : 0;
  const shakeX = shakeActive ? Math.sin(now / 55) * shakeAmp : 0;
  const shakeY = shakeActive ? Math.cos(now / 65) * shakeAmp : 0;
  const haloPulse = damageActive ? 0.35 + 0.25 * Math.sin(now / 80) : 0;
  const haloPad = 8;
  const drawHalo = (x, y, w, h) => {
    if (!damageActive) return;
    ctx.save();
    ctx.fillStyle = `rgba(248, 113, 113, ${haloPulse.toFixed(2)})`;
    const radius = Math.max(6, Math.min(w, h) * 0.4);
    drawRoundedRectPath(ctx, x - haloPad, y - haloPad, w + haloPad * 2, h + haloPad * 2, radius);
    ctx.fill();
    ctx.restore();
  };
  const drawSprite = (img, x, w, h) => {
    if (!img) return;
    const targetW = w;
    const targetH = h * 2; // allow some height beyond paddle
    const scale = Math.min(targetW / img.width, targetH / img.height);
    const drawW = targetW;
    const drawH = img.height * (drawW / img.width);
    const dx = x + shakeX;
    const isModule = img === moduleSprite;
    const dy = paddle.y + (h - drawH) / 2 + (isModule ? drawH * 0.25 : 0) + shakeY;
    drawHalo(dx, dy, drawW, drawH);
    ctx.save();
    ctx.shadowColor = 'transparent';
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
    if (!isModule) {
      const powerIcons = getActivePowerIcons();
      const talentIcons = getActiveTalentIcons();
      const drawRow = (icons, y) => {
        const size = Math.min(drawW, drawH) * 0.24;
        const spacing = 6;
        const totalW = icons.length * size + Math.max(0, icons.length - 1) * spacing;
        let ix = dx + drawW / 2 - totalW / 2;
        icons.forEach(({ img }) => {
          if (img?.complete) {
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.25)';
            ctx.shadowBlur = 3;
            ctx.drawImage(img, ix, y, size, size);
            ctx.restore();
          }
          ix += size + spacing;
        });
      };
      if (powerIcons.length) {
        const size = Math.min(drawW, drawH) * 0.24;
        const y = dy + drawH - size * 2 - 8;
        drawRow(powerIcons, y);
      }
      if (talentIcons.length) {
        const size = Math.min(drawW, drawH) * 0.24;
        const y = dy + drawH - size - 2;
        drawRow(talentIcons, y);
      }
    }
  };

  if (paddleSpriteReady && paddleSprite) {
    // Draw only the sprite for the main paddle; collision uses geometry, not fill.
    drawSprite(paddleSprite, paddle.x, paddle.w, paddle.h);
  } else {
    ctx.fillStyle = baseColor;
    drawHalo(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  }

  const mirrorLevel = Math.max(
    getTalentLevel('Mirror'),
    getTalentLevel('Prism Paddle') > 0 ? getTalentDef('Mirror').maxLevel : 0
  );
  const halfWidth = paddle.w * 0.5;
  const gap = 8;
  if (mirrorLevel >= 1) {
    if (moduleSpriteReady && moduleSprite) {
      drawSprite(moduleSprite, paddle.x - halfWidth - gap, halfWidth, paddle.h);
    } else {
      ctx.fillStyle = baseColor;
      drawHalo(paddle.x - halfWidth - gap, paddle.y, halfWidth, paddle.h);
      ctx.fillRect(paddle.x - halfWidth - gap, paddle.y, halfWidth, paddle.h);
    }
  }
  if (mirrorLevel >= 2) {
    if (moduleSpriteReady && moduleSprite) {
      drawSprite(moduleSprite, paddle.x + paddle.w + gap, halfWidth, paddle.h);
    } else {
      ctx.fillStyle = baseColor;
      drawHalo(paddle.x + paddle.w + gap, paddle.y, halfWidth, paddle.h);
      ctx.fillRect(paddle.x + paddle.w + gap, paddle.y, halfWidth, paddle.h);
    }
  }

  if (state.showPaddleRects) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(paddle.x, paddle.y, paddle.w, paddle.h);
    if (mirrorLevel >= 1) {
      ctx.strokeRect(paddle.x - halfWidth - gap, paddle.y, halfWidth, paddle.h);
    }
    if (mirrorLevel >= 2) {
      ctx.strokeRect(paddle.x + paddle.w + gap, paddle.y, halfWidth, paddle.h);
    }
    ctx.restore();
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


function renderShots() {
  const now = performance.now ? performance.now() : Date.now();
  state.shotEffects = state.shotEffects.filter((s) => s.until > now);
  if (!state.shotEffects.length) return;
  ctx.save();
  state.shotEffects.forEach((shot) => {
    const t = 1 - (shot.until - now) / shot.duration;
    const alpha = 0.6 * (1 - t);
    const width = shot.baseWidth * (1 + 0.2 * Math.sin(now / 40));
    const height = shot.length * (1 + 0.05 * Math.sin(now / 60));
    const x = shot.x - width / 2;
    const y = shot.y - height;
    const gradient = ctx.createLinearGradient(shot.x, y, shot.x, shot.y);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
    gradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.6)');
    gradient.addColorStop(0.6, 'rgba(14, 165, 233, 0.8)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.globalAlpha = alpha;
    drawRoundedRectPath(ctx, x, y, width, height, Math.max(6, width * 0.4));
    ctx.fillStyle = gradient;
    ctx.fill();
  });
  ctx.restore();
}

function renderBalls() {
  const timeNow = performance.now ? performance.now() : Date.now();
  const withAlpha = (color, alpha) => {
    if (!color) return `rgba(244, 114, 182, ${alpha})`;
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch;
      return `rgba(${r},${g},${b},${alpha})`;
    }
    const hexMatch = color.match(/^#?([a-f0-9]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return color;
  };
  const blinkValue = (period) => (Math.sin(timeNow / period) + 1) / 2;
  const drawBallSprite = (x, y, r, vx, vy, specialPower, ballObj = null) => {
    const speed = Math.hypot(vx, vy);
    const spin = (speed / 400) * (timeNow / 16);
    const baseScale = 1;
    const scale = baseScale * Math.min(1.2, 0.6 + speed / 800);
    const angle = spin % (Math.PI * 2);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    const size = r * 2;
    if (ballSpriteReady && ballSprite) {
      ctx.drawImage(ballSprite, -size, -size, size * 2, size * 2);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (specialPower) {
      ctx.strokeStyle = getPowerColor(specialPower).replace('0.35', '0.9');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    if (ballObj?.maxBoosted) {
      ctx.save();
      const pulse = blinkValue(70);
      const hue = Math.floor((timeNow / 20) % 360);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.55 + 0.35 * pulse})`;
      ctx.shadowColor = `hsla(${hue}, 90%, 70%, ${0.4 + 0.4 * pulse})`;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(x, y, r + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(${(hue + 60) % 360}, 90%, 70%, ${0.35 + 0.4 * blinkValue(40)})`;
      ctx.arc(x, y, r + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  for (const ball of state.balls) {
    const accent = (() => {
      const blink = (period) => (Math.sin(timeNow / period) + 1) / 2;
      if (ball.specialPower === 'Fire') return `rgba(255, 215, 0, ${(0.35 + 0.65 * blink(80)).toFixed(2)})`;
      if (ball.specialPower === 'Ice') return `rgba(96, 165, 250, ${(0.35 + 0.65 * blink(90)).toFixed(2)})`;
      if (ball.specialPower === 'Poison') return `rgba(52, 211, 153, ${(0.35 + 0.65 * blink(85)).toFixed(2)})`;
      if (ball.specialPower === 'Metal') return `rgba(226, 232, 240, ${(0.35 + 0.65 * blink(95)).toFixed(2)})`;
      if (ball.specialPower === 'Vampire') return `rgba(239, 68, 68, ${(0.35 + 0.65 * blink(85)).toFixed(2)})`;
      if (ball.specialPower === 'Light') return `rgba(255, 255, 255, ${(0.3 + 0.7 * blink(80)).toFixed(2)})`;
      if (ball.specialPower === 'Thorns') return `rgba(120, 72, 48, ${(0.35 + 0.65 * blink(100)).toFixed(2)})`;
      if (ball.specialPower === 'Curse') return `rgba(139, 92, 246, ${(0.35 + 0.65 * blink(90)).toFixed(2)})`;
      if (ball.specialPower) return getPowerColor(ball.specialPower);
      return null;
    })();
    const fill = '#ffffff'; // neutral base; powers tint via accent/trail/stroke
    if (!state.showBallTrails) {
      ball.trail = [];
      ctx.fillStyle = fill;
      drawBallSprite(ball.x, ball.y, ball.r, ball.vx, ball.vy, ball.specialPower, ball);
      continue;
    }
    ball.trail = Array.isArray(ball.trail) ? ball.trail : [];
    ball.trail.push({
      x: ball.x,
      y: ball.y,
      r: ball.r,
      vx: ball.vx,
      vy: ball.vy,
      power: ball.specialPower,
      powerColor: accent,
      base: fill
    });
    const maxTrail = 10;
    if (ball.trail.length > maxTrail) {
      ball.trail.splice(0, ball.trail.length - maxTrail);
    }

    ctx.save();
    ctx.shadowBlur = 14;
    for (let i = 0; i < ball.trail.length - 1; i += 1) {
      const node = ball.trail[i];
      const t = i / (ball.trail.length - 1 || 1);
      const fadeBase = Math.max(0, (1 - t) ** 1.2) * 0.28;
      // Plus épais à la base (proche de la balle), très fin en extrémité.
      const radius = node.r * (0.2 + 1.0 * Math.pow(t, 0.4));
      const baseColor = node.power ? (node.powerColor || getPowerColor(node.power)) : node.base || fill;
      const fadeScale = node.power ? 1 : 0.75; // 25% moins opaque pour les balles standards
      const color = withAlpha(baseColor || '#ffffff', fadeBase * fadeScale);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.beginPath();
      const thicknessScale = node.power ? 1 : 0.75; // 25% thinner for standard balls
      ctx.arc(node.x, node.y, radius * thicknessScale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = fill;
    drawBallSprite(ball.x, ball.y, ball.r, ball.vx, ball.vy, ball.specialPower, ball);
  }

  if (state.ballHeld) {
    ctx.fillStyle = '#fb7185';
    drawBallSprite(state.heldBall.x, state.heldBall.y, state.heldBall.r, 0, 0, null);
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
  let powersBlockHeight = 0;
  let talentsBlockHeight = 0;
  let talentsY = infoY;
  if (state.showLoadoutSidebar) {
    const powerLines = state.powers; // affiche tous
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
    }

    // Histogramme dégâts par pouvoir (à gauche sous le bloc FPS)
    const histX = leftX;
    const histY = leftY + 60; // under FPS/Score block
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
      h.font = '16px "Segoe UI", sans-serif';
      h.fillText('Tip: Settings lets you enable/disable auto-pause.', 120, CONFIG.height / 2 + 56);
      drawDamageOverlay(h, 'Damage by power');
    }

    if (!state.running) {
      h.fillStyle = 'rgba(0,0,0,0.6)';
      h.fillRect(0, 0, CONFIG.width, CONFIG.height);
      h.fillStyle = '#e2e8f0';
      h.font = '32px "Segoe UI", sans-serif';
      h.fillText('Game over - Press Enter to replay', 120, CONFIG.height / 2);
      h.fillText(`Score: ${formatScore(state.score)}`, 120, CONFIG.height / 2 + 36);
      drawDamageOverlay(h, 'Damage by power', { topY: CONFIG.height / 2 + 72 });
    }
  }

  ctx.drawImage(hudBuffer, 0, 0);
}

function render() {
  const timeNow = performance.now ? performance.now() : Date.now();
  renderBackground();
  renderBricks();
  renderBeams(timeNow);
  renderPaddle();
  renderXpDrops();
  renderAimCone();
  renderBalls();
  renderShots();
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
      const moveLeft = isKeyBinding(event, state.keyBindings.left);
      const moveRight = isKeyBinding(event, state.keyBindings.right);
      const moveUp = isKeyBinding(event, state.keyBindings.up);
      const moveDown = isKeyBinding(event, state.keyBindings.down);
      if (moveLeft || moveRight || moveUp || moveDown) {
        event.preventDefault();
        moveModalSelection((moveRight ? 1 : 0) - (moveLeft ? 1 : 0), (moveDown ? 1 : 0) - (moveUp ? 1 : 0));
        return;
      }
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
    if (isKeyBinding(event, state.keyBindings.up)) state.keys.up = true;
    if (isKeyBinding(event, state.keyBindings.down)) state.keys.down = true;
    if (keyValue === 'enter' && !state.running) {
      state.running = true;
      resetGame();
    }
  });
  window.addEventListener('keyup', (event) => {
    if (isSettingsOpen() || isCatalogOpen()) return;
    if (isKeyBinding(event, state.keyBindings.left)) state.keys.left = false;
    if (isKeyBinding(event, state.keyBindings.right)) state.keys.right = false;
    if (isKeyBinding(event, state.keyBindings.up)) state.keys.up = false;
    if (isKeyBinding(event, state.keyBindings.down)) state.keys.down = false;
  });
  autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    setAutoButtonLabel();
    savePreferences();
  });
  // Speed slider interactions
  if (speedStops.length && speedThumb && speedFill) {
    const speeds = [1, 2, 3, 5];
    const snapTo = (val) => {
      const closest = speeds.reduce((acc, v) => (Math.abs(v - val) < Math.abs(acc - val) ? v : acc), speeds[0]);
      setTimeScale(closest);
      savePreferences();
    };
    speedStops.forEach((stop) => {
      stop.addEventListener('click', () => {
        snapTo(Number(stop.dataset.speed));
      });
    });
    const rail = speedFill.parentElement;
    const onPointer = (clientX) => {
      const rect = rail.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const speedsCount = speeds.length - 1;
      const approx = 1 + pct * (speedsCount);
      const target = speeds[Math.round((speeds.length - 1) * pct)] || 1;
      snapTo(target);
    };
    speedThumb.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const move = (ev) => onPointer(ev.clientX);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
    });
    rail.addEventListener('click', (e) => {
      onPointer(e.clientX);
    });
  }
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
  captureKey(settingsUpInput);
  captureKey(settingsDownInput);
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
  languageSelect?.addEventListener('change', (event) => {
    const val = event.target.value;
    if (['en', 'fr', 'es'].includes(val)) {
      state.language = val;
      savePreferences();
      applyTranslations();
    }
  });
  pilotConfirmBtn?.addEventListener('click', handlePilotConfirm);
  pilotModalBackdrop?.addEventListener('click', (event) => {
    // On force le choix d'un pilote : clic extérieur ne ferme pas, mais ne bloque pas non plus.
    if (event.target === pilotModalBackdrop) {
      maybeOpenPilotModal();
    }
  });
  powerPassBtn?.addEventListener('click', handlePowerPass);
  powerRerollBtn?.addEventListener('click', handlePowerReroll);
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

  const canResumeFromCanvas = () => (
    !state.powerModalOpen &&
    !state.infoOpen &&
    !state.catalogOpen &&
    !state.settingsOpen &&
    !state.awaitingName &&
    !state.awaitingPilot
  );

  canvas.addEventListener('click', (event) => {
    if (state.manualPause && state.paused && canResumeFromCanvas()) {
      state.manualPause = false;
      refreshPauseState();
      updatePauseButton();
      return;
    }
    if (!state.running) {
      state.running = true;
      resetGame();
      return;
    }
    if (state.ballHeld) {
      if (state.awaitingPilot) return;
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
    if (state.ballHeld && !state.awaitingPilot) launchBall();
  }, { passive: true });

  canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateAim(touch.clientX, touch.clientY);
  }, { passive: true });
}

function init() {
  warnMissingMediaMappings();
  preloadAssets(['ship.svg', 'ship-flat.svg', 'brick.svg', 'brick-boss.svg', 'ball.svg', ...BRICK_VARIANT_FILES, ...BOSS_VARIANT_FILES]).catch(() => {});
  loadImage('ship.svg')
    .then((img) => {
      paddleSprite = img;
      paddleSpriteReady = true;
    })
    .catch(() => {
      console.warn('Ship sprite failed to load, using default shape.');
      paddleSpriteReady = false;
    });
  loadImage('ship-flat.svg')
    .then((img) => {
      moduleSprite = img;
      moduleSpriteReady = true;
    })
    .catch(() => {
      console.warn('Module sprite failed to load, using default shapes.');
      moduleSpriteReady = false;
    });
  loadImage('ball.svg')
    .then((img) => {
      ballSprite = img;
      ballSpriteReady = true;
    })
    .catch(() => {
      console.warn('Ball sprite failed to load, using default circles.');
      ballSpriteReady = false;
    });
  loadImage('brick.svg')
    .then((img) => {
      brickSprite = img;
      brickSpriteReady = true;
    })
    .catch(() => {
      console.warn('Brick sprite failed to load, using fallback rectangles.');
      brickSpriteReady = false;
    });
  loadImage('brick-boss.svg')
    .then((img) => {
      bossBrickSprite = img;
      bossBrickSpriteReady = true;
    })
    .catch(() => {
      console.warn('Boss brick sprite failed to load, using default brick sprite.');
      bossBrickSpriteReady = false;
    });
  Promise.all(BRICK_VARIANT_FILES.map((file) => loadImage(file).catch(() => null)))
    .then((imgs) => {
      brickVariants = imgs.filter(Boolean);
      brickVariantsReady = brickVariants.length > 0;
      if (!brickVariantsReady) {
        console.warn('Brick variants failed to load, falling back to default brick sprite.');
      }
    })
    .catch(() => {
      brickVariants = [];
      brickVariantsReady = false;
    });
  Promise.all(BOSS_VARIANT_FILES.map((file) => loadImage(file).catch(() => null)))
    .then((imgs) => {
      bossVariants = imgs.filter(Boolean);
      bossVariantsReady = bossVariants.length > 0;
    })
    .catch(() => {
      bossVariants = [];
      bossVariantsReady = false;
    });
  Promise.all(BOSS_FRAME_FILES.map((file) => loadImage(file).catch(() => null)))
    .then((imgs) => {
      bossFrameOverlays = imgs.filter(Boolean);
      bossFrameReady = bossFrameOverlays.length > 0;
    })
    .catch(() => {
      bossFrameOverlays = [];
      bossFrameReady = false;
    });
  resizeCanvas();
  initStarfield();
  bindControls();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initStarfield();
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
  window.addEventListener('blur', () => {
    if (!state.autoPauseEnabled || state.gameOverHandled || !state.running) return;
    state.manualPause = true;
    refreshPauseState();
    updatePauseButton();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.autoPauseEnabled && state.running) {
      state.manualPause = true;
      refreshPauseState();
      updatePauseButton();
    }
  });
  const savedName = loadPlayerName();
  resetGame();
  loadPreferences();
  applyTranslations();
  const restored = loadSession();
  setAutoButtonLabel();
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
  loadPilotProgress();
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
  const isCyclone = power === 'Cyclone';
  if (power === 'Ice') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 3000); // 3s de gel
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.slowUntil;
  } else if (power === 'Poison') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.poisonSource = power;
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
  } else if (power === 'Meteor') {
    const pushed = tryCrusherPush(brick, ball, 20);
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 600;
    damageBrick(brick, 0.5, now, power);
    if (pushed) {
      ball.crusherPushCount = (ball.crusherPushCount || 0) + 1;
      if (ball.crusherPushCount >= 2 && !ball.returning) {
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
          damageBrick(b, 1, now, power);
          b.effectColor = getPowerColor(power);
          b.effectUntil = now + 500;
        }
        redirectBallToPaddle(ball, 0.65);
      }
    }
  } else if (power === 'Crusher' || power === 'Gale') {
    const pushed = tryCrusherPush(brick, ball, power === 'Gale' ? 18 : 14);
    if (pushed) {
      ball.crusherPushCount = (ball.crusherPushCount || 0) + 1;
      brick.effectColor = getPowerColor(power);
      brick.effectUntil = now + 400;
      if (ball.crusherPushCount >= 3 && !ball.returning) {
        redirectBallToPaddle(ball, power === 'Gale' ? 0.75 : 0.6);
      }
    }
  } else if (power === 'Curse') {
    brick.curseTick = now + 3000;
    brick.curseMidTick = now + 1500;
    brick.curseSpreadAt = now + 1000;
    brick.curseSource = power;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
  } else if (power === 'Pestilence') {
    brick.poisonActive = true;
    brick.poisonNextTick = now + 1000;
    brick.poisonSource = power;
    brick.curseTick = now + 3500;
    brick.curseMidTick = now + 1800;
    brick.curseSpreadAt = now + 1200;
    brick.curseSource = power;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
    if (!brick.pestSpreadUntil || brick.pestSpreadUntil < now) {
      brick.pestSpreadUntil = now + 4500;
      brick.pestSpreadNext = now + 1500;
    }
  } else if (power === 'Thorns') {
    brick.thornActive = true;
    brick.thornNextTick = now + 1000; // +1.5 dmg
    brick.thornSecondTick = now + 2000; // +0.5 dmg
    brick.thornExpire = brick.thornSecondTick;
    brick.thornSource = power;
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
    brick.poisonSource = power;
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
      b.poisonSource = power;
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
    brick.poisonSource = power;
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
    applyLightStun(brick, ball, now + 700); // slightly longer
    brick.curseTick = now + 3500;
    brick.curseMidTick = now + 1800;
    brick.curseSpreadAt = now + 1000;
    brick.curseSource = power;
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
      .slice(0, 3);
    for (const { b } of nearby) {
      b.curseTick = now + 3500;
      b.curseMidTick = now + 1800;
      b.effectColor = getPowerColor(power);
      b.effectUntil = b.curseTick;
    }
  } else if (power === 'Frostbite') {
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 3000);
    brick.thornActive = true;
    brick.thornNextTick = now + 800;
    brick.thornSecondTick = now + 1600;
    brick.thornExpire = now + 2000;
    brick.thornSource = power;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
  } else if (power === 'Gravebound') {
    brick.thornActive = true;
    brick.thornNextTick = now + 800;
    brick.thornSecondTick = now + 1600;
    brick.thornExpire = now + 2000;
    brick.gravebound = true;
    brick.thornSource = power;
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
    brick.poisonSource = power;
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
    brick.thornSource = power;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
    ball.vx *= 1.05;
    ball.vy *= 1.05;
  } else if (power === 'Radiance') {
    applyLightStun(brick, ball, now);
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
      .slice(0, 4);
    for (const { b } of shards) {
      damageBrick(b, 1.5, now, 'Shard');
    }
  } else if (power === 'Plaguefire') {
    brick.curseTick = now + 3000;
    brick.curseSource = power;
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
      b.curseSource = power;
      b.effectColor = getPowerColor(power);
      b.effectUntil = b.curseTick;
    }
  } else if (power === 'Cyclone') {
    // Apply a short curse on pierced bricks.
    brick.curseTick = now + 2000;
    brick.curseSource = power;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.curseTick;
  } else if (power === 'Beamline') {
    fireLaser(power, brick, now, ['h']);
  } else if (power === 'Pillar') {
    fireLaser(power, brick, now, ['v']);
  } else if (power === 'Crossfire') {
    fireLaser(power, brick, now, ['h', 'v']);
  } else if (power === 'Mirrorwind') {
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 800;
    ball.windPierceLeft = Math.max(0, ball.windPierceLeft || 0) + 2;
    if (!ball.spawnedMirrorClone) {
      const clone = normalizeBall({
        x: ball.x + 6,
        y: ball.y,
        vx: -ball.vx,
        vy: ball.vy,
        r: ball.r,
        specialPower: 'Mirrorwind',
        damageScale: 0.6,
        windPierceLeft: 2,
        returning: false,
        reward: false,
        spawnedMirrorClone: true
      }, { r: ball.r });
      state.balls.push(clone);
      ball.spawnedMirrorClone = true;
    }
  } else if (power === 'Radiant') {
    applyLightStun(brick, ball, now);
    grantTempHpOnce(power, 2, 5000);
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = now + 1200;
  } else if (power === 'Thornstep') {
    brick.thornActive = true;
    brick.thornNextTick = now + 700;
    brick.thornSecondTick = now + 1500;
    brick.thornExpire = now + 1900;
    brick.effectColor = getPowerColor(power);
    brick.effectUntil = brick.thornExpire;
    brick.slowUntil = Math.max(brick.slowUntil || 0, now + 900);
  } else if (power === 'Scopebeam') {
    fireLaser(power, brick, now, ['h', 'v']);
  }
}

function damageBrick(brick, amount, now, sourcePower = null) {
  if (state.royalSurgeUntil && state.royalSurgeUntil > now) {
    amount *= 1.1;
  }
  brick.flashTime = now;
  brick.shakeTime = now;
  if (brick.rustUntil && brick.rustUntil > now) {
    amount *= 1.2;
  }
  brick.hp = Math.max(0, (brick.hp || 1) - amount);

  if (sourcePower) {
    const key = sourcePower || 'Standard';
    state.damageByPower[key] = (state.damageByPower[key] || 0) + amount;
  } else {
    state.damageByPower.Standard = (state.damageByPower.Standard || 0) + amount;
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
    brick.pestSpreadUntil = 0;
    brick.pestSpreadNext = 0;
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
