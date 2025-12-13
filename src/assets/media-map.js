import powerFire from './power-fire.png';
import powerIce from './power-ice.png';
import powerPoison from './power-poison.png';
import powerMetal from './power-metal.png';
import powerVampire from './power-vampire.png';
import powerLight from './power-light.png';
import powerThorns from './power-thorns.png';
import powerCurse from './power-curse.png';
import powerWind from './power-wind.png';
import powerBeamline from './power-beamline.png';
import powerPillar from './power-pillar.png';

import talentBoots from './talent-boots.png';
import talentFeather from './talent-feather.png';
import talentGloves from './talent-gloves.png';
import talentPaddle from './talent-paddle.png';
import talentMirror from './talent-mirror.png';
import talentEndurance from './talent-endurance.png';
import talentScope from './talent-scope.png';
import talentMomentum from './talent-momentum.png';
import talentResilience from './talent-resilience.png';
import talentSurge from './talent-surge.png';
import talentAntiGravity from './talent-anti-gravity.svg';
import talentBooster from './talent-booster.svg';

import fusionSun from './fusion-sun.png';
import fusionTundra from './fusion-tundra.png';
import fusionForge from './fusion-forge.png';
import fusionLeech from './fusion-leech.png';
import fusionPrism from './fusion-prism.png';
import fusionSpikes from './fusion-spikes.png';
import fusionAurora from './fusion-aurora.png';
import fusionFrostbite from './fusion-frostbite.png';
import fusionGravebound from './fusion-gravebound.png';
import fusionStorm from './fusion-storm.png';
import fusionRust from './fusion-rust.png';
import fusionEcho from './fusion-echo.png';
import fusionBramble from './fusion-bramble.png';
import fusionRadiance from './fusion-radiance.png';
import fusionShard from './fusion-shard.png';
import fusionPlaguefire from './fusion-plaguefire.png';
import fusionJetstream from './fusion-jetstream.png';
import fusionCyclone from './fusion-cyclone.png';
import fusionCrossfire from './fusion-crossfire.png';

const MEDIA_LIST = [
  { name: 'Fire', imageUrl: powerFire, color: '#f97316' },
  { name: 'Ice', imageUrl: powerIce, color: '#38bdf8' },
  { name: 'Poison', imageUrl: powerPoison, color: '#22c55e' },
  { name: 'Metal', imageUrl: powerMetal, color: '#94a3b8' },
  { name: 'Vampire', imageUrl: powerVampire, color: '#ef4444' },
  { name: 'Light', imageUrl: powerLight, color: '#fef08a' },
  { name: 'Thorns', imageUrl: powerThorns, color: '#16a34a' },
  { name: 'Curse', imageUrl: powerCurse, color: '#a855f7' },
  { name: 'Wind', imageUrl: powerWind, color: '#7dd3fc' },
  { name: 'Beamline', imageUrl: powerBeamline, color: '#5eead4' },
  { name: 'Pillar', imageUrl: powerPillar, color: '#c084fc' },

  { name: 'Boots', imageUrl: talentBoots, color: '#cbd5e1' },
  { name: 'Feather', imageUrl: talentFeather, color: '#7dd3fc' },
  { name: 'Gloves', imageUrl: talentGloves, color: '#fbbf24' },
  { name: 'Paddle', imageUrl: talentPaddle, color: '#f59e0b' },
  { name: 'Mirror', imageUrl: talentMirror, color: '#cbd5e1' },
  { name: 'Endurance', imageUrl: talentEndurance, color: '#7c3aed' },
  { name: 'Scope', imageUrl: talentScope, color: '#38bdf8' },
  { name: 'Momentum', imageUrl: talentMomentum, color: '#fb923c' },
  { name: 'Resilience', imageUrl: talentResilience, color: '#10b981' },
  { name: 'Surge', imageUrl: talentSurge, color: '#c084fc' },
  { name: 'Anti Gravity', imageUrl: talentAntiGravity, color: '#38bdf8' },
  { name: 'Booster', imageUrl: talentBooster, color: '#f97316' },

  { name: 'Sun', imageUrl: fusionSun, color: '#fbbf24' },
  { name: 'Tundra', imageUrl: fusionTundra, color: '#60a5fa' },
  { name: 'Forge', imageUrl: fusionForge, color: '#ea580c' },
  { name: 'Leech', imageUrl: fusionLeech, color: '#a855f7' },
  { name: 'Prism', imageUrl: fusionPrism, color: '#a5b4fc' },
  { name: 'Spikes', imageUrl: fusionSpikes, color: '#22d3ee' },
  { name: 'Aurora', imageUrl: fusionAurora, color: '#6366f1' },
  { name: 'Frostbite', imageUrl: fusionFrostbite, color: '#38bdf8' },
  { name: 'Gravebound', imageUrl: fusionGravebound, color: '#c084fc' },
  { name: 'Storm', imageUrl: fusionStorm, color: '#0ea5e9' },
  { name: 'Rust', imageUrl: fusionRust, color: '#94a3b8' },
  { name: 'Echo', imageUrl: fusionEcho, color: '#93c5fd' },
  { name: 'Bramble', imageUrl: fusionBramble, color: '#16a34a' },
  { name: 'Radiance', imageUrl: fusionRadiance, color: '#fde047' },
  { name: 'Shard', imageUrl: fusionShard, color: '#7dd3fc' },
  { name: 'Plaguefire', imageUrl: fusionPlaguefire, color: '#f97316' },
  { name: 'Jetstream', imageUrl: fusionJetstream, color: '#5eead4' },
  { name: 'Cyclone', imageUrl: fusionCyclone, color: '#34d399' },
  { name: 'Crossfire', imageUrl: fusionCrossfire, color: '#facc15' }
];

export const MEDIA_BY_NAME = MEDIA_LIST.reduce((acc, media) => {
  acc[media.name] = media;
  return acc;
}, {});

export { MEDIA_LIST };
export default MEDIA_LIST;
