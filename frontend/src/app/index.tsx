import { ConfigProvider, App as AntApp } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { ReduxProvider } from './providers/ReduxProvider'
import { QueryProvider } from './providers/QueryProvider'
import './styles/global.css'
import { RouterProvider } from './providers'
import { useEffect } from 'react'
import { initItemCache } from '@shared/lib'

export const App = () => {

    useEffect(() => {
    // Инициализируем кэш при загрузке приложения
    initItemCache().catch(console.error)
  }, [])

  return(
  <ReduxProvider>
    <QueryProvider>
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorPrimary: '#00aaff',
          },
        }}
      >
        <AntApp>
          <RouterProvider />
        </AntApp>
      </ConfigProvider>
    </QueryProvider>
  </ReduxProvider>
  )
}