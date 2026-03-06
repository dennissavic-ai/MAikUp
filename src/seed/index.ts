import { PrismaClient } from '@prisma/client';
import { makeupProducts } from './makeup-data';
import { makeupLooks } from './looks-data';
import { hairstyles } from './hairstyle-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.lookProduct.deleteMany();
  await prisma.makeupLook.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.lookHistory.deleteMany();
  await prisma.savedLook.deleteMany();
  await prisma.makeupProduct.deleteMany();
  await prisma.hairstyle.deleteMany();

  console.log('Cleared existing data');

  // Seed makeup products
  const createdProducts = await Promise.all(
    makeupProducts.map((product) =>
      prisma.makeupProduct.create({ data: product })
    )
  );
  console.log(`Seeded ${createdProducts.length} makeup products`);

  // Create a name-to-id map for look associations
  const productMap = new Map(createdProducts.map((p) => [p.name, p.id]));

  // Seed makeup looks with their product associations
  for (const look of makeupLooks) {
    const { productNames, ...lookData } = look;
    const createdLook = await prisma.makeupLook.create({ data: lookData });

    // Associate products with looks
    for (let i = 0; i < productNames.length; i++) {
      const productId = productMap.get(productNames[i]);
      if (productId) {
        await prisma.lookProduct.create({
          data: {
            lookId: createdLook.id,
            productId,
            sortOrder: i,
          },
        });
      }
    }
  }
  console.log(`Seeded ${makeupLooks.length} makeup looks`);

  // Seed hairstyles
  const createdHairstyles = await Promise.all(
    hairstyles.map((hairstyle) =>
      prisma.hairstyle.create({ data: hairstyle })
    )
  );
  console.log(`Seeded ${createdHairstyles.length} hairstyles`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
