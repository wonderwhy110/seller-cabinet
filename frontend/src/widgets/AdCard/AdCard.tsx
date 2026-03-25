import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PictureOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import type { ItemListItem } from '@shared/types'
import { CATEGORY_LABELS, formatPrice, getItemIdByTitle } from '@shared/lib'
import styles from './AdCard.module.css'

interface Props {
  item: ItemListItem
}

export const AdCard = ({ item }: Props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const id = await getItemIdByTitle(item.title)
    setLoading(false)
    if (id) navigate(`/ads/${id}`)
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <div className={styles.imagePlaceholder}>
            <PictureOutlined className={styles.imagePlaceholderIcon} />
          </div>

          <div className={styles.body}>
            <div className={styles.top}>
              <span className={styles.category}>{CATEGORY_LABELS[item.category]}</span>
            </div>
            <p className={styles.title}>{item.title}</p>
            <p className={styles.price}>
              {item.price != null ? formatPrice(item.price) : 'Цена не указана'}
            </p>
            {item.needsRevision && <span className={styles.badge}>· Требует доработок</span>}
          </div>
        </>
      )}
    </div>
  )
}
