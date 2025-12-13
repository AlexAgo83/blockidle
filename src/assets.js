// Simple asset loader for future sprites/backgrounds.
// Usage example:
//   preloadAssets(['paddle.png', 'brick.png']);
//   const img = await loadImage('brick.png');

// Allow SVG sprites for lightweight, tintable shapes.
const cache = new Map();

function buildUrl(name) {
  try {
    // Try bundled asset path (src/assets)
    return new URL(`./assets/${name}`, import.meta.url).href;
  } catch (e) {
    // Fallback to public assets
    const base = (import.meta?.env?.BASE_URL || '/').replace(/\/?$/, '/');
    return `${base}assets/${name}`;
  }
}

export function loadImage(name) {
  const url = buildUrl(name);
  if (cache.has(url)) return cache.get(url);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
  cache.set(url, promise);
  return promise;
}

export function preloadAssets(list = []) {
  if (!Array.isArray(list) || list.length === 0) return Promise.resolve(true);
  return Promise.all(list.map((name) => loadImage(name).catch(() => null))).then(() => true);
}
