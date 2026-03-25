import { Checkbox, Switch, Button, Collapse } from 'antd'
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@app/store/hooks'
import { setCategories, setNeedsRevision, resetFilters } from '@features/filters'
import { CATEGORY_OPTIONS } from '@shared/lib'
import type { Category } from '@shared/types'
import styles from './Filters.module.css'

export const Filters = () => {
  const dispatch = useAppDispatch()
  const { categories, needsRevision } = useAppSelector((s) => s.filters)

  const handleCategoryChange = (value: Category, checked: boolean) => {
    if (checked) {
      dispatch(setCategories([...categories, value]))
    } else {
      dispatch(setCategories(categories.filter((c) => c !== value)))
    }
  }

  return (
    <>
      <div className={styles.card}>
        <p className={styles.title}>Фильтры</p>

        <Collapse
          defaultActiveKey={['categories']}
          ghost
          expandIconPosition="end"
          items={[
            {
              key: 'categories',
              label: <span className={styles.sectionTitle}>Категория</span>,
              children: (
                <div className={styles.checkboxGroup}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <Checkbox
                      key={opt.value}
                      checked={categories.includes(opt.value as Category)}
                      onChange={(e) =>
                        handleCategoryChange(opt.value as Category, e.target.checked)
                      }
                    >
                      {opt.label}
                    </Checkbox>
                  ))}
                </div>
              ),
            },
          ]}
        />

        <hr className={styles.divider} />

        <div className={styles.switch}>
          <span className={styles.switchLabel}>Только требующие доработки</span>
          <Switch checked={needsRevision} onChange={(val) => dispatch(setNeedsRevision(val))} />
        </div>
      </div>

      <Button
        icon={<ReloadOutlined />}
        className={styles.resetBtn}
        onClick={() => dispatch(resetFilters())}
      >
        Сбросить фильтры
      </Button>
    </>
  )
}
