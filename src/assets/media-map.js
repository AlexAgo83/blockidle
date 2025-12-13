const SVG_SIZE = 96;

function makeIcon(name, primary, secondary = null) {
  const p = primary || '#60a5fa';
  const s = secondary || p;
  const safeName = (name || '?').slice(0, 2).toUpperCase();
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_SIZE}" height="${SVG_SIZE}" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="stroke" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${p}"/>
      <stop offset="100%" stop-color="${s}"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
      <stop offset="60%" stop-color="${p}"/>
      <stop offset="100%" stop-color="${s}"/>
    </radialGradient>
  </defs>
  <rect x="6" y="6" width="84" height="84" rx="18" fill="#0b1223" stroke="url(#stroke)" stroke-width="4"/>
  <circle cx="48" cy="48" r="24" fill="url(#core)" />
  <circle cx="48" cy="48" r="30" fill="none" stroke="${p}" stroke-width="3" stroke-opacity="0.6" stroke-dasharray="6 6"/>
  <text x="48" y="53" text-anchor="middle" font-size="22" font-family="Segoe UI, sans-serif" fill="#0b1223" font-weight="700">${safeName}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const MEDIA_LIST = [
  // Powers
  { name: 'Fire', imageUrl: makeIcon('Fi', '#f97316', '#fbbf24'), color: '#f97316' },
  { name: 'Ice', imageUrl: makeIcon('Ic', '#38bdf8', '#0ea5e9'), color: '#38bdf8' },
  { name: 'Poison', imageUrl: makeIcon('Po', '#22c55e', '#16a34a'), color: '#22c55e' },
  { name: 'Metal', imageUrl: makeIcon('Me', '#94a3b8', '#cbd5e1'), color: '#94a3b8' },
  { name: 'Vampire', imageUrl: makeIcon('Va', '#ef4444', '#f87171'), color: '#ef4444' },
  { name: 'Light', imageUrl: makeIcon('Li', '#fef08a', '#fde047'), color: '#fef08a' },
  { name: 'Thorns', imageUrl: makeIcon('Th', '#16a34a', '#84cc16'), color: '#16a34a' },
  { name: 'Curse', imageUrl: makeIcon('Cu', '#a855f7', '#7c3aed'), color: '#a855f7' },
  { name: 'Wind', imageUrl: makeIcon('Wi', '#7dd3fc', '#38bdf8'), color: '#7dd3fc' },
  { name: 'Beamline', imageUrl: makeIcon('Be', '#5eead4', '#22d3ee'), color: '#5eead4' },
  { name: 'Pillar', imageUrl: makeIcon('Pi', '#c084fc', '#a855f7'), color: '#c084fc' },

  // Talents
  { name: 'Boots', imageUrl: makeIcon('Bo', '#cbd5e1', '#94a3b8'), color: '#cbd5e1' },
  { name: 'Feather', imageUrl: makeIcon('Fe', '#7dd3fc', '#38bdf8'), color: '#7dd3fc' },
  { name: 'Gloves', imageUrl: makeIcon('Gl', '#fbbf24', '#f59e0b'), color: '#fbbf24' },
  { name: 'Paddle', imageUrl: makeIcon('Pa', '#f59e0b', '#fb923c'), color: '#f59e0b' },
  { name: 'Mirror', imageUrl: makeIcon('Mi', '#cbd5e1', '#e2e8f0'), color: '#cbd5e1' },
  { name: 'Endurance', imageUrl: makeIcon('En', '#7c3aed', '#a855f7'), color: '#7c3aed' },
  { name: 'Scope', imageUrl: makeIcon('Sc', '#38bdf8', '#0ea5e9'), color: '#38bdf8' },
  { name: 'Momentum', imageUrl: makeIcon('Mo', '#fb923c', '#f97316'), color: '#fb923c' },
  { name: 'Resilience', imageUrl: makeIcon('Re', '#10b981', '#22c55e'), color: '#10b981' },
  { name: 'Surge', imageUrl: makeIcon('Su', '#c084fc', '#a855f7'), color: '#c084fc' },
  { name: 'Anti Gravity', imageUrl: makeIcon('AG', '#38bdf8', '#7dd3fc'), color: '#38bdf8' },
  { name: 'Booster', imageUrl: makeIcon('Bo', '#f97316', '#f59e0b'), color: '#f97316' },

  // Fusions
  { name: 'Sun', imageUrl: makeIcon('Su', '#fbbf24', '#f97316'), color: '#fbbf24' },
  { name: 'Tundra', imageUrl: makeIcon('Tu', '#60a5fa', '#38bdf8'), color: '#60a5fa' },
  { name: 'Forge', imageUrl: makeIcon('Fo', '#ea580c', '#fb923c'), color: '#ea580c' },
  { name: 'Leech', imageUrl: makeIcon('Le', '#a855f7', '#7c3aed'), color: '#a855f7' },
  { name: 'Prism', imageUrl: makeIcon('Pr', '#a5b4fc', '#6366f1'), color: '#a5b4fc' },
  { name: 'Spikes', imageUrl: makeIcon('Sp', '#22d3ee', '#06b6d4'), color: '#22d3ee' },
  { name: 'Aurora', imageUrl: makeIcon('Au', '#6366f1', '#a855f7'), color: '#6366f1' },
  { name: 'Frostbite', imageUrl: makeIcon('Fr', '#38bdf8', '#0ea5e9'), color: '#38bdf8' },
  { name: 'Gravebound', imageUrl: makeIcon('Gr', '#c084fc', '#a855f7'), color: '#c084fc' },
  { name: 'Storm', imageUrl: makeIcon('St', '#0ea5e9', '#38bdf8'), color: '#0ea5e9' },
  { name: 'Rust', imageUrl: makeIcon('Ru', '#94a3b8', '#cbd5e1'), color: '#94a3b8' },
  { name: 'Echo', imageUrl: makeIcon('Ec', '#93c5fd', '#60a5fa'), color: '#93c5fd' },
  { name: 'Bramble', imageUrl: makeIcon('Br', '#16a34a', '#22c55e'), color: '#16a34a' },
  { name: 'Radiance', imageUrl: makeIcon('Ra', '#fde047', '#facc15'), color: '#fde047' },
  { name: 'Shard', imageUrl: makeIcon('Sh', '#7dd3fc', '#38bdf8'), color: '#7dd3fc' },
  { name: 'Plaguefire', imageUrl: makeIcon('Pl', '#f97316', '#f87171'), color: '#f97316' },
  { name: 'Jetstream', imageUrl: makeIcon('Je', '#5eead4', '#22d3ee'), color: '#5eead4' },
  { name: 'Cyclone', imageUrl: makeIcon('Cy', '#34d399', '#22c55e'), color: '#34d399' },
  { name: 'Crossfire', imageUrl: makeIcon('Cr', '#facc15', '#f59e0b'), color: '#facc15' },
  { name: 'Mirrorwind', imageUrl: makeIcon('MW', '#38bdf8', '#60a5fa'), color: '#38bdf8' },
  { name: 'Radiant Shield', imageUrl: makeIcon('RS', '#fde68a', '#c084fc'), color: '#fde68a' },
  { name: 'Thornstep', imageUrl: makeIcon('TS', '#22c55e', '#f59e0b'), color: '#22c55e' },
  { name: 'Scopebeam', imageUrl: makeIcon('SB', '#22d3ee', '#c084fc'), color: '#22d3ee' }
];

export const MEDIA_BY_NAME = MEDIA_LIST.reduce((acc, media) => {
  acc[media.name] = media;
  return acc;
}, {});

export { MEDIA_LIST };
export default MEDIA_LIST;
