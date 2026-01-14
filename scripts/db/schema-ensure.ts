import { ensureSchema, loadDbConfig, withClient } from './utils.js';

async function main() {
  const cfg = loadDbConfig();
  await withClient(cfg, async (client) => {
    await ensureSchema(client, cfg.schema);
    console.log(`Schéma "${cfg.schema}" OK`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
