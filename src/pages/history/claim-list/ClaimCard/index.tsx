import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import StatusSteps from '@/components/common/StatusSteps';
import type { ApiClaim } from '@/lib/api/types';
import { CATEGORY_META, STATUS_STEP, STEPS } from '../../constants';
import { getStatusLabel, formatAmount, formatDate } from '../../utils';
import TypeBadge from '../TypeBadge';
import ActionBtn from '../ActionBtn';
import DetailRow from '../DetailRow';

interface ClaimCardProps {
  claim: ApiClaim;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ClaimCard({ claim, isOpen, onToggle }: ClaimCardProps) {
  const meta = CATEGORY_META[claim.category];
  const statusStep = STATUS_STEP[claim.status] ?? 1;
  const isDenied = claim.status === 'denied';
  const isPaid = claim.status === 'paid';
  const amount = formatAmount(
    claim.insurance_amount_ai ?? claim.insurance_amount_final ?? undefined
  );

  return (
    <div
      className='mb-3.5 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[var(--color-surface)] shadow-[var(--shadow-card)] cursor-pointer active:scale-[0.98] transition-transform overflow-hidden'
      onClick={onToggle}
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
            {claim.type_class && <TypeBadge tc={claim.type_class} />}
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
}
