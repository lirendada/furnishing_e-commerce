import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function debugCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // Get categories with metadata
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "metadata"],
  });

  logger.info(`=== Categories with Metadata (${categories.length}) ===`);
  for (const cat of categories) {
    logger.info(`\n  📁 ${cat.name} (handle: ${cat.handle})`);
    if (cat.metadata) {
      logger.info(`     image_url: ${cat.metadata.image_url || "❌ NOT SET"}`);
      logger.info(`     rank: ${cat.metadata.rank || "❌ NOT SET"}`);
      logger.info(`     description: ${cat.metadata.description || "❌ NOT SET"}`);
    } else {
      logger.info(`     ❌ No metadata found`);
    }
  }

  // Get publishable API key
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
    filters: {
      type: "publishable",
    },
  });

  logger.info(`\n\n=== Publishable API Keys (${apiKeys.length}) ===`);
  for (const key of apiKeys) {
    logger.info(`  ${key.title}: ${key.token}`);
  }
}
