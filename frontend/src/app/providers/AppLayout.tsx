import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { useQuery } from '@tanstack/react-query'
import { itemApi } from '@entities/item'

const { Header, Content } = Layout

export const AppLayout = () => { 

    const { data } = useQuery({
    queryKey: ['items-total'],
    queryFn: () => itemApi.getItems({ limit: 1, skip: 0 }),
  })
  
  return(
      <Layout style={{ minHeight: '100vh' }}>
    
    <Content className={styles.content}>
      <Outlet />
    </Content>
  </Layout>

  )

}