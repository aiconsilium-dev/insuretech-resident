import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import BottomTabBar from '@/components/layout/BottomTabBar';
import HomePage from '@/pages/HomePage';
import ClaimPage from '@/pages/ClaimPage';
import HistoryPage from '@/pages/HistoryPage';
import MorePage from '@/pages/MorePage';
import ProfilePage from '@/pages/ProfilePage';
import InsuranceInfoPage from '@/pages/InsuranceInfoPage';
import DocumentsPage from '@/pages/DocumentsPage';

function AppContent() {
  const location = useLocation();
  const noTabBar = ['/claim'];

  return (
    <div className="max-w-[430px] mx-auto min-h-dvh flex flex-col relative overflow-x-hidden bg-bg">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/claim" element={<ClaimPage />} />
          <Route path="/myclaims" element={<HistoryPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/insurance-info" element={<InsuranceInfoPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
        </Routes>
      </div>
      {!noTabBar.some(path => location.pathname.startsWith(path)) && <BottomTabBar />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
