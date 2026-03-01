import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

// Australian furniture categories
const furnitureCategories = [
  {
    name: "Sofas & Lounge",
    handle: "sofas-lounge",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      rank: 1,
      description: "Comfortable sofas and lounge suites"
    }
  },
  {
    name: "Dining",
    handle: "dining",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80",
      rank: 2,
      description: "Dining tables and chairs"
    }
  },
  {
    name: "Bedroom",
    handle: "bedroom",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      rank: 3,
      description: "Beds and bedroom furniture"
    }
  },
  {
    name: "Coffee Tables",
    handle: "coffee-tables",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
      rank: 4,
      description: "Coffee and side tables"
    }
  },
  {
    name: "TV & Entertainment",
    handle: "tv-entertainment",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      rank: 5,
      description: "TV units and entertainment units"
    }
  },
  {
    name: "Storage",
    handle: "storage",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
      rank: 6,
      description: "Storage solutions"
    }
  },
  {
    name: "Office",
    handle: "office",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
      rank: 7,
      description: "Home office furniture"
    }
  },
  {
    name: "Outdoor",
    handle: "outdoor",
    is_active: true,
    metadata: {
      image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      rank: 8,
      description: "Outdoor furniture"
    }
  }
];

// Australian furniture products
const furnitureProducts = [
  // SOFAS
  {
    title: "Wallace 3 Seater Recliner Sofa",
    handle: "wallace-3-seater-recliner-sofa",
    category: "Sofas & Lounge",
    description: "Luxurious leather recliner sofa with power headrests and lumbar support. Features premium Australian leather upholstery and pocket spring comfort system. Perfect for relaxing after a long day.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Black", "Chocolate", "Cream", "Walnut"] },
      { title: "Configuration", values: ["2 Seater", "3 Seater", "3.5 Seater"] }
    ],
    basePrice: 249900, // $2,499.00 AUD
    weight: 85000,
    sku: "WALLACE-RECLINER"
  },
  {
    title: "Hampton Fabric Sofa",
    handle: "hampton-fabric-sofa",
    category: "Sofas & Lounge",
    description: "Classic Hamptons style fabric sofa with timber frame. Features reversible cushions, stain-resistant fabric, and kiln-dried hardwood frame. Australian made quality.",
    images: [
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Linen", "Oatmeal", "Charcoal", "Navy"] },
      { title: "Size", values: ["2 Seater", "3 Seater", "3.5 Seater", "Modular"] }
    ],
    basePrice: 189900,
    weight: 65000,
    sku: "HAMPTON-SOFA"
  },
  {
    title: "Modular Lounge Suite",
    handle: "modular-lounge-suite",
    category: "Sofas & Lounge",
    description: "Versatile modular lounge that can be configured to suit any space. Features plush cushioning, reversible chaise, and easy-clean fabric. Made in Australia.",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Grey", "Beige", "Sage"] },
      { title: "Modules", values: ["3 Piece", "4 Piece", "5 Piece", "6 Piece"] }
    ],
    basePrice: 329900,
    weight: 95000,
    sku: "MODULAR-LOUNGE"
  },
  // DINING
  {
    title: "Rustic Solid Timber Dining Table",
    handle: "rustic-solid-timber-dining-table",
    category: "Dining",
    description: "Handcrafted from recycled Australian hardwood timber. Each table is unique with natural timber characteristics. Seats 6-8 people comfortably.",
    images: [
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.5m", "1.8m", "2.1m", "2.4m"] },
      { title: "Timber", values: ["Messmate", "Blackbutt", "Jarrah", "Oak"] }
    ],
    basePrice: 159900,
    weight: 55000,
    sku: "TIMBER-DINING"
  },
  {
    title: "Marble Top Dining Table",
    handle: "marble-top-dining-table",
    category: "Dining",
    description: "Luxurious marble top dining table with brass or chrome legs. Perfect for modern Australian homes. Seats 6-8 people.",
    images: [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.6m", "1.8m", "2.0m"] },
      { title: "Marble", values: ["Carrara White", "Emperador Dark", "Calacatta Gold"] }
    ],
    basePrice: 249900,
    weight: 70000,
    sku: "MARBLE-DINING"
  },
  {
    title: "Adelaide Dining Chair",
    handle: "adelaide-dining-chair",
    category: "Dining",
    description: "Upholstered dining chair with timber frame. Features foam cushioning and stain-resistant fabric. Australian made with kiln-dried hardwood frame.",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Linen", "Charcoal", "Navy", "Sage", "Taupe"] }
    ],
    basePrice: 19900,
    weight: 8500,
    sku: "ADELAIDE-CHAIR"
  },
  {
    title: "Leather Dining Chair",
    handle: "leather-dining-chair",
    category: "Dining",
    description: "Premium leather dining chair with chrome legs. Features padded seat and backrest for ultimate comfort. Perfect for formal dining rooms.",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Black", "Brown", "Cream"] }
    ],
    basePrice: 29900,
    weight: 10000,
    sku: "LEATHER-CHAIR"
  },
  // BEDROOM
  {
    title: "Platform Bed Frame",
    handle: "platform-bed-frame",
    category: "Bedroom",
    description: "Modern platform bed frame with upholstered headboard. Features solid timber slats and upholstered side rails. Available in King, Queen, and Double sizes.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["Double", "Queen", "King"] },
      { title: "Colour", values: ["Charcoal", "Grey", "Navy", "Taupe"] }
    ],
    basePrice: 89900,
    weight: 45000,
    sku: "PLATFORM-BED"
  },
  {
    title: "Tallboy Dresser",
    handle: "tallboy-dresser",
    category: "Bedroom",
    description: "Spacious tallboy dresser with 6 drawers. Features soft-close runners, timber handles, and durable finish. Perfect for bedroom storage.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Walnut", "Oak", "White", "Black"] }
    ],
    basePrice: 69900,
    weight: 35000,
    sku: "TALLBOY-DRESSER"
  },
  {
    title: "Bedside Table",
    handle: "bedside-table",
    category: "Bedroom",
    description: "Modern bedside table with drawer and shelf. Features timber top and powder-coated metal legs. Perfect complement to our bed frames.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Natural", "Walnut", "White", "Black"] }
    ],
    basePrice: 19900,
    weight: 12000,
    sku: "BEDSIDE-TABLE"
  },
  // COFFEE TABLES
  {
    title: "Round Coffee Table",
    handle: "round-coffee-table",
    category: "Coffee Tables",
    description: "Stylish round coffee table with timber top and metal legs. Perfect for modern living rooms. Features durable timber veneer finish.",
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["90cm", "110cm", "130cm"] },
      { title: "Timber", values: ["Oak", "Walnut", "Ash"] }
    ],
    basePrice: 39900,
    weight: 18000,
    sku: "ROUND-COFFEE"
  },
  {
    title: "Rectangular Timber Coffee Table",
    handle: "rectangular-timber-coffee-table",
    category: "Coffee Tables",
    description: "Classic rectangular coffee table crafted from solid Australian timber. Features drawer storage and shelf below. Made in Australia.",
    images: [
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.2m", "1.5m", "1.8m"] },
      { title: "Timber", values: ["Messmate", "Blackbutt", "Oak"] }
    ],
    basePrice: 59900,
    weight: 25000,
    sku: "TIMBER-COFFEE"
  },
  {
    title: "Glass Coffee Table",
    handle: "glass-coffee-table",
    category: "Coffee Tables",
    description: "Contemporary glass coffee table with chrome legs. Features 10mm tempered glass top and lower shelf. Perfect for modern spaces.",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["Square", "Rectangular", "Round"] }
    ],
    basePrice: 44900,
    weight: 20000,
    sku: "GLASS-COFFEE"
  },
  // TV & ENTERTAINMENT
  {
    title: "Lowline TV Unit",
    handle: "lowline-tv-unit",
    category: "TV & Entertainment",
    description: "Modern lowline TV unit with timber finish. Features cable management, drawers, and open shelves. Accommodates TVs up to 85 inch.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.8m", "2.2m", "2.6m"] },
      { title: "Colour", values: ["Walnut", "Oak", "White", "Black"] }
    ],
    basePrice: 79900,
    weight: 35000,
    sku: "LOWLINE-TV"
  },
  {
    title: "Timber TV Unit",
    handle: "timber-tv-unit",
    category: "TV & Entertainment",
    description: "Rustic timber TV unit handcrafted from recycled Australian hardwood. Features natural timber character and ample storage.",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.8m", "2.1m", "2.4m"] },
      { title: "Timber", values: ["Messmate", "Blackbutt", "Jarrah"] }
    ],
    basePrice: 99900,
    weight: 45000,
    sku: "TIMBER-TV"
  },
  // STORAGE
  {
    title: "Sideboard Buffet",
    handle: "sideboard-buffet",
    category: "Storage",
    description: "Elegant sideboard buffet with 4 doors and 3 drawers. Features soft-close hinges and timber handles. Perfect for dining room storage.",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.6m", "2.0m", "2.4m"] },
      { title: "Colour", values: ["Walnut", "Oak", "White", "Black"] }
    ],
    basePrice: 109900,
    weight: 50000,
    sku: "SIDEBOARD"
  },
  {
    title: "Bookshelf",
    handle: "bookshelf",
    category: "Storage",
    description: "Modern bookshelf with adjustable shelves. Features timber frame and back panel. Perfect for home library or display.",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["80cm Wide", "120cm Wide", "160cm Wide"] },
      { title: "Colour", values: ["Walnut", "Oak", "White"] }
    ],
    basePrice: 49900,
    weight: 30000,
    sku: "BOOKSHELF"
  },
  // OFFICE
  {
    title: "Standing Desk",
    handle: "standing-desk",
    category: "Office",
    description: "Electric height-adjustable standing desk with timber top. Features memory settings for multiple heights and cable management. Promotes healthy work habits.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["1.2m", "1.5m", "1.8m"] },
      { title: "Colour", values: ["White", "Black", "Oak", "Walnut"] }
    ],
    basePrice: 89900,
    weight: 35000,
    sku: "STANDING-DESK"
  },
  {
    title: "Office Chair",
    handle: "office-chair",
    category: "Office",
    description: "Ergonomic office chair with mesh back and lumbar support. Features adjustable height, armrests, and tilt. Perfect for home office.",
    images: [
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80"
    ],
    options: [
      { title: "Colour", values: ["Black", "Grey", "White"] }
    ],
    basePrice: 49900,
    weight: 18000,
    sku: "OFFICE-CHAIR"
  },
  // OUTDOOR
  {
    title: "Outdoor Dining Setting",
    handle: "outdoor-dining-setting",
    category: "Outdoor",
    description: "All-weather outdoor dining set with table and chairs. Features powder-coated aluminum frame and weather-resistant cushions. Seats 6-8 people.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
    ],
    options: [
      { title: "Size", values: ["6 Piece", "8 Piece"] },
      { title: "Frame", values: ["Black", "White", "Bronze"] }
    ],
    basePrice: 189900,
    weight: 75000,
    sku: "OUTDOOR-DINING"
  },
  {
    title: "Outdoor Lounge Set",
    handle: "outdoor-lounge-set",
    category: "Outdoor",
    description: "Modular outdoor lounge with weather-resistant cushions. Features modular pieces that can be rearranged. Made from durable synthetic rattan.",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80"
    ],
    options: [
      { title: "Configuration", values: ["3 Piece", "5 Piece", "7 Piece"] }
    ],
    basePrice: 149900,
    weight: 60000,
    sku: "OUTDOOR-LOUNGE"
  }
];

