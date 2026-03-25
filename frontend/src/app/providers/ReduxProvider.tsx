import { Provider } from 'react-redux'
import { store } from '@app/store'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const ReduxProvider = ({ children }: Props) => (
  <Provider store={store}>{children}</Provider>
)