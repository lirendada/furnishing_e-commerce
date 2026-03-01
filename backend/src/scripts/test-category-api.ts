import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function testCategoryAPI({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // 测试通过 handle 获取分类（模拟前端 API 调用）
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "metadata"],
    filters: {
      handle: "dining"
    }
  });

  logger.info(`=== Found ${categories.length} category with handle 'dining' ===`);

  for (const cat of categories) {
    logger.info(`\nName: ${cat.name}`);
    logger.info(`ID: ${cat.id}`);
    logger.info(`Handle: ${cat.handle}`);
    logger.info(`Has metadata: ${!!cat.metadata}`);
    if (cat.metadata) {
      logger.info(`image_url: ${cat.metadata.image_url || "NOT SET"}`);
    }
  }

  // 测试不指定 fields 的默认返回
  logger.info(`\n=== Testing default fields (no fields specified) ===`);
  const { data: defaultCategories } = await query.graph({
    entity: "product_category",
    filters: {
      handle: "dining"
    }
  });

  if (defaultCategories.length > 0) {
    const cat = defaultCategories[0];
    logger.info(`Default returned keys: ${Object.keys(cat).join(", ")}`);
    logger.info(`Has metadata key: ${"metadata" in cat}`);
    if ("metadata" in cat) {
      logger.info(`Metadata value:`, JSON.stringify(cat.metadata, null, 2));
    }
  }
}
