import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className='flex items-center gap-3 mb-6'>
      <button
        onClick={() => navigate(-1)}
        className='btn btn-icon bg-bg-secondary'
      >
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>
      </button>
      <h2 className='text-xl font-bold text-text-heading'>{title}</h2>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between py-2 text-sm'>
      <span className='text-text-muted'>{label}</span>
      <span className='font-semibold text-text-body'>{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
      <SubHeader title='프로필' />
      <Card variant='outlined' className='!p-6'>
        <ProfileRow label='이름' value={user?.name ?? ''} />
        <ProfileRow label='단지' value={user?.apartment_name ?? ''} />
        <ProfileRow
          label='동'
          value={user?.unit_dong ? `${user.unit_dong}동` : ''}
        />
        <ProfileRow
          label='호'
          value={user?.unit_ho ? `${user.unit_ho}호` : ''}
        />
        <ProfileRow label='구분' value='입주민' />
      </Card>
    </div>
  );
}
