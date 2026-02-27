// composables/useMedusa.ts
export const useMedusa = () => {
  const config = useRuntimeConfig()

  // 创建一个自带 BaseURL 和 鉴权 Header 的自定义 fetcher
  const customFetch = $fetch.create({
    baseURL: config.public.medusaUrl,
    headers: {
      'x-publishable-api-key': config.public.medusaPublishableKey as string
    }
  })

  return customFetch
}