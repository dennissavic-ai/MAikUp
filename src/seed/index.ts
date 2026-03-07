import { PrismaClient } from '@prisma/client';
import { makeupProducts } from './makeup-data';
import { makeupLooks } from './looks-data';
import { hairstyles } from './hairstyle-data';
import { skinToneRecommendations } from './recommendation-data';
import { arAssets } from './ar-asset-data';
import { featuredItems } from './featured-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (respecting FK order)
  await prisma.featuredItem.deleteMany();
  await prisma.arAsset.deleteMany();
  await prisma.lookProduct.deleteMany();
  await prisma.makeupLook.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.lookHistory.deleteMany();
  await prisma.savedLook.deleteMany();
  await prisma.skinToneRecommendation.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.sharedLook.deleteMany();
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

  // Seed skin tone recommendations
  let recCount = 0;
  for (const rec of skinToneRecommendations) {
    const productId = productMap.get(rec.productName);
    if (productId) {
      await prisma.skinToneRecommendation.create({
        data: {
          skinTone: rec.skinTone,
          skinUndertone: rec.skinUndertone,
          productId,
          matchScore: rec.matchScore,
          notes: rec.notes,
        },
      });
      recCount++;
    }
  }
  console.log(`Seeded ${recCount} skin tone recommendations`);

  // Create a name-to-id map for hairstyles
  const hairstyleMap = new Map(createdHairstyles.map((h) => [h.name, h.id]));

  // Create a name-to-id map for looks
  const lookMap = new Map<string, string>();
  const allLooks = await prisma.makeupLook.findMany({ select: { id: true, name: true } });
  for (const look of allLooks) {
    lookMap.set(look.name, look.id);
  }

  // Seed AR assets
  let arCount = 0;
  for (const asset of arAssets) {
    const productId = asset.productName ? productMap.get(asset.productName) : undefined;
    const hairstyleId = asset.hairstyleName ? hairstyleMap.get(asset.hairstyleName) : undefined;

    if (asset.productName && !productId) {
      console.warn(`AR asset: product not found: ${asset.productName}`);
      continue;
    }
    if (asset.hairstyleName && !hairstyleId) {
      console.warn(`AR asset: hairstyle not found: ${asset.hairstyleName}`);
      continue;
    }

    await prisma.arAsset.create({
      data: {
        productId: productId ?? null,
        hairstyleId: hairstyleId ?? null,
        assetType: asset.assetType as any,
        modelUrl: asset.modelUrl,
        textureUrl: asset.textureUrl,
        thumbnailUrl: asset.thumbnailUrl,
        anchorPoint: asset.anchorPoint,
        blendMode: asset.blendMode,
        opacity: asset.opacity,
        scale: asset.scale,
        offset: asset.offset,
        metadata: asset.metadata,
        version: asset.version,
        fileSizeBytes: asset.fileSizeBytes,
      },
    });
    arCount++;
  }
  console.log(`Seeded ${arCount} AR assets`);

  // Seed featured items
  let featuredCount = 0;
  for (const item of featuredItems) {
    let entityId: string | undefined;

    if (item.type === 'PRODUCT') {
      entityId = productMap.get(item.entityName);
    } else if (item.type === 'LOOK') {
      entityId = lookMap.get(item.entityName);
    } else if (item.type === 'HAIRSTYLE') {
      entityId = hairstyleMap.get(item.entityName);
    }

    if (!entityId) {
      console.warn(`Featured item: entity not found: ${item.entityName} (type: ${item.type})`);
      continue;
    }

    await prisma.featuredItem.create({
      data: {
        type: item.type as any,
        entityId,
        title: item.title,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl,
        position: item.position,
        section: item.section,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: item.isActive,
      },
    });
    featuredCount++;
  }
  console.log(`Seeded ${featuredCount} featured items`);

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
