import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Создаём клиент один раз — вне компонента!
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,           // повторять запрос 1 раз при ошибке
      staleTime: 30_000,  // данные свежие 30 секунд
    },
  },
})

interface Props {
  children: ReactNode
}

export const QueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)