const SVG_SIZE = 96;

function makeIcon(name, primary, secondary = null, type = 'power', extraInner = '', extraDefs = '') {
  const p = primary || '#60a5fa';
  const s = secondary || p;
  const safeName = (name || '?').slice(0, 2).toUpperCase();
  const idBase = safeName.replace(/[^A-Za-z0-9]/g, '') || 'X';
  const strokeId = `stroke-${idBase}-${type}`;
  const coreId = `core-${idBase}-${type}`;
  const overlayId = `overlay-${idBase}-${type}`;
  const fusionBlendId = `fusionBlend-${idBase}-${type}`;

  const typeOverlay = (() => {
    if (type === 'talent') {
      return `
        <rect x="13" y="13" width="70" height="70" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2.5"/>
        <path d="M48 18 L70 34 L62 70 L34 70 L26 34 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
        <circle cx="48" cy="48" r="10" fill="rgba(255,255,255,0.08)"/>
      `;
    }
    if (type === 'fusion') {
      return `
        <linearGradient id="${fusionBlendId}" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${p}" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="${s}" stop-opacity="0.65"/>
        </linearGradient>
        <path d="M10 18 Q48 6 86 18 L86 78 Q48 90 10 78 Z" fill="url(#${fusionBlendId})" opacity="0.28"/>
        <circle cx="48" cy="48" r="34" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
        <path d="M24 48 H72 M48 24 V72" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="4 6"/>
      `;
    }
    return '';
  })();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="${strokeId}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${p}"/>
      <stop offset="100%" stop-color="${s}"/>
    </linearGradient>
    <radialGradient id="${coreId}" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
      <stop offset="60%" stop-color="${p}"/>
      <stop offset="100%" stop-color="${s}"/>
    </radialGradient>
    ${extraDefs}
  </defs>
  <rect x="6" y="6" width="84" height="84" rx="18" fill="#0b1223" stroke="url(#${strokeId})" stroke-width="4"/>
  ${typeOverlay}
  <circle cx="48" cy="48" r="22" fill="url(#${coreId})" />
  <circle cx="48" cy="48" r="30" fill="none" stroke="${p}" stroke-width="3" stroke-opacity="0.6" stroke-dasharray="6 6"/>
  ${extraInner}
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const MEDIA_LIST = [
  // Powers
  {
    name: 'Fire',
    imageUrl: makeIcon(
      'Fi',
      '#f97316',
      '#fbbf24',
      'power',
      '<g transform="translate(0,-2)"><path d="M48 30 C53 37 55 43 53 47 C51 51 47 53 45 57 C43 61 45 65 48 67 C53 64 58 60 59 55 C61 48 57 40 52 34 C50 31 49 30 48 30 Z" fill="url(#flame-FI-power)" stroke="rgba(0,0,0,0.45)" stroke-width="1.8"/><path d="M48 36 C50 40 51 44 50 46 C49 48 47 49 46 52 C45 54 46 56 48 57 C50 56 52 54 53 52 C54 48 52 44 50 40 C49 38 49 36 48 36 Z" fill="rgba(255,255,255,0.7)"/></g>',
      '<radialGradient id="flame-FI-power" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff4e6"/><stop offset="40%" stop-color="#ffb703"/><stop offset="75%" stop-color="#f97316"/><stop offset="100%" stop-color="#b91c1c"/></radialGradient>'
    ),
    color: '#f97316'
  },
  { name: 'Ice', imageUrl: makeIcon('Ic', '#38bdf8', '#0ea5e9', 'power'), color: '#38bdf8' },
  { name: 'Poison', imageUrl: makeIcon('Po', '#22c55e', '#16a34a', 'power'), color: '#22c55e' },
  { name: 'Metal', imageUrl: makeIcon('Me', '#94a3b8', '#cbd5e1', 'power'), color: '#94a3b8' },
  { name: 'Vampire', imageUrl: makeIcon('Va', '#ef4444', '#f87171', 'power'), color: '#ef4444' },
  { name: 'Light', imageUrl: makeIcon('Li', '#fef08a', '#fde047', 'power'), color: '#fef08a' },
  { name: 'Thorns', imageUrl: makeIcon('Th', '#16a34a', '#84cc16', 'power'), color: '#16a34a' },
  { name: 'Curse', imageUrl: makeIcon('Cu', '#a855f7', '#7c3aed', 'power'), color: '#a855f7' },
  { name: 'Wind', imageUrl: makeIcon('Wi', '#7dd3fc', '#38bdf8', 'power'), color: '#7dd3fc' },
  { name: 'Beamline', imageUrl: makeIcon('Be', '#5eead4', '#22d3ee', 'power'), color: '#5eead4' },
  { name: 'Pillar', imageUrl: makeIcon('Pi', '#c084fc', '#a855f7', 'power'), color: '#c084fc' },

  // Talents
  { name: 'Boots', imageUrl: makeIcon('Bo', '#cbd5e1', '#94a3b8', 'talent'), color: '#cbd5e1' },
  { name: 'Feather', imageUrl: makeIcon('Fe', '#7dd3fc', '#38bdf8', 'talent'), color: '#7dd3fc' },
  { name: 'Gloves', imageUrl: makeIcon('Gl', '#fbbf24', '#f59e0b', 'talent'), color: '#fbbf24' },
  { name: 'Paddle', imageUrl: makeIcon('Pa', '#f59e0b', '#fb923c', 'talent'), color: '#f59e0b' },
  { name: 'Mirror', imageUrl: makeIcon('Mi', '#cbd5e1', '#e2e8f0', 'talent'), color: '#cbd5e1' },
  { name: 'Endurance', imageUrl: makeIcon('En', '#7c3aed', '#a855f7', 'talent'), color: '#7c3aed' },
  { name: 'Scope', imageUrl: makeIcon('Sc', '#38bdf8', '#0ea5e9', 'talent'), color: '#38bdf8' },
  { name: 'Momentum', imageUrl: makeIcon('Mo', '#fb923c', '#f97316', 'talent'), color: '#fb923c' },
  { name: 'Resilience', imageUrl: makeIcon('Re', '#10b981', '#22c55e', 'talent'), color: '#10b981' },
  { name: 'Surge', imageUrl: makeIcon('Su', '#c084fc', '#a855f7', 'talent'), color: '#c084fc' },
  { name: 'Anti Gravity', imageUrl: makeIcon('AG', '#38bdf8', '#7dd3fc', 'talent'), color: '#38bdf8' },
  { name: 'Booster', imageUrl: makeIcon('Bo', '#f97316', '#f59e0b', 'talent'), color: '#f97316' },

  // Fusions
  { name: 'Sun', imageUrl: makeIcon('Su', '#fbbf24', '#f97316', 'fusion'), color: '#fbbf24' },
  { name: 'Tundra', imageUrl: makeIcon('Tu', '#60a5fa', '#38bdf8', 'fusion'), color: '#60a5fa' },
  { name: 'Forge', imageUrl: makeIcon('Fo', '#ea580c', '#fb923c', 'fusion'), color: '#ea580c' },
  { name: 'Leech', imageUrl: makeIcon('Le', '#a855f7', '#7c3aed', 'fusion'), color: '#a855f7' },
  { name: 'Prism', imageUrl: makeIcon('Pr', '#a5b4fc', '#6366f1', 'fusion'), color: '#a5b4fc' },
  { name: 'Spikes', imageUrl: makeIcon('Sp', '#22d3ee', '#06b6d4', 'fusion'), color: '#22d3ee' },
  { name: 'Aurora', imageUrl: makeIcon('Au', '#6366f1', '#a855f7', 'fusion'), color: '#6366f1' },
  { name: 'Frostbite', imageUrl: makeIcon('Fr', '#38bdf8', '#0ea5e9', 'fusion'), color: '#38bdf8' },
  { name: 'Gravebound', imageUrl: makeIcon('Gr', '#c084fc', '#a855f7', 'fusion'), color: '#c084fc' },
  { name: 'Storm', imageUrl: makeIcon('St', '#0ea5e9', '#38bdf8', 'fusion'), color: '#0ea5e9' },
  { name: 'Rust', imageUrl: makeIcon('Ru', '#94a3b8', '#cbd5e1', 'fusion'), color: '#94a3b8' },
  { name: 'Echo', imageUrl: makeIcon('Ec', '#93c5fd', '#60a5fa', 'fusion'), color: '#93c5fd' },
  { name: 'Bramble', imageUrl: makeIcon('Br', '#16a34a', '#22c55e', 'fusion'), color: '#16a34a' },
  { name: 'Radiance', imageUrl: makeIcon('Ra', '#fde047', '#facc15', 'fusion'), color: '#fde047' },
  { name: 'Shard', imageUrl: makeIcon('Sh', '#7dd3fc', '#38bdf8', 'fusion'), color: '#7dd3fc' },
  { name: 'Plaguefire', imageUrl: makeIcon('Pl', '#f97316', '#f87171', 'fusion'), color: '#f97316' },
  { name: 'Jetstream', imageUrl: makeIcon('Je', '#5eead4', '#22d3ee', 'fusion'), color: '#5eead4' },
  { name: 'Cyclone', imageUrl: makeIcon('Cy', '#34d399', '#22c55e', 'fusion'), color: '#34d399' },
  { name: 'Crossfire', imageUrl: makeIcon('Cr', '#facc15', '#f59e0b', 'fusion'), color: '#facc15' },
  { name: 'Mirrorwind', imageUrl: makeIcon('MW', '#38bdf8', '#60a5fa', 'fusion'), color: '#38bdf8' },
  { name: 'Radiant Shield', imageUrl: makeIcon('RS', '#fde68a', '#c084fc', 'fusion'), color: '#fde68a' },
  { name: 'Thornstep', imageUrl: makeIcon('TS', '#22c55e', '#f59e0b', 'fusion'), color: '#22c55e' },
  { name: 'Scopebeam', imageUrl: makeIcon('SB', '#22d3ee', '#c084fc', 'fusion'), color: '#22d3ee' }
];

export const MEDIA_BY_NAME = MEDIA_LIST.reduce((acc, media) => {
  acc[media.name] = media;
  return acc;
}, {});

export { MEDIA_LIST };
export default MEDIA_LIST;
