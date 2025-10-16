import { useEffect } from 'react'
import { AppRoutes } from './routes/routes'
import StoreProvider from './store/provider'
import { initUtm } from './hooks/useUtm/initUtm'

function App() {
  useEffect(() => {
    initUtm()
  }, [])

  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  )
}

export default App
