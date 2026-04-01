import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Home, FilePlus, History, MoreHorizontal } from 'lucide-react';

const TABS = [
  { path: '/', label: '홈', icon: <Home /> },
  { path: '/claim', label: '보험접수', icon: <FilePlus /> },
  { path: '/myclaims', label: '내 접수', icon: <History /> },
  { path: '/more', label: '더보기', icon: <MoreHorizontal /> },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={clsx('tab-item', { 'active': location.pathname === tab.path })}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
