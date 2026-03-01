import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  PriceListStatus,
  PriceListType,
} from "@medusajs/framework/utils";

export default async function seedPriceLists({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const pricingModule = container.resolve(Modules.PRICING);

  logger.info("Seeding price lists for promotions...");

  // Get all product categories
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  // Get all products with variants and their prices
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "categories.id",
      "categories.name",
      "variants.id",
      "variants.title",
      "variants.prices.id",
      "variants.prices.amount",
      "variants.prices.currency_code"
    ],
  });

  logger.info(`Found ${products.length} products.`);

  // Get all links between variants and price_sets
  const variantPriceSetMap = new Map<string, string>(); // variant_id -> price_set_id

  const { data: variantPriceSetLinks } = await query.graph({
    entity: "product_variant_price_set",
    fields: ["variant_id", "price_set_id"]
  });

  for (const link of variantPriceSetLinks || []) {
    variantPriceSetMap.set(link.variant_id, link.price_set_id);
  }

  logger.info(`Mapped ${variantPriceSetMap.size} variant-price_set relationships.`);

  // Calculate end date (30 days from now)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  // Define price lists
  const priceListsData = [
    {
      name: "End of Season Sale",
      description: "End of season clearance - 20% off sofas!",
      type: PriceListType.SALE,
      status: PriceListStatus.ACTIVE,
      starts_at: new Date(),
      ends_at: endDate,
      categoryName: "Sofas & Lounge",
      discount: 20,
      maxVariants: 15,
    },
    {
      name: "Dining Special",
      description: "15% off dining furniture",
      type: PriceListType.SALE,
      status: PriceListStatus.ACTIVE,
      starts_at: new Date(),
      ends_at: endDate,
      categoryName: "Dining",
      discount: 15,
      maxVariants: 15,
    },
    {
      name: "Bedroom Sale",
      description: "25% off bedroom furniture",
      type: PriceListType.SALE,
      status: PriceListStatus.ACTIVE,
      starts_at: new Date(),
      ends_at: endDate,
      categoryName: "Bedroom",
      discount: 25,
      maxVariants: 15,
    }
  ];

  for (const listData of priceListsData) {
    const priceListPrices: any[] = [];
    let variantCount = 0;

    // Find target category
    const targetCategory = categories.find((c: any) => c.name === listData.categoryName);
    if (!targetCategory) {
      logger.warn(`Category "${listData.categoryName}" not found, skipping...`);
      continue;
    }

    logger.info(`Processing "${listData.name}"...`);

    // Filter products by category
    const targetProducts = products.filter((p: any) =>
      p.categories?.some((c: any) => c.id === targetCategory.id)
    );

    logger.info(`Found ${targetProducts.length} products.`);

    // Generate discounted prices
    for (const product of targetProducts) {
      if (variantCount >= listData.maxVariants) break;

      const variants = product.variants || [];

      for (const variant of variants) {
        if (variantCount >= listData.maxVariants) break;

        // Get price_set_id from the link
        const priceSetId = variantPriceSetMap.get(variant.id);
        if (!priceSetId) continue;

        // Get AUD price
        const audPrice = (variant.prices || []).find((p: any) => p.currency_code === "aud");
        if (!audPrice) continue;

        const originalAmount = audPrice.amount;
        const discountAmount = Math.round(originalAmount * (listData.discount / 100));
        const newPrice = originalAmount - discountAmount;

        priceListPrices.push({
          price_set_id: priceSetId,
          currency_code: "aud",
          amount: newPrice,
        });

        variantCount++;

        logger.info(`  - ${product.title}: $${(originalAmount/100).toFixed(2)} -> $${(newPrice/100).toFixed(2)}`);
      }
    }

    if (priceListPrices.length === 0) {
      logger.warn(`No prices for "${listData.name}", skipping...`);
      continue;
    }

    // Create price list directly using pricing module
    try {
      // Create the price list with prices in one go
      const [createdPriceList] = await pricingModule.createPriceLists([
        {
          title: listData.name,
          description: listData.description,
          type: listData.type,
          status: listData.status,
          starts_at: listData.starts_at,
          ends_at: listData.ends_at,
          prices: priceListPrices,
        },
      ]);

      logger.info(`✅ Created "${listData.name}" with ${priceListPrices.length} prices.`);
    } catch (error: any) {
      logger.error(`❌ Failed: ${error.message}`);
    }
  }

  logger.info("=".repeat(50));
  logger.info("Done! Price lists created.");
  logger.info("=".repeat(50));
}
