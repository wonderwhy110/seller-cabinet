import { Category } from '@shared/types'

export const CATEGORY_LABELS: Record<Category, string> = {
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
}

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))
