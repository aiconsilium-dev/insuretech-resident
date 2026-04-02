import { useAuthStore } from '@/stores/authStore';
import List from '@/components/common/List';
import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  {
    symbol: '◆',
    label: '보험안내',
    desc: '내가 받을 수 있는 보상 확인',
    route: '/insurance-info',
    iconBg: 'rgba(0,133,74,0.1)',
    iconColor: '#00854A',
  },
  {
    symbol: '─',
    label: '서류관리',
    desc: '건축물대장, 등기부등본 제출',
    route: '/documents',
    iconBg: 'rgba(0,97,175,0.1)',
    iconColor: '#0061AF',
  },
  {
    symbol: '●',
    label: '프로필',
    desc: '내 정보 확인',
    route: '/profile',
    iconBg: 'rgba(0,133,74,0.1)',
    iconColor: '#00854A',
  },
];

export default function MorePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className='animate-[fadeIn_0.25s_ease] pb-24'>
      {/* 프로필 — DB Green 배경 카드 */}
      <div
        className='px-[var(--space-page)] pt-[var(--space-page)] pb-8 text-center'
        style={{
          background: 'linear-gradient(135deg, #00854A 0%, #009559 100%)',
        }}
      >
        <div className='w-[72px] h-[72px] rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3.5 text-3xl font-bold text-white'>
          {user?.name.charAt(0) ?? '?'}
        </div>
        <div className='text-xl font-bold text-white mb-1'>{user?.name}</div>
        <div className='text-sm text-white/75'>
          {user?.apartment_name} {user?.unit_dong}동 {user?.unit_ho}호
        </div>
      </div>

      {/* Menu */}
      <div className='px-[var(--space-page)] pt-5'>
        <List className='border border-border'>
          {MENU_ITEMS.map((item) => (
            <List.Item key={item.route} onClick={() => navigate(item.route)}>
              <div
                className='w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 text-base'
                style={{ background: item.iconBg, color: item.iconColor }}
              >
                {item.symbol}
              </div>
              <div className='flex-1'>
                <h4 className='text-[15px] font-semibold text-text-body mb-0.5'>
                  {item.label}
                </h4>
                <p className='text-[13px] text-text-muted'>{item.desc}</p>
              </div>
              <svg
                className='text-text-dim'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <polyline points='9 18 15 12 9 6' />
              </svg>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
}
