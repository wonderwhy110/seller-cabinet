import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Spin, Alert } from 'antd'
import { ArrowLeftOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons'
import { itemApi } from '@entities/item'
import { NeedsRevisionAlert } from '@entities/item'
import { CATEGORY_LABELS, formatPrice, formatDate, getMissingFields } from '@shared/lib'
import type { AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '@shared/types'
import styles from './AdViewPage.module.css'

export const AdViewPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['item', id],
    queryFn: ({ signal }) => itemApi.getItem(Number(id), signal),
    enabled: !!id && !isNaN(Number(id)),
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
        <Alert type="error" message="Объявление не найдено" showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/ads')}>
          ← К списку
        </Button>
      </div>
    )
  }

  const missingFields = getMissingFields(item.category, item.params, item.description)

  const renderParams = () => {
    if (item.category === 'electronics') {
      const p = item.params as ElectronicsItemParams
      return [
        { label: 'Тип', value: p.type },
        { label: 'Бренд', value: p.brand },
        { label: 'Модель', value: p.model },
        {
          label: 'Состояние',
          value: p.condition === 'new' ? 'Новое' : p.condition === 'used' ? 'Б/у' : undefined,
        },
        { label: 'Цвет', value: p.color },
      ]
    }
    if (item.category === 'auto') {
      const p = item.params as AutoItemParams
      return [
        { label: 'Бренд', value: p.brand },
        { label: 'Модель', value: p.model },
        { label: 'Год выпуска', value: p.yearOfManufacture },
        {
          label: 'Трансмиссия',
          value:
            p.transmission === 'automatic'
              ? 'Автомат'
              : p.transmission === 'manual'
                ? 'Механика'
                : undefined,
        },
        { label: 'Пробег', value: p.mileage ? `${p.mileage} км` : undefined },
        { label: 'Мощность', value: p.enginePower ? `${p.enginePower} л.с.` : undefined },
      ]
    }
    if (item.category === 'real_estate') {
      const p = item.params as RealEstateItemParams
      return [
        {
          label: 'Тип',
          value:
            p.type === 'flat'
              ? 'Квартира'
              : p.type === 'house'
                ? 'Дом'
                : p.type === 'room'
                  ? 'Комната'
                  : undefined,
        },
        { label: 'Адрес', value: p.address },
        { label: 'Площадь', value: p.area ? `${p.area} м²` : undefined },
        { label: 'Этаж', value: p.floor },
      ]
    }
    return []
  }

  const params = renderParams().filter((p) => p.value != null)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.title}>{item.title}</h1>
          <Button
            type="primary"
            style={{ maxWidth: '170px' }}
            icon={<EditOutlined />}
            onClick={() => navigate(`/ads/${id}/edit`)}
          >
            Редактировать
          </Button>
        </div>
        <div className={styles.right}>
          <span className={styles.price}>
            {item.price != null ? formatPrice(item.price) : 'Цена не указана'}
          </span>
          <div className={styles.dates}>
            <span className={styles.date}>Опубликовано: {formatDate(item.createdAt)}</span>
            <span className={styles.date}>Отредактировано: {formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.imagePlaceholder}>
            <PictureOutlined className={styles.imagePlaceholderIcon} />
          </div>

          <div className={styles.contentRight}>
            {missingFields.length > 0 && <NeedsRevisionAlert fields={missingFields} />}

            {params.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Характеристики</h2>
                <div className={styles.params}>
                  {params.map((p) => (
                    <div key={p.label} className={styles.param}>
                      <span className={styles.paramLabel}>{p.label}</span>
                      <span className={styles.paramValue}>{String(p.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {item.description && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <p className={styles.description}>{item.description}</p>
          </div>
        )}

        <div className={styles.actions}>
          <Button onClick={() => navigate('/ads')}>К списку</Button>
        </div>
      </div>
    </div>
  )
}
