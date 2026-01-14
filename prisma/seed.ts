import { PrismaClient } from '@prisma/client';

const seedPwd = process.env.DATABASE_SEED_PWD;

if (!seedPwd) {
  console.error('DATABASE_SEED_PWD manquant : refus d’exécuter le seed.');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const scoreCount = await prisma.score.count();
  const suggestionCount = await prisma.suggestion.count();

  if (scoreCount > 0 || suggestionCount > 0) {
    console.log('Seed ignoré : des données existent déjà dans le schéma ciblé.');
    return;
  }

  await prisma.score.create({
    data: {
      player: 'DevPlayer',
      score: 4200,
      stage: 3,
      level: 7,
      endedAt: new Date(),
      submittedAt: new Date(),
      build: 'Old'
    }
  });

  await prisma.suggestion.create({
    data: {
      player: 'DevPlayer',
      category: 'feature',
      message: 'Première suggestion de seed',
      status: 'open'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
