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
  <circle cx="48" cy="48" r="30" fill="none" stroke="${p}" stroke-width="3" stroke-opacity="0.6" stroke-dasharray="${type === 'power' ? '0 999' : '6 6'}"/>
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
      '<g><path d="M48 30 C53 37 55 43 53 47 C51 51 47 53 45 57 C43 61 45 65 48 67 C53 64 58 60 59 55 C61 48 57 40 52 34 C50 31 49 30 48 30 Z" fill="url(#flame-FI-power)" stroke="rgba(0,0,0,0.45)" stroke-width="1.8"/><path d="M48 36 C50 40 51 44 50 46 C49 48 47 49 46 52 C45 54 46 56 48 57 C50 56 52 54 53 52 C54 48 52 44 50 40 C49 38 49 36 48 36 Z" fill="rgba(255,255,255,0.7)"/></g>',
      '<radialGradient id="flame-FI-power" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff4e6"/><stop offset="40%" stop-color="#ffb703"/><stop offset="75%" stop-color="#f97316"/><stop offset="100%" stop-color="#b91c1c"/></radialGradient>'
    ),
    color: '#f97316'
  },
  {
    name: 'Ice',
    imageUrl: makeIcon(
      'Ic',
      '#38bdf8',
      '#0ea5e9',
      'power',
      '<g stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"><line x1="48" y1="26" x2="48" y2="66"/><line x1="34" y1="34" x2="62" y2="58"/><line x1="62" y1="34" x2="34" y2="58"/></g><circle cx="48" cy="44" r="8" fill="url(#ice-Ic-power)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>',
      '<radialGradient id="ice-Ic-power" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="60%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0ea5e9"/></radialGradient>'
    ),
    color: '#38bdf8'
  },
  {
    name: 'Poison',
    imageUrl: makeIcon(
      'Po',
      '#22c55e',
      '#16a34a',
      'power',
      '<g><path d="M40 28 H56 V44 C56 51 52 56 48 64 C44 56 40 51 40 44 Z" fill="url(#poison-Po-power)" stroke="rgba(0,0,0,0.25)" stroke-width="1.6"/><circle cx="44" cy="46" r="2.5" fill="#dcfce7"/><circle cx="52" cy="50" r="3" fill="#dcfce7"/><circle cx="48" cy="56" r="2.2" fill="#bbf7d0"/></g>',
      '<radialGradient id="poison-Po-power" cx="50%" cy="35%" r="70%"><stop offset="0%" stop-color="#befae3"/><stop offset="55%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/></radialGradient>'
    ),
    color: '#22c55e'
  },
  {
    name: 'Metal',
    imageUrl: makeIcon(
      'Me',
      '#94a3b8',
      '#cbd5e1',
      'power',
      '<g fill="url(#metal-Me-power)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"><circle cx="48" cy="44" r="12"/><circle cx="48" cy="44" r="6" fill="#0b1223"/><g stroke-width="2" stroke="#cbd5e1" stroke-linecap="round"><line x1="48" y1="28" x2="48" y2="32"/><line x1="48" y1="60" x2="48" y2="64"/><line x1="36" y1="44" x2="32" y2="44"/><line x1="64" y1="44" x2="60" y2="44"/><line x1="38" y1="34" x2="35" y2="31"/><line x1="58" y1="61" x2="55" y2="58"/><line x1="38" y1="58" x2="35" y2="61"/><line x1="58" y1="31" x2="55" y2="34"/></g></g>',
      '<radialGradient id="metal-Me-power" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#e5e7eb"/><stop offset="60%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></radialGradient>'
    ),
    color: '#94a3b8'
  },
  {
    name: 'Vampire',
    imageUrl: makeIcon(
      'Va',
      '#ef4444',
      '#f87171',
      'power',
      '<g><path d="M36 36 C36 28 42 24 48 24 C54 24 60 28 60 36 C60 42 56 48 48 56 C40 48 36 42 36 36 Z" fill="url(#vampire-Va-power)" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/><path d="M44 44 L46 52 L42 52 Z" fill="#0b1223"/><path d="M52 44 L54 52 L50 52 Z" fill="#0b1223"/></g>',
      '<radialGradient id="vampire-Va-power" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#fecdd3"/><stop offset="55%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></radialGradient>'
    ),
    color: '#ef4444'
  },
  {
    name: 'Light',
    imageUrl: makeIcon(
      'Li',
      '#fef08a',
      '#fde047',
      'power',
      '<g stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round"><circle cx="48" cy="44" r="10" fill="url(#light-Li-power)" stroke="rgba(255,255,255,0.65)" stroke-width="2.4"/><g><line x1="48" y1="26" x2="48" y2="18"/><line x1="48" y1="62" x2="48" y2="70"/><line x1="32" y1="44" x2="24" y2="44"/><line x1="72" y1="44" x2="64" y2="44"/><line x1="34" y1="30" x2="28" y2="24"/><line x1="62" y1="58" x2="68" y2="64"/><line x1="34" y1="58" x2="28" y2="64"/><line x1="62" y1="30" x2="68" y2="24"/></g></g>',
      '<radialGradient id="light-Li-power" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#fff9c2"/><stop offset="60%" stop-color="#fde047"/><stop offset="100%" stop-color="#f59e0b"/></radialGradient>'
    ),
    color: '#fef08a'
  },
  {
    name: 'Thorns',
    imageUrl: makeIcon(
      'Th',
      '#16a34a',
      '#84cc16',
      'power',
      '<g><circle cx="48" cy="44" r="16" fill="url(#thorns-Th-power)" stroke="rgba(0,0,0,0.35)" stroke-width="1.4"/><g stroke="#0b1223" stroke-width="1.8" stroke-linecap="round"><path d="M48 28 L51 36 L45 36 Z"/><path d="M48 60 L51 52 L45 52 Z"/><path d="M30 44 L38 47 L38 41 Z"/><path d="M66 44 L58 47 L58 41 Z"/><path d="M36 34 L42 38 L38 42 Z"/><path d="M60 34 L54 38 L58 42 Z"/><path d="M36 54 L42 50 L38 46 Z"/><path d="M60 54 L54 50 L58 46 Z"/></g></g>',
      '<radialGradient id="thorns-Th-power" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#bbf7d0"/><stop offset="55%" stop-color="#22c55e"/><stop offset="100%" stop-color="#166534"/></radialGradient>'
    ),
    color: '#16a34a'
  },
  {
    name: 'Curse',
    imageUrl: makeIcon(
      'Cu',
      '#a855f7',
      '#7c3aed',
      'power',
      '<g><circle cx="48" cy="44" r="14" fill="url(#curse-Cu-power)" stroke="rgba(0,0,0,0.35)" stroke-width="1.4"/><path d="M43 40 C44 38 46 37 48 37 C50 37 52 38 53 40" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/><circle cx="44" cy="44" r="1.8" fill="#0b1223"/><circle cx="52" cy="44" r="1.8" fill="#0b1223"/><path d="M42 50 C44 53 46 54 48 54 C50 54 52 53 54 50" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/></g>',
      '<radialGradient id="curse-Cu-power" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#ede9fe"/><stop offset="55%" stop-color="#a855f7"/><stop offset="100%" stop-color="#5b21b6"/></radialGradient>'
    ),
    color: '#a855f7'
  },
  {
    name: 'Wind',
    imageUrl: makeIcon(
      'Wi',
      '#7dd3fc',
      '#38bdf8',
      'power',
      '<g stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" fill="none"><path d="M30 40 C42 36 54 38 66 34"/><path d="M32 48 C44 44 52 46 62 42"/><path d="M36 56 C48 52 56 54 64 50"/></g><circle cx="48" cy="44" r="6" fill="rgba(255,255,255,0.3)" />',
      ''
    ),
    color: '#7dd3fc'
  },
  {
    name: 'Crusher',
    imageUrl: makeIcon(
      'Cr',
      '#f59e0b',
      '#fbbf24',
      'power',
      '<g><rect x="32" y="30" width="32" height="36" rx="8" fill="url(#crusher-Cr-power)" stroke="rgba(0,0,0,0.25)" stroke-width="1.8"/><path d="M36 48 H60" stroke="#0b1223" stroke-width="3" stroke-linecap="round"/><path d="M42 38 H54" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/><path d=\"M42 58 H54\" stroke=\"#0b1223\" stroke-width=\"2.2\" stroke-linecap=\"round\"/></g>',
      '<linearGradient id="crusher-Cr-power" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#f59e0b'
  },
  {
    name: 'Beamline',
    imageUrl: makeIcon(
      'Be',
      '#5eead4',
      '#22d3ee',
      'power',
      '<g fill="none"><rect x="26" y="40" width="44" height="8" rx="4" fill="url(#beam-Be-power)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><circle cx="48" cy="44" r="4" fill="#0b1223"/></g>',
      '<linearGradient id="beam-Be-power" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#5eead4"/><stop offset="100%" stop-color="#22d3ee"/></linearGradient>'
    ),
    color: '#5eead4'
  },
  {
    name: 'Pillar',
    imageUrl: makeIcon(
      'Pi',
      '#c084fc',
      '#a855f7',
      'power',
      '<g fill="none"><rect x="44" y="30" width="8" height="32" rx="4" fill="url(#pillar-Pi-power)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><circle cx="48" cy="46" r="4" fill="#0b1223"/></g>',
      '<linearGradient id="pillar-Pi-power" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>'
    ),
    color: '#c084fc'
  },

  // Talents
  {
    name: 'Boots',
    imageUrl: makeIcon(
      'Bo',
      '#cbd5e1',
      '#94a3b8',
      'talent',
      '<g fill="url(#boot-Bo-talent)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"><path d="M36 36 H56 V50 C56 56 52 60 46 60 H36 Z" /><rect x="34" y="50" width="26" height="6" rx="2" fill="#0b1223"/></g>',
      '<linearGradient id="boot-Bo-talent" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>'
    ),
    color: '#cbd5e1'
  },
  {
    name: 'Feather',
    imageUrl: makeIcon(
      'Fe',
      '#7dd3fc',
      '#38bdf8',
      'talent',
      '<g transform="translate(0,-2)"><path d="M36 50 C44 32 60 30 60 42 C60 52 48 60 40 60 Z" fill="url(#feather-Fe-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M44 50 L54 40" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/></g>',
      '<linearGradient id="feather-Fe-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>'
    ),
    color: '#7dd3fc'
  },
  {
    name: 'Gloves',
    imageUrl: makeIcon(
      'Gl',
      '#fbbf24',
      '#f59e0b',
      'talent',
      '<g><path d="M40 34 L44 32 L46 38 L48 32 L52 34 L50 44 L54 42 L56 48 L46 54 L40 48 Z" fill="url(#glove-Gl-talent)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><circle cx="44" cy="46" r="2" fill="#0b1223"/><circle cx="50" cy="48" r="2" fill="#0b1223"/></g>',
      '<linearGradient id="glove-Gl-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#fbbf24'
  },
  {
    name: 'Paddle',
    imageUrl: makeIcon(
      'Pa',
      '#f59e0b',
      '#fb923c',
      'talent',
      '<g><rect x="30" y="40" width="36" height="8" rx="4" fill="url(#paddle-Pa-talent)" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/><rect x="42" y="32" width="12" height="6" rx="3" fill="#fef3c7"/></g>',
      '<linearGradient id="paddle-Pa-talent" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#f59e0b'
  },
  {
    name: 'Mirror',
    imageUrl: makeIcon(
      'Mi',
      '#cbd5e1',
      '#e2e8f0',
      'talent',
      '<g><rect x="32" y="32" width="14" height="24" rx="4" fill="url(#mirror-Mi-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><rect x="50" y="32" width="14" height="24" rx="4" fill="url(#mirror-Mi-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/></g>',
      '<linearGradient id="mirror-Mi-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>'
    ),
    color: '#cbd5e1'
  },
  {
    name: 'Stim Pack',
    imageUrl: makeIcon(
      'St',
      '#7c3aed',
      '#a855f7',
      'talent',
      '<g><path d="M38 40 C38 34 44 32 48 36 C52 32 58 34 58 40 C58 46 52 52 48 58 C44 52 38 46 38 40 Z" fill="url(#heart-St-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/></g>',
      '<radialGradient id="heart-St-talent" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#ede9fe"/><stop offset="55%" stop-color="#c084fc"/><stop offset="100%" stop-color="#6b21a8"/></radialGradient>'
    ),
    color: '#7c3aed'
  },
  {
    name: 'Scope',
    imageUrl: makeIcon(
      'Sc',
      '#38bdf8',
      '#0ea5e9',
      'talent',
      '<g stroke="#e0f2fe" stroke-width="2" stroke-linecap="round" fill="none"><circle cx="48" cy="44" r="10" fill="rgba(14,165,233,0.25)"/><line x1="48" y1="30" x2="48" y2="26"/><line x1="48" y1="62" x2="48" y2="66"/><line x1="34" y1="44" x2="30" y2="44"/><line x1="62" y1="44" x2="66" y2="44"/><circle cx="48" cy="44" r="4" fill="#0b1223"/></g>',
      ''
    ),
    color: '#38bdf8'
  },
  {
    name: 'Momentum',
    imageUrl: makeIcon(
      'Mo',
      '#fb923c',
      '#f97316',
      'talent',
      '<g stroke="rgba(0,0,0,0.25)" stroke-width="1.2" fill="url(#momentum-Mo-talent)"><path d="M34 46 L52 38 L48 46 L62 38 L46 56 L50 48 Z"/></g>',
      '<linearGradient id="momentum-Mo-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fed7aa"/><stop offset="100%" stop-color="#fb923c"/></linearGradient>'
    ),
    color: '#fb923c'
  },
  {
    name: 'Resilience',
    imageUrl: makeIcon(
      'Re',
      '#10b981',
      '#22c55e',
      'talent',
      '<g><path d="M36 34 L60 34 L60 46 C60 54 54 62 48 66 C42 62 36 54 36 46 Z" fill="url(#shield-Re-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M44 40 H52 V52 H44 Z" fill="#ecfdf3"/></g>',
      '<linearGradient id="shield-Re-talent" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#0f766e"/></linearGradient>'
    ),
    color: '#10b981'
  },
  {
    name: 'Surge',
    imageUrl: makeIcon(
      'Su',
      '#c084fc',
      '#a855f7',
      'talent',
      '<g><path d="M44 32 L56 42 L50 42 L54 56 L42 46 L48 46 Z" fill="url(#surge-Su-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/></g>',
      '<linearGradient id="surge-Su-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f5d0fe"/><stop offset="100%" stop-color="#a855f7"/></linearGradient>'
    ),
    color: '#c084fc'
  },
  {
    name: 'Gravity',
    imageUrl: makeIcon(
      'Gr',
      '#38bdf8',
      '#7dd3fc',
      'talent',
      '<g><circle cx="48" cy="48" r="12" fill="url(#gravity-Gr-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><path d="M48 34 L54 42 H50 V58 H46 V42 H42 Z" fill="#ecfeff"/></g>',
      '<radialGradient id="gravity-Gr-talent" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="60%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/></radialGradient>'
    ),
    color: '#38bdf8'
  },
  {
    name: 'Crown',
    imageUrl: makeIcon(
      'Cr',
      '#facc15',
      '#fbbf24',
      'talent',
      '<g><path d="M30 56 H66 V60 H30 Z" fill="#facc15" stroke="rgba(0,0,0,0.2)" stroke-width="1.4"/><path d="M30 56 L36 36 L48 50 L60 36 L66 56 Z" fill="url(#crown-Cr-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.6"/><circle cx="36" cy="36" r="3" fill="#fde68a"/><circle cx="60" cy="36" r="3" fill="#fde68a"/><circle cx="48" cy="44" r="3" fill="#fde68a"/></g>',
      '<linearGradient id="crown-Cr-talent" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#facc15'
  },
  {
    name: 'Booster',
    imageUrl: makeIcon(
      'Bo',
      '#f97316',
      '#f59e0b',
      'talent',
      '<g><circle cx="48" cy="44" r="14" fill="url(#booster-Bo-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M48 32 L52 44 L48 56 L44 44 Z" fill="#0b1223" opacity="0.45"/><circle cx="48" cy="44" r="4" fill="#fff7ed"/></g>',
      '<radialGradient id="booster-Bo-talent" cx="50%" cy="45%" r="65%"><stop offset="0%" stop-color="#fed7aa"/><stop offset="60%" stop-color="#fb923c"/><stop offset="100%" stop-color="#ea580c"/></radialGradient>'
    ),
    color: '#f97316'
  },
  {
    name: 'Twin Core',
    imageUrl: makeIcon(
      'TC',
      '#a855f7',
      '#ec4899',
      'talent',
      '<g><circle cx="40" cy="46" r="9" fill="url(#tc-left-TC-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><circle cx="56" cy="50" r="9" fill="url(#tc-right-TC-talent)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><path d="M38 58 Q48 62 58 56" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/><path d="M44 38 Q48 34 52 38" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round"/><path d="M48 44 L48 52" stroke="#0b1223" stroke-width="2" stroke-linecap="round"/><path d="M44 48 H52" stroke="#0b1223" stroke-width="2" stroke-linecap="round"/></g>',
      '<radialGradient id="tc-left-TC-talent" cx="50%" cy="45%" r="65%"><stop offset="0%" stop-color="#f5d0fe"/><stop offset="60%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6b21a8"/></radialGradient><radialGradient id="tc-right-TC-talent" cx="45%" cy="50%" r="65%"><stop offset="0%" stop-color="#fce7f3"/><stop offset="60%" stop-color="#ec4899"/><stop offset="100%" stop-color="#9d174d"/></radialGradient>'
    ),
    color: '#a855f7'
  },

  // Fusions
  {
    name: 'Sun',
    imageUrl: makeIcon(
      'Su',
      '#fbbf24',
      '#f97316',
      'fusion',
      '<g><circle cx="48" cy="44" r="14" fill="url(#sun-Su-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><g stroke="#fef9c3" stroke-width="2.4" stroke-linecap="round"><line x1="48" y1="24" x2="48" y2="18"/><line x1="48" y1="64" x2="48" y2="70"/><line x1="28" y1="44" x2="22" y2="44"/><line x1="68" y1="44" x2="74" y2="44"/><line x1="32" y1="30" x2="26" y2="24"/><line x1="64" y1="58" x2="70" y2="64"/><line x1="32" y1="58" x2="26" y2="64"/><line x1="64" y1="30" x2="70" y2="24"/></g></g>',
      '<radialGradient id="sun-Su-fusion" cx="50%" cy="45%" r="65%"><stop offset="0%" stop-color="#fff3c4"/><stop offset="60%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></radialGradient>'
    ),
    color: '#fbbf24'
  },
  {
    name: 'Tundra',
    imageUrl: makeIcon(
      'Tu',
      '#60a5fa',
      '#38bdf8',
      'fusion',
      '<g><path d="M36 44 C38 34 44 32 48 36 C52 32 58 34 60 44 C60 52 54 60 48 64 C42 60 36 52 36 44 Z" fill="url(#tundra-Tu-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><path d="M44 44 L52 44" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/><path d="M48 40 L48 48" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/></g>',
      '<linearGradient id="tundra-Tu-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>'
    ),
    color: '#60a5fa'
  },
  {
    name: 'Forge',
    imageUrl: makeIcon(
      'Fo',
      '#ea580c',
      '#fb923c',
      'fusion',
      '<g><rect x="38" y="32" width="12" height="18" rx="2" fill="url(#forge-Fo-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><rect x="30" y="42" width="36" height="8" rx="2" fill="#0b1223" opacity="0.4"/><rect x="42" y="52" width="12" height="10" rx="2" fill="#fcd34d" stroke="rgba(0,0,0,0.25)" stroke-width="1"/></g>',
      '<linearGradient id="forge-Fo-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>'
    ),
    color: '#ea580c'
  },
  {
    name: 'Leech',
    imageUrl: makeIcon(
      'Le',
      '#a855f7',
      '#7c3aed',
      'fusion',
      '<g><path d="M40 36 C40 30 44 28 48 28 C52 28 56 30 56 36 C56 42 52 50 48 58 C44 50 40 42 40 36 Z" fill="url(#leech-Le-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><path d="M44 44 L46 52 L42 52 Z" fill="#0b1223"/><path d="M52 44 L54 52 L50 52 Z" fill="#0b1223"/></g>',
      '<radialGradient id="leech-Le-fusion" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#ede9fe"/><stop offset="55%" stop-color="#a855f7"/><stop offset="100%" stop-color="#5b21b6"/></radialGradient>'
    ),
    color: '#a855f7'
  },
  {
    name: 'Prism',
    imageUrl: makeIcon(
      'Pr',
      '#a5b4fc',
      '#6366f1',
      'fusion',
      '<g><path d="M32 56 L48 30 L64 56 Z" fill="url(#prism-Pr-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M48 42 L48 52" stroke="#0b1223" stroke-width="2" stroke-linecap="round"/><path d="M40 50 L56 50" stroke="#0b1223" stroke-width="2" stroke-linecap="round"/></g>',
      '<linearGradient id="prism-Pr-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c7d2fe"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>'
    ),
    color: '#a5b4fc'
  },
  {
    name: 'Spikes',
    imageUrl: makeIcon(
      'Sp',
      '#22d3ee',
      '#06b6d4',
      'fusion',
      '<g><circle cx="48" cy="44" r="16" fill="url(#spikes-Sp-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><g stroke="#0b1223" stroke-width="2" stroke-linecap="round"><path d="M48 26 L52 34 L44 34 Z"/><path d="M48 62 L52 54 L44 54 Z"/><path d="M30 44 L38 48 L38 40 Z"/><path d="M66 44 L58 48 L58 40 Z"/></g></g>',
      '<radialGradient id="spikes-Sp-fusion" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#ccfbf1"/><stop offset="55%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#0e7490"/></radialGradient>'
    ),
    color: '#22d3ee'
  },
  {
    name: 'Aurora',
    imageUrl: makeIcon(
      'Au',
      '#6366f1',
      '#a855f7',
      'fusion',
      '<g><path d="M32 50 C40 42 56 42 64 50" stroke="url(#aurora-Au-fusion)" stroke-width="4" fill="none"/><path d="M32 44 C40 36 56 36 64 44" stroke="url(#aurora-Au-fusion)" stroke-width="3" fill="none" opacity="0.7"/></g>',
      '<linearGradient id="aurora-Au-fusion" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>'
    ),
    color: '#6366f1'
  },
  {
    name: 'Frostbite',
    imageUrl: makeIcon(
      'Fr',
      '#38bdf8',
      '#0ea5e9',
      'fusion',
      '<g stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"><path d="M48 26 L48 62"/><path d="M34 34 L62 54"/><path d="M62 34 L34 54"/><circle cx="48" cy="44" r="10" fill="url(#frost-Fr-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/></g>',
      '<radialGradient id="frost-Fr-fusion" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="55%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/></radialGradient>'
    ),
    color: '#38bdf8'
  },
  {
    name: 'Gravebound',
    imageUrl: makeIcon(
      'Gr',
      '#c084fc',
      '#a855f7',
      'fusion',
      '<g><rect x="36" y="32" width="24" height="28" rx="4" fill="url(#grave-Gr-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><rect x="42" y="38" width="12" height="10" rx="2" fill="#0b1223" opacity="0.6"/><rect x="44" y="50" width="8" height="6" rx="1.5" fill="#e0e7ff"/></g>',
      '<linearGradient id="grave-Gr-fusion" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e9d5ff"/><stop offset="100%" stop-color="#a855f7"/></linearGradient>'
    ),
    color: '#c084fc'
  },
  {
    name: 'Storm',
    imageUrl: makeIcon(
      'St',
      '#0ea5e9',
      '#38bdf8',
      'fusion',
      '<g><path d="M44 30 L56 40 L50 40 L54 56 L42 46 L48 46 Z" fill="url(#storm-St-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M34 44 C40 40 56 40 62 44" stroke="#e0f2fe" stroke-width="2.4" stroke-linecap="round"/></g>',
      '<linearGradient id="storm-St-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>'
    ),
    color: '#0ea5e9'
  },
  {
    name: 'Rust',
    imageUrl: makeIcon(
      'Ru',
      '#94a3b8',
      '#cbd5e1',
      'fusion',
      '<g><circle cx="48" cy="44" r="14" fill="url(#rust-Ru-fusion)" stroke="rgba(0,0,0,0.35)" stroke-width="1.4"/><circle cx="48" cy="44" r="6" fill="#0b1223"/><path d="M40 36 L44 40" stroke="#f8fafc" stroke-width="1.6"/><path d="M52 50 L56 54" stroke="#f8fafc" stroke-width="1.6"/></g>',
      '<linearGradient id="rust-Ru-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="60%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></linearGradient>'
    ),
    color: '#94a3b8'
  },
  {
    name: 'Echo',
    imageUrl: makeIcon(
      'Ec',
      '#93c5fd',
      '#60a5fa',
      'fusion',
      '<g stroke="#e0e7ff" stroke-width="2" fill="none"><circle cx="48" cy="44" r="6" fill="#0b1223"/><circle cx="48" cy="44" r="12"/><circle cx="48" cy="44" r="18" opacity="0.6"/></g>',
      ''
    ),
    color: '#93c5fd'
  },
  {
    name: 'Bramble',
    imageUrl: makeIcon(
      'Br',
      '#16a34a',
      '#22c55e',
      'fusion',
      '<g><circle cx="48" cy="44" r="16" fill="url(#bramble-Br-fusion)" stroke="rgba(0,0,0,0.35)" stroke-width="1.4"/><path d="M36 46 C44 38 52 50 60 42" stroke="#0b1223" stroke-width="2.4" stroke-linecap="round"/><path d="M38 40 L42 44 L38 48 Z" fill="#0b1223"/><path d="M56 36 L60 40 L56 44 Z" fill="#0b1223"/></g>',
      '<radialGradient id="bramble-Br-fusion" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#bbf7d0"/><stop offset="55%" stop-color="#22c55e"/><stop offset="100%" stop-color="#166534"/></radialGradient>'
    ),
    color: '#16a34a'
  },
  {
    name: 'Radiance',
    imageUrl: makeIcon(
      'Ra',
      '#fde047',
      '#facc15',
      'fusion',
      '<g><circle cx="48" cy="44" r="12" fill="url(#radiance-Ra-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M44 40 L52 48 M52 40 L44 48" stroke="#0b1223" stroke-width="2.2" stroke-linecap="round"/><g stroke="#fef3c7" stroke-width="2" stroke-linecap="round"><line x1="48" y1="26" x2="48" y2="18"/><line x1="48" y1="62" x2="48" y2="70"/></g></g>',
      '<radialGradient id="radiance-Ra-fusion" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#fff9c2"/><stop offset="60%" stop-color="#fde047"/><stop offset="100%" stop-color="#d97706"/></radialGradient>'
    ),
    color: '#fde047'
  },
  {
    name: 'Shard',
    imageUrl: makeIcon(
      'Sh',
      '#7dd3fc',
      '#38bdf8',
      'fusion',
      '<g fill="url(#shard-Sh-fusion)" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"><path d="M40 56 L46 34 L52 42 L48 56 Z"/><path d="M54 56 L60 36 L64 46 L60 56 Z"/></g>',
      '<linearGradient id="shard-Sh-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>'
    ),
    color: '#7dd3fc'
  },
  {
    name: 'Plaguefire',
    imageUrl: makeIcon(
      'Pl',
      '#f97316',
      '#f87171',
      'fusion',
      '<g><path d="M44 30 C50 36 54 42 52 48 C50 52 46 54 44 58 C42 62 44 66 48 68 C54 64 60 58 60 50 C60 42 54 34 50 30 Z" fill="url(#plague-Pl-fusion)" stroke="rgba(0,0,0,0.35)" stroke-width="1.6"/><path d="M48 38 C50 42 51 46 50 48 C49 50 47 51 46 54 C45 56 46 58 48 59 C50 58 52 56 53 54 C54 50 52 46 50 42 C49 40 49 38 48 38 Z" fill="rgba(0,0,0,0.25)"/></g>',
      '<radialGradient id="plague-Pl-fusion" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#fff4e6"/><stop offset="50%" stop-color="#fb923c"/><stop offset="100%" stop-color="#dc2626"/></radialGradient>'
    ),
    color: '#f97316'
  },
  {
    name: 'Jetstream',
    imageUrl: makeIcon(
      'Je',
      '#5eead4',
      '#22d3ee',
      'fusion',
      '<g stroke="#ecfeff" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M30 46 C42 42 54 44 66 40"/><path d="M32 52 C44 48 52 50 62 46"/><path d="M36 58 C48 54 56 56 64 52"/><path d="M50 34 L62 32 L56 40 Z" fill="#0b1223" stroke="none"/></g>',
      ''
    ),
    color: '#5eead4'
  },
  {
    name: 'Cyclone',
    imageUrl: makeIcon(
      'Cy',
      '#34d399',
      '#22c55e',
      'fusion',
      '<g stroke="rgba(255,255,255,0.7)" stroke-width="2.4" fill="none"><path d="M32 40 C44 36 58 38 64 46" /><path d="M34 48 C46 44 56 46 62 54" /></g><circle cx="48" cy="44" r="8" fill="rgba(255,255,255,0.25)" />',
      ''
    ),
    color: '#34d399'
  },
  {
    name: 'Crossfire',
    imageUrl: makeIcon(
      'Cr',
      '#facc15',
      '#f59e0b',
      'fusion',
      '<g><rect x="28" y="40" width="40" height="8" rx="3" fill="url(#cross-Cr-fusion)" /><rect x="44" y="28" width="8" height="40" rx="3" fill="url(#cross-Cr-fusion)"/><circle cx="48" cy="44" r="6" fill="#0b1223" opacity="0.6"/></g>',
      '<linearGradient id="cross-Cr-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#facc15'
  },
  {
    name: 'Mirrorwind',
    imageUrl: makeIcon(
      'MW',
      '#38bdf8',
      '#60a5fa',
      'fusion',
      '<g stroke="#e0f2fe" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M30 40 C42 36 54 38 66 34"/><path d="M32 48 C44 44 52 46 62 42"/></g><rect x="34" y="46" width="12" height="10" rx="3" fill="url(#mirror-MW-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><rect x="50" y="46" width="12" height="10" rx="3" fill="url(#mirror-MW-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/>',
      '<linearGradient id="mirror-MW-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient>'
    ),
    color: '#38bdf8'
  },
  {
    name: 'Gale',
    imageUrl: makeIcon(
      'Ga',
      '#38bdf8',
      '#fbbf24',
      'fusion',
      '<g><path d="M30 50 H66" stroke="rgba(255,255,255,0.85)" stroke-width="3" stroke-linecap="round"/><path d="M30 42 H66" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round"/><rect x="40" y="32" width="16" height="32" rx="6" fill="url(#ga-Ga-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.6"/></g>',
      '<linearGradient id="ga-Ga-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>'
    ),
    color: '#38bdf8'
  },
  {
    name: 'Radiant',
    imageUrl: makeIcon(
      'Ra',
      '#fde68a',
      '#c084fc',
      'fusion',
      '<g><path d="M36 34 L60 34 L60 48 C60 54 54 62 48 66 C42 62 36 54 36 48 Z" fill="url(#ra-Ra-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><circle cx="48" cy="46" r="6" fill="#fef9c3" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/></g>',
      '<linearGradient id="ra-Ra-fusion" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>'
    ),
    color: '#fde68a'
  },
  {
    name: 'Photon',
    imageUrl: makeIcon(
      'Ph',
      '#facc15',
      '#f472b6',
      'fusion',
      '<g><circle cx="48" cy="44" r="12" fill="url(#ph-Ph-fusion)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round"><line x1="32" y1="44" x2="64" y2="44"/><line x1="48" y1="28" x2="48" y2="60"/></g><circle cx="48" cy="44" r="5" fill="#0b1223" opacity="0.55"/></g>',
      '<linearGradient id="ph-Ph-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f472b6"/></linearGradient>'
    ),
    color: '#facc15'
  },
  {
    name: 'Pestilence',
    imageUrl: makeIcon(
      'Pe',
      '#22c55e',
      '#a855f7',
      'fusion',
      '<g><circle cx="48" cy="44" r="14" fill="url(#pe-Pe-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.4"/><path d="M42 42 Q48 36 54 42 Q48 48 42 42 Z" fill="rgba(255,255,255,0.75)" opacity="0.8"/><path d="M44 48 Q48 44 52 48 Q48 52 44 48 Z" fill="#0b1223" opacity="0.5"/></g>',
      '<linearGradient id="pe-Pe-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#bbf7d0"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#a855f7"/></linearGradient>'
    ),
    color: '#22c55e'
  },
  {
    name: 'Thornstep',
    imageUrl: makeIcon(
      'TS',
      '#22c55e',
      '#f59e0b',
      'fusion',
      '<g><rect x="32" y="46" width="32" height="8" rx="3" fill="url(#ts-TS-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><g stroke="#0b1223" stroke-width="2" stroke-linecap="round"><path d="M36 44 L38 40 L40 44"/><path d="M46 44 L48 40 L50 44"/><path d="M56 44 L58 40 L60 44"/></g></g>',
      '<linearGradient id="ts-TS-fusion" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>'
    ),
    color: '#22c55e'
  },
  {
    name: 'Scopebeam',
    imageUrl: makeIcon(
      'SB',
      '#22d3ee',
      '#c084fc',
      'fusion',
      '<g><rect x="28" y="40" width="40" height="8" rx="3" fill="url(#sb-SB-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><rect x="44" y="28" width="8" height="32" rx="3" fill="url(#sb-SB-fusion)" stroke="rgba(0,0,0,0.25)" stroke-width="1.2"/><circle cx="48" cy="44" r="5" fill="#0b1223"/></g>',
      '<linearGradient id="sb-SB-fusion" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>'
    ),
    color: '#22d3ee'
  }
];

export const MEDIA_BY_NAME = MEDIA_LIST.reduce((acc, media) => {
  acc[media.name] = media;
  return acc;
}, {});

export { MEDIA_LIST };
export default MEDIA_LIST;
