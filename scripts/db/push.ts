import { ensureSchema, loadDbConfig, runPrismaPush, withClient } from './utils.js';

async function main() {
  const cfg = loadDbConfig();
  await withClient(cfg, async (client) => {
    await ensureSchema(client, cfg.schema);
  });
  runPrismaPush();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
