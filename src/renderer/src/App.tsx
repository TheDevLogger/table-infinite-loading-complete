import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DataTable from './table/data-table'

const queryClient = new QueryClient()

function App() {
  return (
    <div className="min-h-screen m-w-screen flex flex-col items-center justify-center ">
      <QueryClientProvider client={queryClient}>
        <DataTable />
      </QueryClientProvider>
    </div>
  )
}

export default App
