import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { AdsListPage } from '@pages/AdsListPage'
import { AdViewPage } from '@pages/AdViewPage'
import { AdEditPage } from '@pages/AdEditPage'

export const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/ads" replace />} />
        <Route path="ads" element={<AdsListPage />} />
        <Route path="ads/:id" element={<AdViewPage />} />

<Route path="ads/:id/edit" element={<AdEditPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
