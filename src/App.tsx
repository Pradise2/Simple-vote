import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProposalPage from './pages/ProposalPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/proposal/:id" element={<ProposalPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
