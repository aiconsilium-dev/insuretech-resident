import { useState } from 'react';
import clsx from 'clsx';
import { useClaims } from '@/hooks/useClaims';
import type { Tab } from './types';
import { filterClaims } from './utils';
import ClaimCard from './claim-list/ClaimCard';

export default function HistoryPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('all');

  const { data, isLoading, isError } = useClaims();
  const allClaims = data?.items ?? [];
  const filtered = filterClaims(allClaims, tab);

  return (
    <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
      {/* 헤더 */}
      <div className='mb-5'>
        <h1 className='text-[22px] font-bold text-text-heading tracking-[-0.02em]'>
          접수 내역
        </h1>
        <p className='text-sm text-text-muted mt-1'>총 {allClaims.length}건</p>
      </div>

      {/* 탭 필터 */}
      <div className='flex gap-2 mb-5'>
        {(
          [
            ['all', '전체'],
            ['active', '진행중'],
            ['done', '완료'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type='button'
            onClick={() => {
              setTab(key);
              setOpenId(null);
            }}
            className={clsx(
              'px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors',
              tab === key
                ? 'bg-[#0061AF] text-white border-[#0061AF]'
                : 'bg-white text-text-muted border-[#ddd]'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 로딩 / 에러 */}
      {isLoading && (
        <div className='flex justify-center py-12'>
          <div className='w-6 h-6 rounded-full border-2 border-[#0061AF] border-t-transparent animate-spin' />
        </div>
      )}
      {isError && (
        <p className='text-center text-danger text-sm py-12'>
          데이터를 불러오지 못했습니다.
        </p>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className='text-center text-text-muted text-sm py-12'>
          해당 내역이 없습니다.
        </p>
      )}

      {filtered.map((claim) => {
        const isOpen = openId === claim.id;
        return (
          <ClaimCard
            key={claim.id}
            claim={claim}
            isOpen={isOpen}
            onToggle={() => setOpenId(isOpen ? null : claim.id)}
          />
        );
      })}
    </div>
  );
}
