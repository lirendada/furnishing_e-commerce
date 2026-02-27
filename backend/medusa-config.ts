import { loadEnv, defineConfig } from "@medusajs/framework/utils"
import { Modules } from "@medusajs/framework/utils"

// 确保正确加载环境变量
const devEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL, // 修复 Redis 连接提示
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    // V2 架构下的文件模块配置
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              // 👇 核心修改点：强制指定腾讯云格式的真实图片外网链接
              file_url: `https://${process.env.S3_BUCKET}.cos.${process.env.S3_REGION}.myqcloud.com`, 
              
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_URL,
              s3ForcePathStyle: true,
            },
          },
        ],
      },
    },
  }
})