import { useState } from 'react';
import StatusSteps from '@/components/common/StatusSteps';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useClaims } from '@/hooks/useClaims';
import type {
  ApiClaim,
  ClaimCategory,
  ClaimStatus,
  TypeClass,
} from '@/lib/api/types';

/* ───────── API 데이터 → 표시용 변환 ───────── */

const CATEGORY_META: Record<
  ClaimCategory,
  { label: string; icon: string; color: string }
> = {
  leak: { label: '누수·침수', icon: '●', color: '#0061AF' },
  facility: { label: '균열·파손', icon: '■', color: '#00854A' },
  injury: { label: '다침·부상', icon: '◆', color: '#C9252C' },
  fire: { label: '화재 피해', icon: '▲', color: '#C9252C' },
};

const STATUS_STEP: Record<ClaimStatus, number> = {
  submitted: 1,
  classifying: 1,
  field_check_pending: 2,
  field_checking: 2,
  estimating: 3,
  estimated: 3,
  approval_pending: 3,
  approved: 4,
  paid: 4,
  denied: 2,
  appealed: 2,
};

function getStatusLabel(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    submitted: '접수완료',
    classifying: '분류중',
    field_check_pending: '현장조사 대기',
    field_checking: '현장조사중',
    estimating: '산정중',
    estimated: '산정완료',
    approval_pending: '승인대기',
    approved: '승인완료',
    paid: '지급완료',
    denied: '면책통보',
    appealed: '이의신청',
  };
  return map[status] ?? status;
}

function formatAmount(amount?: number): string | null {
  if (!amount) return null;
  return `${amount.toLocaleString('ko-KR')}원`;
}

function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}

const STEPS = ['접수', '검토', '산정', '완료'];

type Tab = 'all' | 'active' | 'done';

/* ───────── 배지 스타일 ───────── */
function typeBadge(tc: TypeClass) {
  const map = {
    A: 'border-[#C9252C] text-[#C9252C] bg-white',
    B: 'border-[#888] text-[#888] bg-white',
    C: 'border-[#00854A] text-[#00854A] bg-white',
  } as const;
  const label = { A: 'TYPE A', B: 'TYPE B', C: 'TYPE C' } as const;
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
        map[tc]
      )}
    >
      {label[tc]}
    </span>
  );
}

/* ───────── 액션 버튼 ───────── */
function ActionBtn({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className='px-3 py-1.5 rounded-full text-[12px] font-semibold border bg-white active:scale-95 transition-transform'
      style={{ borderColor: color, color }}
    >
      {label}
    </button>
  );
}

/* ───────── 필터 로직 ───────── */
function filterClaims(claims: ApiClaim[], tab: Tab): ApiClaim[] {
  if (tab === 'all') return claims;
  const doneStatuses: ClaimStatus[] = ['approved', 'paid', 'denied'];
  if (tab === 'done')
    return claims.filter((c) => doneStatuses.includes(c.status));
  return claims.filter((c) => !doneStatuses.includes(c.status));
}

