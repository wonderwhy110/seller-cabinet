
import { apiInstance } from '@shared/api'

const cache = new Map<string, number>()
let initPromise: Promise<void> | null = null

export async function initItemCache() {
  if (initPromise) return initPromise
  
  initPromise = (async () => {
    console.log('Инициализация кэша объявлений...')
    const promises = []
    for (let id = 1; id <= 32; id++) {
      promises.push(
        apiInstance.get<{ id: number; title: string }>(`/items/${id}`)
          .then(res => ({ id: res.data.id, title: res.data.title }))
          .catch(() => null)
      )
    }
    
    const results = await Promise.all(promises)
    results.forEach(result => {
      if (result) {
        cache.set(result.title, result.id)
      }
    })
    console.log('Кэш инициализирован, размер:', cache.size)
  })()
  
  return initPromise
}

export async function getItemIdByTitle(title: string): Promise<number | null> {
  await initPromise
  return cache.get(title) ?? null
}