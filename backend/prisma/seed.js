import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // clear old
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promoCode.deleteMany();

  // promos
  await prisma.promoCode.createMany({
    data: [
      { code: 'SAVE10', type: 'PERCENT', amount: 10, active: true },
      { code: 'FLAT100', type: 'FLAT', amount: 100, active: true },
    ],
  });

  const exp1 = await prisma.experience.create({
    data: {
      title: 'Sunrise Hot Air Balloon',
      description: 'Early morning ride with amazing views. Bring a jacket!',
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop',
      price: 2500,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      title: 'Desert Safari Evening',
      description: 'Bumpy dunes + sunset + tea. Pretty cool tbh.',
      imageUrl: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop',
      price: 1800,
    },
  });

  const now = new Date();
  const addHours = (h) => new Date(now.getTime() + h * 3600 * 1000);

  await prisma.slot.createMany({
    data: [
      { experienceId: exp1.id, dateTime: addHours(24), capacity: 5 },
      { experienceId: exp1.id, dateTime: addHours(48), capacity: 5 },
      { experienceId: exp2.id, dateTime: addHours(24), capacity: 5 },
      { experienceId: exp2.id, dateTime: addHours(72), capacity: 5 },
    ],
  });

  console.log('Seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });