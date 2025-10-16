import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/home/Home'
import { Layout } from '@/layout/Layout'
import { BASE_ROOT, DM } from '@/store/directory/directory'

export const AppRoutes = () => {
  return <>
    <BrowserRouter basename={BASE_ROOT}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={DM.TOP} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
}
