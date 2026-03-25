// AdsListPage.tsx
import { useState } from 'react'
import { Typography, Input, Spin, Alert, Empty, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@app/store/hooks'

import { itemApi } from '@entities/item'
import { PAGE_SIZE } from '@shared/config'
import styles from './AdsListPage.module.css'
import { setPage, setSearch } from '@features/filters'
import { AdCard } from '@widgets/AdCard'
import { Filters } from '@widgets/Filters'
import { Header } from 'antd/es/layout/layout'

export const AdsListPage = () => {
  const dispatch = useAppDispatch()
  const { search, categories, needsRevision, sortColumn, sortDirection, page } = useAppSelector(
    (s) => s.filters,
  )

  const [searchInput, setSearchInput] = useState(search)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['items', { search, categories, needsRevision, sortColumn, sortDirection, page }],
    queryFn: ({ signal }) =>
      itemApi.getItems(
        {
          q: search || undefined,
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
          needsRevision: needsRevision || undefined,
          categories: categories.length ? categories : undefined,
          sortColumn: sortColumn || undefined,
          sortDirection: sortDirection || undefined,
        },
        signal,
      ),
    select: (data) => {
      if (data && data.items) {
        // Добавляем глобальный индекс (0-based) каждому элементу
        const itemsWithIndex = data.items.map((item, index) => {
          const globalIndex = (page - 1) * PAGE_SIZE + index;
          return {
            ...item,
            globalIndex,      // 0-based глобальный индекс
            tempId: globalIndex + 1, // 1-based для отображения
          };
        });
        return { ...data, items: itemsWithIndex };
      }
      return data;
    }
  })

  return (
    <>
      <Header className={styles.header}>
        <span className={styles.logoText}>Мои объявления</span>
        {data?.total != null && <span className={styles.total}>{data.total} объявлений</span>}
      </Header>

      <div className={styles.page}>
        <div className={styles.searchWrapper}>
          <Input
            className={styles.search}
            placeholder="Найти объявление..."
            suffix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={() => dispatch(setSearch(searchInput))}
            onClear={() => {
              setSearchInput('')
              dispatch(setSearch(''))
            }}
            allowClear
          />
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <Filters />
          </aside>

          <main className={styles.content}>
            {isLoading && (
              <div className={styles.loader}>
                <Spin size="large" />
              </div>
            )}

            {isError && (
              <Alert
                type="error"
                message="Ошибка загрузки"
                description="Не удалось загрузить объявления. Проверьте, запущен ли сервер."
                showIcon
              />
            )}

            {!isLoading && !isError && data?.items.length === 0 && (
              <div className={styles.empty}>
                <Empty description="Объявления не найдены" />
              </div>
            )}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <>
                <div className={styles.grid}>
                  {data.items.map((item) => (
                    <AdCard
                      key={item.globalIndex}
                      item={item}
                    />
                  ))}
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    current={page}
                    total={data.total}
                    pageSize={PAGE_SIZE}
                    onChange={(p) => dispatch(setPage(p))}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}