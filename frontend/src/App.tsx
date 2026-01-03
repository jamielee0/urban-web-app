import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Scenarios from './pages/Scenarios';
import PolicySimulation from './pages/PolicySimulation';
import Analytics from './pages/Analytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/policy" element={<PolicySimulation />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