// Generate variants for each product
function generateVariants(product: typeof furnitureProducts[0]) {
  const variants: any[] = [];
  const optionCombinations: string[] = [];

  function generateCombos(index: number, current: string[]) {
    if (index === product.options.length) {
      optionCombinations.push(current.join(" / "));
      return;
    }
    for (const value of product.options[index].values) {
      generateCombos(index + 1, [...current, value]);
    }
  }

  generateCombos(0, []);

  for (const combo of optionCombinations) {
    const options: any = {};
    const values = combo.split(" / ");
    product.options.forEach((opt, i) => {
      options[opt.title] = values[i];
    });

    // Generate price variation based on options
    let priceMultiplier = 1;
    const comboLower = combo.toLowerCase();

    // Size/Configuration price adjustments
    if (comboLower.includes("3 seater") || comboLower.includes("1.8m") || comboLower.includes("queen")) {
      priceMultiplier = 1.1;
    } else if (comboLower.includes("3.5 seater") || comboLower.includes("2.1m") || comboLower.includes("king")) {
      priceMultiplier = 1.2;
    } else if (comboLower.includes("2.4m") || comboLower.includes("6 piece")) {
      priceMultiplier = 1.3;
    } else if (comboLower.includes("modular") || comboLower.includes("5 piece") || comboLower.includes("8 piece")) {
      priceMultiplier = 1.4;
    }

    // Premium materials
    if (comboLower.includes("marble") || comboLower.includes("leather") || comboLower.includes("jarrah")) {
      priceMultiplier *= 1.2;
    }

    variants.push({
      title: combo,
      sku: `${product.sku}-${combo.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
      options,
      prices: [
        {
          amount: Math.round(product.basePrice * priceMultiplier),
          currency_code: "aud",
        }
      ]
    });
  }

  return variants;
}

export default async function seedFurnitureData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding Australian furniture store data...");

  // Get or create store
  const [store] = await storeModuleService.listStores();

  // Get or create default sales channel
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // Update store to use AUD
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "aud",
          is_default: true,
        }
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // Check if Australia region already exists
  const regionModuleService = container.resolve(Modules.REGION);
  const existingRegions = await regionModuleService.listRegions({
    countries: ["au"]
  });

  let region: any;

  if (existingRegions.length > 0) {
    // Use existing region
    region = existingRegions[0];
    logger.info(`Using existing region: ${region.name} (${region.id})`);

    // Update currency to AUD if needed
    if (region.currency_code !== "aud") {
      logger.info(`Updating region currency from ${region.currency_code} to aud...`);
      await regionModuleService.updateRegions(region.id, {
        currency_code: "aud"
      });
    }
  } else {
    // Create Australia region
    logger.info("Seeding Australia region...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Australia",
            currency_code: "aud",
            countries: ["au"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info("Finished seeding Australia region.");
  }

  // Create tax region for Australia (check if exists)
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions({
    country_code: "au"
  });

  if (existingTaxRegions.length === 0) {
    logger.info("Seeding tax region...");
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "au", provider_id: "tp_system" }],
    });
    logger.info("Finished seeding tax region.");
  } else {
    logger.info("Tax region already exists, skipping...");
  }

  // Create stock location
  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Australian Warehouse",
          address: {
            city: "Sydney",
            country_code: "AU",
            address_1: "123 Warehouse Road",
            postal_code: "2000",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // Create shipping profile
  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Create fulfillment set for Australia
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Australian Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Australia",
        geo_zones: [
          {
            country_code: "au",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  // Create shipping options for Australia
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Flat rate $59 delivery to most Australian areas. 5-10 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "aud",
            amount: 5900, // $59 AUD
          },
          {
            region_id: region.id,
            amount: 5900,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Express delivery to metro areas. 2-3 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "aud",
            amount: 9900, // $99 AUD
          },
          {
            region_id: region.id,
            amount: 9900,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  // Link sales channel to stock location
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  // Create publishable API key
  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  } else {
    logger.info(`Using existing publishable key: ${publishableApiKey.token || publishableApiKey.id}`);
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");
  logger.info(`Publishable API Key: ${publishableApiKey.token || publishableApiKey.id}`);

  // Create product categories
  logger.info("Seeding furniture categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: furnitureCategories,
    },
  });
  logger.info(`Created ${categoryResult.length} product categories.`);

  // Create products
  logger.info("Seeding furniture products...");

  const productsInput = furnitureProducts.map((product) => {
    const variants = generateVariants(product);
    const category = categoryResult.find((cat) => cat.name === product.category)!;

    return {
      title: product.title,
      handle: product.handle,
      category_ids: [category.id],
      description: product.description,
      weight: product.weight,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: product.images.map((url) => ({ url })),
      options: product.options,
      variants,
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
    };
  });

  await createProductsWorkflow(container).run({
    input: {
      products: productsInput,
    },
  });
  logger.info(`Finished seeding ${productsInput.length} furniture products.`);

  // Create inventory levels
  logger.info("Seeding inventory levels.");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    inventoryLevels.push({
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    });
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });
  logger.info("Finished seeding inventory levels data.");

  logger.info("=".repeat(50));
  logger.info("Australian Furniture Store seeding completed!");
  logger.info(`Products: ${productsInput.length}`);
  logger.info(`Categories: ${categoryResult.length}`);
  logger.info(`Region: Australia (AUD)`);
  logger.info(`Publishable Key: ${publishableApiKey.token || publishableApiKey.id}`);
  logger.info("=".repeat(50));
}
