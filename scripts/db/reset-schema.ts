import {
  assertSchemaAllowed,
  dropAndRecreateSchema,
  loadDbConfig,
  runPrismaPush,
  runSeed,
  withClient
} from './utils.js';

async function main() {
  const cfg = loadDbConfig();
  const force = process.env.SCHEMA_RESET_FORCE === '1';

  if (process.env.NODE_ENV === 'production' && !force) {
    throw new Error('Refus : NODE_ENV=production (ajoutez SCHEMA_RESET_FORCE=1 pour forcer)');
  }

  assertSchemaAllowed(cfg.schema, force);

  await withClient(cfg, async (client) => {
    await dropAndRecreateSchema(client, cfg.schema);
    console.log(`Schéma "${cfg.schema}" réinitialisé`);
  });

  runPrismaPush();
  runSeed();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
