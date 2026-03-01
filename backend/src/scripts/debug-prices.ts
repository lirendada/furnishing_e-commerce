import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function debugPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // Get products with prices
  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "variants.id",
      "variants.title",
      "variants.prices.id",
      "variants.prices.amount",
      "variants.prices.currency_code"
    ],
    options: { limit: 2 }
  });

  logger.info(`=== Products with variant prices ===`);
  for (const p of products) {
    logger.info(`\nProduct: ${p.title}`);
    for (const v of p.variants || []) {
      logger.info(`  Variant: ${v.title}`);
      for (const price of v.prices || []) {
        logger.info(`    Price: ${price.currency_code} ${price.amount}`);
      }
    }
  }
}
