import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import { updateProductCategoriesStep } from "@medusajs/medusa/core-flows";

// 分类 metadata 配置（与 seed-furniture.ts 保持一致）
const categoryMetadataConfig = [
  {
    name: "Sofas & Lounge",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      rank: 1,
      description: "Comfortable sofas and lounge suites"
    }
  },
  {
    name: "Dining",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80",
      rank: 2,
      description: "Dining tables and chairs"
    }
  },
  {
    name: "Bedroom",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      rank: 3,
      description: "Beds and bedroom furniture"
    }
  },
  {
    name: "Coffee Tables",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
      rank: 4,
      description: "Coffee and side tables"
    }
  },
  {
    name: "TV & Entertainment",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      rank: 5,
      description: "TV units and entertainment units"
    }
  },
  {
    name: "Storage",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
      rank: 6,
      description: "Storage solutions"
    }
  },
  {
    name: "Office",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
      rank: 7,
      description: "Home office furniture"
    }
  },
  {
    name: "Outdoor",
    metadata: {
      image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      rank: 8,
      description: "Outdoor furniture"
    }
  }
];

export default async function updateCategoryMetadata({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("=== Updating Category Metadata ===");

  // 获取所有分类及其 metadata
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "metadata"],
  });

  logger.info(`Found ${categories.length} categories in database.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const category of categories) {
    const config = categoryMetadataConfig.find(c => c.name === category.name);

    if (!config) {
      logger.warn(`  ⚠️  No metadata config found for category: ${category.name}`);
      skippedCount++;
      continue;
    }

    // 检查是否已有 image_url
    const currentImageUrl = category.metadata?.image_url;
    if (currentImageUrl) {
      logger.info(`  ✓ ${category.name} already has image_url: ${currentImageUrl}`);
      skippedCount++;
      continue;
    }

    // 更新 metadata
    try {
      await updateProductCategoriesStep({
        selector: { id: category.id },
        update: { metadata: config.metadata }
      });

      logger.info(`  ✅ Updated ${category.name}:`);
      logger.info(`      image_url: ${config.metadata.image_url}`);
      logger.info(`      rank: ${config.metadata.rank}`);
      updatedCount++;
    } catch (error) {
      logger.error(`  ❌ Failed to update ${category.name}: ${error}`);
    }
  }

  logger.info("\n=== Summary ===");
  logger.info(`  Updated: ${updatedCount} categories`);
  logger.info(`  Skipped: ${skippedCount} categories`);
  logger.info("====================");
}
