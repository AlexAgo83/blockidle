// Simple asset loader for future sprites/backgrounds.
// Usage example:
//   preloadAssets(['paddle.png', 'brick.png']);
//   const img = await loadImage('brick.png');

const cache = new Map();

export function loadImage(name) {
  const url = `/assets/${name}`;
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