/* ───────── 메인 페이지 ───────── */
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
        const meta = CATEGORY_META[claim.category];
        const statusStep = STATUS_STEP[claim.status] ?? 1;
        const isDenied = claim.status === 'denied';
        const isPaid = claim.status === 'paid';
        const amount = formatAmount(
          claim.insurance_amount_ai ?? claim.insurance_amount_final ?? undefined
        );
        const isOpen = openId === claim.id;

        return (
          <div
            key={claim.id}
            className='mb-3.5 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[var(--color-surface)] shadow-[var(--shadow-card)] cursor-pointer active:scale-[0.98] transition-transform overflow-hidden'
            onClick={() => setOpenId(isOpen ? null : claim.id)}
          >
            <div className='p-5'>
              {/* 상단: 아이콘 + 접수번호 + 유형 | 배지 + 날짜 */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className='w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]'
                    style={{ background: `${meta.color}14`, color: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div>
                    <div className='text-[13px] text-text-muted font-medium'>
                      #{claim.claim_number}
                    </div>
                    <div className='text-[15px] font-semibold text-text-body mt-0.5'>
                      {meta.label}
                    </div>
                  </div>
                </div>
                <div className='text-right flex flex-col items-end gap-1.5'>
                  {claim.type_class && typeBadge(claim.type_class)}
                  <div className='text-xs text-text-dim'>
                    {formatDate(claim.created_at)}
                  </div>
                </div>
              </div>

              {/* 진행 상태 스텝 */}
              <div className='mt-3.5 pt-3.5 border-t border-border-subtle'>
                <StatusSteps>
                  {STEPS.map((label, i) => (
                    <StatusSteps.Step
                      key={label}
                      label={label}
                      status={
                        i + 1 < statusStep
                          ? 'done'
                          : i + 1 === statusStep
                          ? 'current'
                          : 'pending'
                      }
                    />
                  ))}
                </StatusSteps>
              </div>

              {/* 현재 상태 요약 */}
              <div className='mt-2.5 flex items-center justify-between'>
                <span className='text-[13px] text-text-muted'>
                  {getStatusLabel(claim.status)}
                </span>
                <ChevronDown
                  size={16}
                  className={clsx(
                    'text-text-dim transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>

              {/* 펼쳐지는 상세 */}
              {isOpen && (
                <div className='mt-3 pt-3 border-t border-border-subtle'>
                  {claim.location_detail && (
                    <DetailRow label='위치' value={claim.location_detail} />
                  )}
                  {claim.description && (
                    <DetailRow label='피해 내용' value={claim.description} />
                  )}

                  {/* TYPE C: 금액 */}
                  {claim.type_class === 'C' && (
                    <>
                      {amount && (
                        <DetailRow
                          label='AI 산출액'
                          value={amount}
                          valueStyle={{
                            color: isPaid ? '#00854A' : '#0061AF',
                            fontWeight: 700,
                          }}
                        />
                      )}
                      {isPaid && (
                        <div className='mt-2 px-3 py-2 rounded-lg bg-[#00854A0D] text-[#00854A] text-[13px] font-semibold text-center'>
                          ✓ 지급 완료
                        </div>
                      )}
                      {claim.status === 'estimated' && amount && (
                        <div className='mt-2 px-3 py-2 rounded-lg bg-[#0061AF0D] text-[#0061AF] text-[13px] font-medium text-center'>
                          보험금 지급 대기 — {amount}
                        </div>
                      )}
                    </>
                  )}

                  {/* TYPE A: 하자소송 안내 */}
                  {claim.type_class === 'A' && (
                    <div className='mt-3 p-3 rounded-lg border border-[#C9252C33] bg-[#C9252C08]'>
                      <p className='text-[12px] text-[#C9252C] leading-relaxed'>
                        ⚠ 본 건은 시공상 하자 가능성이 있습니다. 현재 단지에서
                        하자소송이 진행 중이며, 추가 확인이 필요합니다.
                      </p>
                    </div>
                  )}

                  {/* TYPE B: 면책 */}
                  {claim.type_class === 'B' && isDenied && (
                    <div className='mt-3 p-3 rounded-lg border border-[#ddd] bg-[#f9f9f9]'>
                      <p className='text-[12px] text-text-muted leading-relaxed'>
                        면책 통보 — 사유 확인이 필요합니다.
                      </p>
                      <p className='text-[12px] text-[#C9252C] mt-1.5 font-medium'>
                        이의신청 가능
                      </p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {claim.type_class === 'A' && (
                      <>
                        <ActionBtn label='추가 질의' color='#0061AF' />
                        <ActionBtn label='변호사 의견서 요청' color='#00854A' />
                      </>
                    )}
                    {claim.type_class === 'B' && isDenied && (
                      <>
                        <ActionBtn label='이의신청' color='#C9252C' />
                        <ActionBtn label='변호사 의견서 요청' color='#00854A' />
                      </>
                    )}
                    {claim.type_class === 'C' && statusStep < 3 && (
                      <ActionBtn label='관리소 방문 요청' color='#0061AF' />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── 상세 행 ───────── */
function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className='flex justify-between py-1.5 text-sm'>
      <span className='text-text-muted shrink-0'>{label}</span>
      <span
        className='font-medium text-text-body text-right ml-4'
        style={valueStyle}
      >
        {value}
      </span>
    </div>
  );
}
