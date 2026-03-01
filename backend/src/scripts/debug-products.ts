import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function debugProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // Get categories
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  logger.info(`=== Categories (${categories.length}) ===`);
  for (const cat of categories) {
    logger.info(`  ${cat.name} (id: ${cat.id})`);
  }

  // Get products
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "category_ids", "categories.id", "categories.name"],
  });

  logger.info(`\n=== Products (${products.length}) ===`);
  for (const p of products) {
    const catNames = p.categories?.map((c: any) => c.name).join(", ") || "none";
    logger.info(`  ${p.title} -> [${catNames}]`);
    logger.info(`    category_ids: ${JSON.stringify(p.category_ids)}`);
  }
}
