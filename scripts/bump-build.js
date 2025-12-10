import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildInfoPath = path.join(__dirname, '..', 'src', 'build-info.json');

function readCurrent() {
  try {
    const raw = fs.readFileSync(buildInfoPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Number.isFinite(parsed.build) ? parsed.build : 0;
  } catch (err) {
    return 0;
  }
}

const next = readCurrent() + 1;
const payload = {
  build: next,
  generatedAt: new Date().toISOString()
};

fs.mkdirSync(path.dirname(buildInfoPath), { recursive: true });
fs.writeFileSync(buildInfoPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Bumped build number to ${next}`);
