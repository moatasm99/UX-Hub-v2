import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Analytics />
    </AppProviders>
  )
}

export default App
