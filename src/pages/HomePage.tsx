import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useClaims } from '@/hooks/useClaims';
import { useNotifications } from '@/hooks/useNotifications';
import type { ClaimStatus } from '@/lib/api/types';

const ACTIVE_STATUSES: ClaimStatus[] = [
  'submitted',
  'classifying',
  'field_check_pending',
  'field_checking',
  'estimating',
  'estimated',
  'approval_pending',
];

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data: claimsData } = useClaims();
  const { data: notificationsData } = useNotifications();

  const claims = claimsData?.items ?? [];
  const notifications = notificationsData?.items ?? [];
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  const submittedCount = claims.filter((c) =>
    ['submitted', 'classifying'].includes(c.status)
  ).length;
  const reviewingCount = claims.filter((c) =>
    [
      'field_check_pending',
      'field_checking',
      'estimating',
      'estimated',
      'approval_pending',
    ].includes(c.status)
  ).length;
  const pendingCount = claims.filter((c) => c.status === 'appealed').length;
  const activeCount = claims.filter((c) =>
    ACTIVE_STATUSES.includes(c.status)
  ).length;

  const latestNotification = notifications[0];

  return (
    <div className='animate-[fadeIn_0.25s_ease] pb-24'>
      {/* 상단 인사말 + 알림 아이콘 */}
      <div className='px-[var(--space-page)] pt-[var(--space-page)] pb-2 flex items-start justify-between'>
        <div>
          <p className='text-[13px] text-text-muted mb-0.5'>
            {user?.apartment_name} {user?.unit_dong}동 {user?.unit_ho}호
          </p>
          <h1 className='text-[20px] font-bold text-text-heading tracking-[-0.02em]'>
            {user?.name}님, 안녕하세요
          </h1>
        </div>
        <div className='w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center mt-1 relative'>
          <span className='text-text-muted text-sm'>●</span>
          {unreadNotifications.length > 0 && (
            <span className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#C9252C] border-2 border-white' />
          )}
        </div>
      </div>

      <div className='px-[var(--space-page)] pt-3'>
        {/* 간편 보험 접수 — 메인 CTA */}
        <Card
          className='mb-3 cursor-pointer transition-all hover:-translate-y-0.5'
          onClick={() => navigate('/claim')}
        >
          <Card.Body className='!py-4 flex items-center gap-3.5'>
            <div
              className='w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0'
              style={{ background: 'rgba(201,37,44,0.08)' }}
            >
              <span className='text-[#C9252C] text-lg'>◆</span>
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-[15px] font-bold text-text-heading'>
                간편 보험 접수
              </h3>
              <p className='text-[12px] text-text-muted mt-0.5'>
                AI가 피해를 즉시 분석합니다
              </p>
            </div>
            <span className='text-text-dim text-sm'>→</span>
          </Card.Body>
        </Card>

        {/* 내 보험 현황 카드 */}
        <Card className='mb-3' onClick={() => navigate('/myclaims')}>
          <Card.Body className='!py-4 !px-4'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-[13px] font-semibold text-text-body'>
                내 보험 현황
              </span>
              <span className='text-[12px] text-text-dim cursor-pointer'>
                전체 {activeCount}건 →
              </span>
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <StatusBox
                label='접수완료'
                count={submittedCount}
                color='#00854A'
              />
              <StatusBox
                label='심사중'
                count={reviewingCount}
                color='#0061AF'
              />
              <StatusBox
                label='보완요청'
                count={pendingCount}
                color='#C9252C'
              />
            </div>
          </Card.Body>
        </Card>

        {/* 빠른 메뉴 4칸 */}
        <div className='text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-5'>
          바로가기
        </div>
        <div className='grid grid-cols-4 gap-3 mb-4'>
          <QuickMenuItem
            symbol='◆'
            label='보험접수'
            onClick={() => navigate('/claim')}
            color='#C9252C'
          />
          <QuickMenuItem
            symbol='■'
            label='접수현황'
            onClick={() => navigate('/myclaims')}
            color='#00854A'
          />
          <QuickMenuItem
            symbol='●'
            label='보험안내'
            onClick={() => navigate('/insurance-info')}
            color='#0061AF'
          />
          <QuickMenuItem
            symbol='─'
            label='관리소 요청'
            onClick={() => navigate('/more')}
            color='#00854A'
          />
        </div>

        {/* 우리 단지 정보 */}
        <div className='text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em] mb-2.5 mt-2'>
          우리 단지
        </div>
        <div className='grid grid-cols-2 gap-2.5 mb-3'>
          <Card variant='outlined'>
            <Card.Body className='!py-3.5 !px-3.5'>
              <div className='text-[11px] text-text-dim mb-1'>가입 보험</div>
              <div className='text-[15px] font-bold text-text-heading'>
                화재·배상
              </div>
              <div className='text-[11px] text-text-muted mt-0.5'>
                DB손해보험
              </div>
            </Card.Body>
          </Card>
          <Card variant='outlined'>
            <Card.Body className='!py-3.5 !px-3.5'>
              <div className='text-[11px] text-text-dim mb-1'>
                하자담보 만료
              </div>
              <div className='text-[15px] font-bold text-text-heading'>
                D-847
              </div>
              <div className='text-[11px] text-[#C9252C] mt-0.5 font-medium'>
                2028.07.15 만료
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* 최근 알림 */}
        {latestNotification && (
          <Card variant='outlined' className='mb-3'>
            <Card.Body className='!py-3 flex items-center gap-3'>
              {latestNotification.is_read ? (
                <Badge variant='info' className='shrink-0 !text-[10px]'>
                  알림
                </Badge>
              ) : (
                <span className='shrink-0 w-2 h-2 rounded-full bg-[#0061AF]' />
              )}
              <span className='text-[13px] text-text-body truncate'>
                {latestNotification.title}
              </span>
              <span className='text-[11px] text-text-dim shrink-0 ml-auto'>
                {new Date(latestNotification.created_at)
                  .toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace('. ', '.')
                  .replace('.', '')}
              </span>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatusBox({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className='rounded-[10px] border border-[var(--color-border)] py-3 text-center'>
      <div
        className='text-[20px] font-bold tracking-[-0.5px]'
        style={{ color: count > 0 ? color : 'var(--color-text-dim)' }}
      >
        {count}
      </div>
      <div className='text-[11px] text-text-muted mt-0.5'>{label}</div>
    </div>
  );
}

function QuickMenuItem({
  symbol,
  label,
  onClick,
  color,
}: {
  symbol: string;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <div className='text-center cursor-pointer' onClick={onClick}>
      <div
        className='w-12 h-12 rounded-[14px] border border-[var(--color-border)] flex items-center justify-center text-lg mx-auto mb-1.5 bg-white transition-transform hover:scale-105'
        style={{ color }}
      >
        {symbol}
      </div>
      <span className='block text-[11px] font-medium text-text-muted'>
        {label}
      </span>
    </div>
  );
}
