import { useEffect } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMe } from '@/hooks/useMe';
import { getCookieToken } from '@/lib/api/client';
import { queryClient } from '@/lib/queryClient';
import { logout } from '@/lib/api/auth';
import BottomTabBar from '@/components/layout/BottomTabBar';
import HomePage from '@/pages/home';
import ClaimPage from '@/pages/claim';
import HistoryPage from '@/pages/history';
import MorePage from '@/pages/more';
import ProfilePage from '@/pages/more/profile';
import InsuranceInfoPage from '@/pages/more/insurance-info';
import DocumentsPage from '@/pages/more/documents';
import LoginPage from '@/pages/login';
import SignupPage from '@/pages/signup';

const NO_TAB_ROUTES = ['/login', '/signup'];

function AppContent() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const location = useLocation();

  // 앱 초기 로드 시 쿠키 토큰으로 세션 복원
  useMe();

  // 세션 만료 이벤트 처리 (client.ts에서 dispatch)
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch {
        // 무시
      }
      document.cookie =
        'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      queryClient.clear();
      clearAuth();
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [clearAuth]);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  const hasToken = !!getCookieToken('access_token');

  if (!isAuthenticated && !hasToken && !isAuthPage) {
    return <Navigate to='/login' replace />;
  }

  const showTabBar =
    (isAuthenticated || hasToken) &&
    !NO_TAB_ROUTES.some((p) => location.pathname.startsWith(p));

  return (
    <div className='max-w-[430px] mx-auto min-h-dvh flex flex-col relative overflow-x-hidden bg-bg'>
      <div className='flex-1'>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/claim' element={<ClaimPage />} />
          <Route path='/myclaims' element={<HistoryPage />} />
          <Route path='/more' element={<MorePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/insurance-info' element={<InsuranceInfoPage />} />
          <Route path='/documents' element={<DocumentsPage />} />
        </Routes>
      </div>
      {showTabBar && <BottomTabBar />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
