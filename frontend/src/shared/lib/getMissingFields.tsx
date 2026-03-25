import type { Category, ItemParams, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '@shared/types'



export function getMissingFields(
  category: Category,
  params: ItemParams,
  description?: string,
): string[] {
  const missing: string[] = []

  if (!description) missing.push('description')

  if (category === 'electronics') {
    const p = params as ElectronicsItemParams
    if (!p.brand) missing.push('brand')
    if (!p.model) missing.push('model')
    if (!p.condition) missing.push('condition')
    if (!p.color) missing.push('color')
  } else if (category === 'auto') {
    const p = params as AutoItemParams
    if (!p.brand) missing.push('brand')
    if (!p.model) missing.push('model')
    if (!p.yearOfManufacture) missing.push('yearOfManufacture')
    if (!p.mileage) missing.push('mileage')
  } else if (category === 'real_estate') {
    const p = params as RealEstateItemParams
    if (!p.address) missing.push('address')
    if (!p.area) missing.push('area')
  }

  return missing
}