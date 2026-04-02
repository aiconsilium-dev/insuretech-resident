import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCreateClaim } from '@/hooks/useCreateClaim';
import type { ApiEstimation } from '@/lib/api/types';
import StepIndicator from '@/components/common/StepIndicator';
import PhotoCaptureGroup from '@/components/common/PhotoCaptureGroup';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import type { ClaimType } from './types';
import {
  CLAIM_TYPES,
  DEFECT_TYPES,
  LEAK_LOCATIONS,
  LEAK_CAUSES,
  LEAK_DAMAGES,
  INJURY_TYPES,
  INJURY_PLACES,
  TREATMENT_STATUS,
  FIRE_TYPES,
  FIRE_DAMAGE_SCOPE,
  FACILITY_ESTIMATION,
  LEAK_DAMAGE_COSTS,
  NEXT_STEPS,
} from './constants';
import {
  mergeClaimWizardHistoryState,
  isClaimWizardHistoryState,
  isClaimTypeValue,
} from './utils';

/* ─── 공용 컴포넌트: 뒤로가기 헤더 ─── */
function BackHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className='flex items-center gap-3 mb-6'>
      <button onClick={onBack} className='btn btn-icon bg-bg-secondary'>
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

/* ─── 공용 컴포넌트: 섹션 라벨 ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className='block text-sm font-semibold text-text-body mb-2'>
      {children}
    </label>
  );
}

/* ─── 공용 컴포넌트: 선택 그리드 (2열) ─── */
function SelectGrid({
  items,
  selected,
  onSelect,
  color,
}: {
  items: { id: string; label: string; desc?: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  color: string;
}) {
  return (
    <div className='grid grid-cols-2 gap-2.5'>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={clsx(
            'card border py-3.5 px-4 cursor-pointer transition-all text-center',
            selected === item.id
              ? `border-[${color}]`
              : 'border-border hover:border-text-dim'
          )}
          style={
            selected === item.id
              ? { borderColor: color, backgroundColor: `${color}0D` }
              : {}
          }
        >
          <h4 className='text-[14px] font-semibold text-text-body'>
            {item.label}
          </h4>
          {item.desc && (
            <p className='text-[12px] text-text-muted mt-0.5'>{item.desc}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── 공용 컴포넌트: 단일 선택 버튼 목록 ─── */
function OptionButtons({
  options,
  selected,
  onSelect,
  color,
}: {
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
  color: string;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={clsx(
            'px-4 py-2.5 rounded-full text-sm font-medium border transition-all',
            selected === opt
              ? 'text-white'
              : 'border-border text-text-body hover:border-text-dim'
          )}
          style={
            selected === opt
              ? { backgroundColor: color, borderColor: color }
              : {}
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── 공용 컴포넌트: 멀티 선택 체크리스트 ─── */
function CheckList({
  options,
  selected,
  onToggle,
  color,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  color: string;
}) {
  return (
    <div className='flex flex-col gap-2'>
      {options.map((opt) => (
        <label
          key={opt}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] border cursor-pointer transition-all',
            selected.includes(opt) ? '' : 'border-border hover:border-text-dim'
          )}
          style={
            selected.includes(opt)
              ? { borderColor: color, backgroundColor: `${color}0D` }
              : {}
          }
        >
          <input
            type='checkbox'
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className='w-4.5 h-4.5 accent-[#171717] shrink-0'
          />
          <span className='text-sm text-text-body'>{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* ─── 숫자 포맷 ─── */
function fmt(n: number) {
  return n.toLocaleString('ko-KR');
}

/* ─── AI 피해 산정 최소 표시 시간 ─── */
const MIN_AI_SKELETON_MS = 2000;

/* ─── AI 피해 산정 중 스켈레톤 UI ─── */
function AIEstimateSkeleton({
  accentColor,
  title,
  subtitle,
}: {
  accentColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className='card border p-5'>
      <div className='flex items-center gap-3 mb-5'>
        <div
          className='w-9 h-9 rounded-full shrink-0 animate-pulse'
          style={{ backgroundColor: `${accentColor}28` }}
        />
        <div className='flex-1 space-y-2'>
          <div className='h-4 rounded-md bg-bg-secondary animate-pulse w-[55%]' />
          <div className='h-3 rounded-md bg-bg-secondary animate-pulse w-[40%]' />
        </div>
      </div>

      <div className='space-y-2.5 mb-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='flex gap-3 items-center'>
            <div className='h-10 flex-1 rounded-lg bg-bg-secondary animate-pulse' />
            <div className='h-10 w-20 rounded-lg bg-bg-secondary animate-pulse' />
          </div>
        ))}
      </div>

      <div className='space-y-2 pt-3 border-t border-border'>
        <div className='h-3 rounded bg-bg-secondary animate-pulse w-full' />
        <div className='h-3 rounded bg-bg-secondary animate-pulse w-[85%]' />
        <div className='h-4 rounded bg-bg-secondary animate-pulse w-[45%] mt-2' />
      </div>

      <div className='flex flex-col items-center gap-2 mt-5'>
        <div
          className='w-7 h-7 border-2 rounded-full animate-spin border-t-transparent'
          style={{
            borderColor: `${accentColor}66`,
            borderTopColor: 'transparent',
          }}
        />
        <p className='text-sm font-semibold text-text-heading'>{title}</p>
        <p className='text-xs text-text-muted text-center'>{subtitle}</p>
      </div>
    </div>
  );
}

function buildFacilityEstimation(defectType: string): ApiEstimation | null {
  const data = FACILITY_ESTIMATION[defectType];
  if (!data) return null;
  return {
    estimation_id: 'local-mock',
    claim_id: 'pending',
    version: 1,
    items: data.items.map((it) => {
      const m = it.qty.trim().match(/^([\d.]+)(.*)/);
      const quantity = m ? parseFloat(m[1]) : 1;
      const unit = m ? m[2].trim() : it.qty;
      return {
        work_type: it.name,
        unit,
        quantity,
        unit_price: it.unitPrice,
        amount: it.total,
      };
    }),
    total_damage: data.damageTotal,
    deductible: data.deductible,
    insurance_amount: data.insurance,
    is_ai_generated: true,
    created_at: new Date().toISOString(),
  };
}

/* ─── AI 분석 + 적산 결과 (균열·파손) — 로컬 목업, 추후 전용 API 연동 ─── */
function FacilityAIResult({
  defectType,
  defectLocation,
  onReady,
  skipSkeleton,
}: {
  defectType: string;
  defectLocation: string;
  onReady: () => void;
  skipSkeleton?: boolean;
}) {
  const [estimation, setEstimation] = useState<ApiEstimation | null>(() =>
    skipSkeleton ? buildFacilityEstimation(defectType) : null
  );

  useEffect(() => {
    if (skipSkeleton) return;
    let cancelled = false;
    const data = FACILITY_ESTIMATION[defectType];
    const timer = setTimeout(() => {
      if (cancelled || !data) {
        if (!cancelled) onReady();
        return;
      }
      const est = buildFacilityEstimation(defectType);
      if (est) setEstimation(est);
      onReady();
    }, MIN_AI_SKELETON_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defectType, skipSkeleton]);

  const defectLabel =
    DEFECT_TYPES.find((d) => d.id === defectType)?.label ?? defectType;

  if (!estimation) {
    return (
      <AIEstimateSkeleton
        accentColor='#00854A'
        title='AI 하자 분석 중'
        subtitle='사진과 정보를 확인하는 데 시간이 조금 걸릴 수 있습니다'
      />
    );
  }

  return (
    <div className='card border p-5'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-8 h-8 rounded-full bg-[#00854A] flex items-center justify-center'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2.5'
          >
            <polyline points='20 6 9 17 4 12' />
          </svg>
        </div>
        <h3 className='text-base font-bold text-text-heading'>AI 분석 결과</h3>
      </div>

      <div className='space-y-2 mb-4'>
        <div className='flex justify-between items-center py-2 border-b border-border-subtle'>
          <span className='text-sm text-text-muted'>하자 분류</span>
          <span className='text-sm font-semibold text-text-heading'>
            {defectLabel}
          </span>
        </div>
        <div className='flex justify-between items-center py-2 border-b border-border-subtle'>
          <span className='text-sm text-text-muted'>위치</span>
          <span className='text-sm font-semibold text-text-heading'>
            {defectLocation}
          </span>
        </div>
      </div>

      <div className='bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4'>
        <h4 className='text-xs font-bold text-text-muted uppercase tracking-wider mb-3'>
          공종별 적산
        </h4>
        <div className='space-y-2'>
          {estimation.items.map((item, i) => (
            <div key={i} className='flex items-center justify-between text-sm'>
              <div className='flex-1'>
                <span className='text-text-body'>{item.work_type}</span>
                <span className='text-text-muted ml-1.5 text-xs'>
                  {item.quantity}
                  {item.unit} × @{fmt(item.unit_price)}
                </span>
              </div>
              <span className='font-medium text-text-heading tabular-nums'>
                {fmt(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-2 pt-2 border-t border-border'>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>손해액 합계</span>
          <span className='font-semibold text-text-heading'>
            {fmt(estimation.total_damage)}원
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>자기부담금</span>
          <span className='text-text-dim'>-{fmt(estimation.deductible)}원</span>
        </div>
        <div className='flex justify-between text-base pt-2 border-t border-border'>
          <span className='font-bold text-text-heading'>예상 보험금</span>
          <span className='font-bold text-[#00854A] text-lg'>
            {fmt(estimation.insurance_amount)}원
          </span>
        </div>
      </div>

      <p className='text-xs text-text-muted mt-4 text-center'>
        ※ 현장조사 후 최종 확정됩니다
      </p>
    </div>
  );
}

/* ─── AI 적산 결과 (누수) — 2초 스켈레톤 래퍼 포함 ─── */
function LeakAIResultWithSkeleton({
  leakDamages,
  onReady,
  skipSkeleton,
}: {
  leakDamages: string[];
  onReady: () => void;
  skipSkeleton?: boolean;
}) {
  const [ready, setReady] = useState(() => !!skipSkeleton);

  useEffect(() => {
    if (skipSkeleton) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        setReady(true);
        onReady();
      }
    }, MIN_AI_SKELETON_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSkeleton]);

  if (!ready) {
    return (
      <AIEstimateSkeleton
        accentColor='#0061AF'
        title='AI 피해 산정 중'
        subtitle='피해 범위를 확인하고 적산을 계산하고 있습니다'
      />
    );
  }

  return <LeakAIResult leakDamages={leakDamages} />;
}

/* ─── AI 적산 결과 (누수) ─── */
function LeakAIResult({ leakDamages }: { leakDamages: string[] }) {
  const allItems: {
    name: string;
    qty: string;
    unitPrice: number;
    total: number;
  }[] = [];
  let damageTotal = 0;

  for (const dmg of leakDamages) {
    const cost = LEAK_DAMAGE_COSTS[dmg];
    if (cost) {
      allItems.push(...cost.items);
      damageTotal += cost.subtotal;
    }
  }

  const deductible = 100000;
  const insurance = Math.max(0, damageTotal - deductible);

  return (
    <div className='card border p-5'>
      {/* 헤더 */}
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-8 h-8 rounded-full bg-[#0061AF] flex items-center justify-center'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2.5'
          >
            <polyline points='20 6 9 17 4 12' />
          </svg>
        </div>
        <h3 className='text-base font-bold text-text-heading'>
          AI 피해 산정 결과
        </h3>
      </div>

      {/* 피해범위별 적산 */}
      <div className='bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4'>
        <h4 className='text-xs font-bold text-text-muted uppercase tracking-wider mb-3'>
          피해범위별 적산
        </h4>
        <div className='space-y-2'>
          {allItems.map((item, i) => (
            <div key={i} className='flex items-center justify-between text-sm'>
              <div className='flex-1'>
                <span className='text-text-body'>{item.name}</span>
                <span className='text-text-muted ml-1.5 text-xs'>
                  {item.qty} × @{fmt(item.unitPrice)}
                </span>
              </div>
              <span className='font-medium text-text-heading tabular-nums'>
                {fmt(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 금액 요약 */}
      <div className='space-y-2 pt-2 border-t border-border'>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>손해액 합계</span>
          <span className='font-semibold text-text-heading'>
            {fmt(damageTotal)}원
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-text-muted'>자기부담금</span>
          <span className='text-text-dim'>-{fmt(deductible)}원</span>
        </div>
        <div className='flex justify-between text-base pt-2 border-t border-border'>
          <span className='font-bold text-text-heading'>예상 보험금</span>
          <span className='font-bold text-[#0061AF] text-lg'>
            {fmt(insurance)}원
          </span>
        </div>
      </div>

      <p className='text-xs text-text-muted mt-4 text-center'>
        ※ 현장 누수원인 조사 후 최종 확정됩니다
      </p>
    </div>
  );
}

/* ─── Step 2: 신체손해·화재 — 2초 스켈레톤 + 요약 + 접수 확정 ─── */
function InjuryFireStep2({
  accentColor,
  title,
  description,
  note,
  isConfirming,
  onBack,
  onConfirm,
  aiAnalysisDone,
  onReady,
  skipInitialSkeleton,
}: {
  accentColor: string;
  title: string;
  description: string;
  note: string;
  isConfirming: boolean;
  onBack: () => void;
  onConfirm: () => void;
  aiAnalysisDone: boolean;
  onReady: () => void;
  skipInitialSkeleton?: boolean;
}) {
  useEffect(() => {
    if (skipInitialSkeleton) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) onReady();
    }, MIN_AI_SKELETON_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipInitialSkeleton]);

  const showSkeleton = !skipInitialSkeleton && !aiAnalysisDone;

  return (
    <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
      <BackHeader onBack={onBack} title='간편 보험 접수' />
      {/* <h1 className='text-[22px] font-bold text-text-heading tracking-[-0.02em]'>
        간편 보험 접수
      </h1> */}
      <StepIndicator total={3} current={2} />

      {showSkeleton ? (
        <AIEstimateSkeleton
          accentColor={accentColor}
          title='접수 내용 확인 중'
          subtitle='입력하신 정보를 검토하고 있습니다'
        />
      ) : (
        <div className='card border p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center'
              style={{ backgroundColor: accentColor }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='white'
                strokeWidth='2.5'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
            </div>
            <h3 className='text-base font-bold text-text-heading'>{title}</h3>
          </div>

          <div className='bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4'>
            <p className='text-sm text-text-body leading-relaxed'>
              {description}
            </p>
          </div>

          <div
            className='flex gap-2.5 p-4 rounded-[var(--radius-card)] mb-2'
            style={{
              backgroundColor: `${accentColor}0D`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke={accentColor}
              strokeWidth='2'
              className='shrink-0 mt-0.5'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='8' x2='12' y2='12' />
              <line x1='12' y1='16' x2='12.01' y2='16' />
            </svg>
            <p className='text-xs text-text-muted leading-relaxed'>{note}</p>
          </div>
        </div>
      )}

      {aiAnalysisDone && (
        <button
          className='btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold'
          style={{ backgroundColor: accentColor }}
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {isConfirming ? '처리 중...' : '접수 확정하기'}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Step 1 폼 — 부모(ClaimPage) 상태를 props로 받음
   ═══════════════════════════════════════ */

interface FacilityFormProps {
  defectType: string | null;
  defectLocation: string | null;
  photos: string[];
  desc: string;
  onDefectType: (v: string | null) => void;
  onDefectLocation: (v: string | null) => void;
  onPhotos: (v: string[]) => void;
  onDesc: (v: string) => void;
  onSubmit: () => void;
}
function FacilityForm({
  defectType,
  defectLocation,
  photos,
  desc,
  onDefectType,
  onDefectLocation,
  onPhotos,
  onDesc,
  onSubmit,
}: FacilityFormProps) {
  return (
    <>
      <h2 className='text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]'>
        어떤 파손이 발생했나요?
      </h2>
      <p className='text-sm text-text-muted mb-6'>
        파손 유형을 선택하고 사진을 찍어주세요
      </p>

      <div className='mb-5'>
        <SectionLabel>파손 유형</SectionLabel>
        <SelectGrid
          items={DEFECT_TYPES.map((d) => ({
            id: d.id,
            label: d.label,
            desc: d.desc,
          }))}
          selected={defectType}
          onSelect={onDefectType}
          color='#00854A'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>어디에서 발생했나요?</SectionLabel>
        <OptionButtons
          options={['거실·방', '주방·욕실', '베란다·발코니', '현관']}
          selected={defectLocation}
          onSelect={onDefectLocation}
          color='#00854A'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>서류 첨부</SectionLabel>
        <PhotoCaptureGroup
          label='피해 사진'
          hint='최대 3장 · 촬영이 어려우면 관리소에 방문 요청하세요'
          photos={photos}
          onUpdate={onPhotos}
          maxCount={3}
        />
        <button
          type='button'
          className='mt-2 px-4 py-2 rounded-full border border-[#0061AF] text-[#0061AF] text-[13px] font-medium hover:bg-[rgba(0,97,175,0.05)] transition-colors'
          onClick={() => alert('관리사무소에 방문 요청이 접수되었습니다.')}
        >
          관리소 방문 요청
        </button>
      </div>

      <div className='mb-5'>
        <SectionLabel>상세 설명</SectionLabel>
        <textarea
          className='input !min-h-[100px] !resize-y'
          placeholder='하자 상황을 상세히 설명해주세요 (발생 위치, 범위, 시기 등)'
          value={desc}
          onChange={(e) => onDesc(e.target.value)}
        />
      </div>

      <button
        className='btn btn-full !rounded-full text-white !py-4 !text-base !font-bold'
        style={{ backgroundColor: '#00854A' }}
        disabled={!defectType || !defectLocation}
        onClick={onSubmit}
      >
        AI 분석 시작
      </button>
    </>
  );
}

interface LeakFormProps {
  leakLocation: string | null;
  leakCause: string | null;
  leakDamages: string[];
  photos: string[];
  leakAmount: string;
  onLeakLocation: (v: string | null) => void;
  onLeakCause: (v: string | null) => void;
  onLeakDamages: (v: string[]) => void;
  onPhotos: (v: string[]) => void;
  onLeakAmount: (v: string) => void;
  onSubmit: () => void;
}
function LeakForm({
  leakLocation,
  leakCause,
  leakDamages,
  photos,
  leakAmount,
  onLeakLocation,
  onLeakCause,
  onLeakDamages,
  onPhotos,
  onLeakAmount,
  onSubmit,
}: LeakFormProps) {
  return (
    <>
      <h2 className='text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]'>
        누수피해 상세
      </h2>
      <p className='text-sm text-text-muted mb-6'>
        누수 위치와 피해 범위를 입력해주세요
      </p>

      <div className='mb-5'>
        <SectionLabel>누수 발생 위치</SectionLabel>
        <OptionButtons
          options={LEAK_LOCATIONS}
          selected={leakLocation}
          onSelect={onLeakLocation}
          color='#0061AF'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>추정 원인</SectionLabel>
        <OptionButtons
          options={LEAK_CAUSES}
          selected={leakCause}
          onSelect={onLeakCause}
          color='#0061AF'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>피해 범위 (복수 선택)</SectionLabel>
        <CheckList
          options={LEAK_DAMAGES}
          selected={leakDamages}
          onToggle={(val) =>
            onLeakDamages(
              leakDamages.includes(val)
                ? leakDamages.filter((v) => v !== val)
                : [...leakDamages, val]
            )
          }
          color='#0061AF'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>서류 첨부</SectionLabel>
        <PhotoCaptureGroup
          label='피해 사진'
          hint='최대 3장'
          photos={photos}
          onUpdate={onPhotos}
          maxCount={3}
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>피해 금액 (선택)</SectionLabel>
        <input
          className='input'
          placeholder='수리 견적 금액을 입력해주세요 (원)'
          value={leakAmount}
          onChange={(e) => onLeakAmount(e.target.value)}
        />
        <p className='text-xs text-text-muted mt-1'>
          수리 견적서가 있으면 사진으로 첨부해주세요
        </p>
      </div>

      <button
        className='btn btn-full !rounded-full text-white !py-4 !text-base !font-bold'
        style={{ backgroundColor: '#0061AF' }}
        disabled={!leakLocation || !leakCause || leakDamages.length === 0}
        onClick={onSubmit}
      >
        AI 피해 산정
      </button>
    </>
  );
}

interface InjuryFormProps {
  injuryType: string | null;
  injuryPlace: string | null;
  victimName: string;
  victimPhone: string;
  isResident: boolean | null;
  treatmentStatus: string | null;
  diagnosisDocs: string[];
  receiptDocs: string[];
  onInjuryType: (v: string | null) => void;
  onInjuryPlace: (v: string | null) => void;
  onVictimName: (v: string) => void;
  onVictimPhone: (v: string) => void;
  onIsResident: (v: boolean | null) => void;
  onTreatmentStatus: (v: string | null) => void;
  onDiagnosisDocs: (v: string[]) => void;
  onReceiptDocs: (v: string[]) => void;
  onSubmit: () => void;
}
function InjuryForm({
  injuryType,
  injuryPlace,
  victimName,
  victimPhone,
  isResident,
  treatmentStatus,
  diagnosisDocs,
  receiptDocs,
  onInjuryType,
  onInjuryPlace,
  onVictimName,
  onVictimPhone,
  onIsResident,
  onTreatmentStatus,
  onDiagnosisDocs,
  onReceiptDocs,
  onSubmit,
}: InjuryFormProps) {
  return (
    <>
      <h2 className='text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]'>
        신체손해 상세
      </h2>
      <p className='text-sm text-text-muted mb-6'>
        사고 정보와 피해자 정보를 입력해주세요
      </p>

      <div className='mb-5'>
        <SectionLabel>사고 유형</SectionLabel>
        <OptionButtons
          options={INJURY_TYPES}
          selected={injuryType}
          onSelect={onInjuryType}
          color='#C9252C'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>사고 장소</SectionLabel>
        <OptionButtons
          options={INJURY_PLACES}
          selected={injuryPlace}
          onSelect={onInjuryPlace}
          color='#C9252C'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>피해자 정보</SectionLabel>
        <div className='space-y-2.5'>
          <input
            className='input'
            placeholder='이름'
            value={victimName}
            onChange={(e) => onVictimName(e.target.value)}
          />
          <input
            className='input'
            placeholder='연락처'
            value={victimPhone}
            onChange={(e) => onVictimPhone(e.target.value)}
          />
          <div className='flex gap-2.5'>
            <button
              onClick={() => onIsResident(true)}
              className={clsx(
                'flex-1 py-2.5 rounded-full text-sm font-medium border transition-all',
                isResident === true
                  ? 'text-white'
                  : 'border-border text-text-body'
              )}
              style={
                isResident === true
                  ? { backgroundColor: '#C9252C', borderColor: '#C9252C' }
                  : {}
              }
            >
              입주민
            </button>
            <button
              onClick={() => onIsResident(false)}
              className={clsx(
                'flex-1 py-2.5 rounded-full text-sm font-medium border transition-all',
                isResident === false
                  ? 'text-white'
                  : 'border-border text-text-body'
              )}
              style={
                isResident === false
                  ? { backgroundColor: '#C9252C', borderColor: '#C9252C' }
                  : {}
              }
            >
              외부인
            </button>
          </div>
        </div>
      </div>

      <div className='mb-5'>
        <SectionLabel>치료 현황</SectionLabel>
        <OptionButtons
          options={TREATMENT_STATUS}
          selected={treatmentStatus}
          onSelect={onTreatmentStatus}
          color='#C9252C'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>서류 첨부</SectionLabel>
        <div className='space-y-3'>
          <PhotoCaptureGroup
            label='진단서'
            hint='필수 · 최대 3개'
            photos={diagnosisDocs}
            onUpdate={onDiagnosisDocs}
            maxCount={3}
          />
          <PhotoCaptureGroup
            label='의료비 영수증'
            hint='선택 · 최대 3개'
            photos={receiptDocs}
            onUpdate={onReceiptDocs}
            maxCount={3}
          />
        </div>
      </div>

      <div className='card border border-[#C9252C20] bg-[#C9252C08] p-4 mb-5 rounded-[var(--radius-card)]'>
        <div className='flex gap-2.5'>
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#C9252C'
            strokeWidth='2'
            className='shrink-0 mt-0.5'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='12' />
            <line x1='12' y1='16' x2='12.01' y2='16' />
          </svg>
          <p className='text-xs text-text-muted leading-relaxed'>
            대인 보상은 진단서·의료비 기반으로 산정되며, AI 즉시 계산이
            불가합니다. 접수 후{' '}
            <strong className='text-text-body'>손해사정사가 검토</strong>합니다.
          </p>
        </div>
      </div>

      <button
        className='btn btn-full !rounded-full text-white !py-4 !text-base !font-bold'
        style={{ backgroundColor: '#C9252C' }}
        disabled={
          !injuryType || !injuryPlace || !victimName || !treatmentStatus
        }
        onClick={onSubmit}
      >
        AI 피해 산정
      </button>
    </>
  );
}

interface FireFormProps {
  fireType: string | null;
  fireReported: boolean | null;
  fireDamageScope: string | null;
  firePhotos: string[];
  fireCertDocs: string[];
  onFireType: (v: string | null) => void;
  onFireReported: (v: boolean | null) => void;
  onFireDamageScope: (v: string | null) => void;
  onFirePhotos: (v: string[]) => void;
  onFireCertDocs: (v: string[]) => void;
  onSubmit: () => void;
}
function FireForm({
  fireType,
  fireReported,
  fireDamageScope,
  firePhotos,
  fireCertDocs,
  onFireType,
  onFireReported,
  onFireDamageScope,
  onFirePhotos,
  onFireCertDocs,
  onSubmit,
}: FireFormProps) {
  return (
    <>
      <h2 className='text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]'>
        화재·폭발 상세
      </h2>
      <p className='text-sm text-text-muted mb-6'>
        사고 유형과 피해 범위를 입력해주세요
      </p>

      <div className='mb-5'>
        <SectionLabel>사고 유형</SectionLabel>
        <OptionButtons
          options={FIRE_TYPES}
          selected={fireType}
          onSelect={onFireType}
          color='#F47920'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>소방서 신고 여부</SectionLabel>
        <div className='flex gap-2.5'>
          <button
            onClick={() => onFireReported(true)}
            className={clsx(
              'flex-1 py-3 rounded-full text-sm font-semibold border transition-all',
              fireReported === true
                ? 'text-white'
                : 'border-border text-text-body'
            )}
            style={
              fireReported === true
                ? { backgroundColor: '#F47920', borderColor: '#F47920' }
                : {}
            }
          >
            예
          </button>
          <button
            onClick={() => onFireReported(false)}
            className={clsx(
              'flex-1 py-3 rounded-full text-sm font-semibold border transition-all',
              fireReported === false
                ? 'text-white'
                : 'border-border text-text-body'
            )}
            style={
              fireReported === false
                ? { backgroundColor: '#F47920', borderColor: '#F47920' }
                : {}
            }
          >
            아니오
          </button>
        </div>
      </div>

      <div className='mb-5'>
        <SectionLabel>피해 범위</SectionLabel>
        <OptionButtons
          options={FIRE_DAMAGE_SCOPE}
          selected={fireDamageScope}
          onSelect={onFireDamageScope}
          color='#F47920'
        />
      </div>

      <div className='mb-5'>
        <SectionLabel>서류 첨부</SectionLabel>
        <PhotoCaptureGroup
          label='피해 사진'
          hint='최대 3장'
          photos={firePhotos}
          onUpdate={onFirePhotos}
          maxCount={3}
        />
        <PhotoCaptureGroup
          label='화재증명원'
          hint='소방서 발급 화재증명원이 있으면 첨부해주세요 · 최대 3개'
          photos={fireCertDocs}
          onUpdate={onFireCertDocs}
          maxCount={3}
        />
      </div>

      <div className='card border border-[#F4792020] bg-[#F4792008] p-4 mb-5 rounded-[var(--radius-card)]'>
        <div className='flex gap-2.5'>
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#F47920'
            strokeWidth='2'
            className='shrink-0 mt-0.5'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='12' />
            <line x1='12' y1='16' x2='12.01' y2='16' />
          </svg>
          <p className='text-xs text-text-muted leading-relaxed'>
            화재·폭발은 화재증명원 + 현장 감정이 필수이며, AI 즉시 계산이
            불가합니다. 접수 후{' '}
            <strong className='text-text-body'>현장 감정 후 산정</strong>됩니다.
          </p>
        </div>
      </div>

      <button
        className='btn btn-full !rounded-full text-white !py-4 !text-base !font-bold'
        style={{ backgroundColor: '#F47920' }}
        disabled={!fireType || fireReported === null || !fireDamageScope}
        onClick={onSubmit}
      >
        AI 피해 산정
      </button>
    </>
  );
}

/* ═══════════════════════════════════════
   메인 ClaimPage
   ═══════════════════════════════════════ */
export default function ClaimPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { mutateAsync: createClaim, isPending: isConfirming } =
    useCreateClaim();

  // 전체 흐름 상태
  const [claimType, setClaimType] = useState<ClaimType | null>(null);
  const [step, setStep] = useState(0); // 0: 유형선택, 1: 상세입력, 2: AI산정/확인
  const [submitted, setSubmitted] = useState(false);
  const [createdClaimId, setCreatedClaimId] = useState<string | null>(null);
  const [claimNumber, setClaimNumber] = useState(
    () => `CLM-${String(Date.now()).slice(-6)}`
  );

  // Step 1 → Step 2 전달용 draft (API 호출 없이 이동)
  const [pendingLocationDetail, setPendingLocationDetail] = useState('');
  const [pendingDescription, setPendingDescription] = useState('');

  const [aiAnalysisDone, setAiAnalysisDone] = useState(false);
  const [aiCompletedSignature, setAiCompletedSignature] = useState<
    string | null
  >(null);

  const [facilityDefectType, setFacilityDefectType] = useState<string | null>(
    null
  );
  const [facilityDefectLocation, setFacilityDefectLocation] = useState<
    string | null
  >(null);
  const [facilityPhotos, setFacilityPhotos] = useState<string[]>([]);
  const [facilityDesc, setFacilityDesc] = useState('');

  const [leakLocation, setLeakLocation] = useState<string | null>(null);
  const [leakCause, setLeakCause] = useState<string | null>(null);
  const [leakDamages, setLeakDamages] = useState<string[]>([]);
  const [leakPhotos, setLeakPhotos] = useState<string[]>([]);
  const [leakAmount, setLeakAmount] = useState('');

  const [injuryType, setInjuryType] = useState<string | null>(null);
  const [injuryPlace, setInjuryPlace] = useState<string | null>(null);
  const [victimName, setVictimName] = useState('');
  const [victimPhone, setVictimPhone] = useState('');
  const [victimIsResident, setVictimIsResident] = useState<boolean | null>(
    null
  );
  const [treatmentStatus, setTreatmentStatus] = useState<string | null>(null);
  const [diagnosisDocs, setDiagnosisDocs] = useState<string[]>([]);
  const [receiptDocs, setReceiptDocs] = useState<string[]>([]);

  const [fireType, setFireType] = useState<string | null>(null);
  const [fireReported, setFireReported] = useState<boolean | null>(null);
  const [fireDamageScope, setFireDamageScope] = useState<string | null>(null);
  const [firePhotos, setFirePhotos] = useState<string[]>([]);
  const [fireCertDocs, setFireCertDocs] = useState<string[]>([]);

  const stepRef = useRef(step);
  const submittedRef = useRef(submitted);
  const claimTypeRef = useRef(claimType);
  const prevClaimTypeRef = useRef<ClaimType | null | undefined>(undefined);
  stepRef.current = step;
  submittedRef.current = submitted;
  claimTypeRef.current = claimType;

  const scrollTop = () => window.scrollTo(0, 0);

  function resetFormDrafts() {
    setFacilityDefectType(null);
    setFacilityDefectLocation(null);
    setFacilityPhotos([]);
    setFacilityDesc('');
    setLeakLocation(null);
    setLeakCause(null);
    setLeakDamages([]);
    setLeakPhotos([]);
    setLeakAmount('');
    setInjuryType(null);
    setInjuryPlace(null);
    setVictimName('');
    setVictimPhone('');
    setVictimIsResident(null);
    setTreatmentStatus(null);
    setDiagnosisDocs([]);
    setReceiptDocs([]);
    setFireType(null);
    setFireReported(null);
    setFireDamageScope(null);
    setFirePhotos([]);
    setFireCertDocs([]);
    setAiCompletedSignature(null);
  }

  function computeStep2Signature(): string {
    if (!claimType) return '';
    switch (claimType) {
      case 'facility':
        return JSON.stringify({
          t: 'facility',
          dt: facilityDefectType,
          dl: facilityDefectLocation,
          desc: facilityDesc,
          photos: [...facilityPhotos].sort(),
        });
      case 'leak':
        return JSON.stringify({
          t: 'leak',
          loc: leakLocation,
          cause: leakCause,
          damages: [...leakDamages].sort(),
          amount: leakAmount,
          photos: [...leakPhotos].sort(),
        });
      case 'injury':
        return JSON.stringify({
          t: 'injury',
          injuryType,
          injuryPlace,
          victimName,
          victimPhone,
          isResident: victimIsResident,
          treatmentStatus,
          diagnosisDocs: [...diagnosisDocs].sort(),
          receiptDocs: [...receiptDocs].sort(),
        });
      case 'fire':
        return JSON.stringify({
          t: 'fire',
          fireType,
          fireReported,
          fireDamageScope,
          firePhotos: [...firePhotos].sort(),
          fireCertDocs: [...fireCertDocs].sort(),
        });
      default:
        return '';
    }
  }

  function getPendingFromStep1():
    | { locationDetail: string; description: string }
    | null {
    if (!claimType) return null;
    switch (claimType) {
      case 'facility':
        if (!facilityDefectType || !facilityDefectLocation) return null;
        return {
          locationDetail: facilityDefectLocation,
          description: facilityDesc || facilityDefectLocation,
        };
      case 'leak':
        if (!leakLocation || !leakCause || leakDamages.length === 0) return null;
        return {
          locationDetail: leakLocation,
          description: `누수 원인: ${leakCause}, 피해: ${leakDamages.join(', ')}`,
        };
      case 'injury':
        if (!injuryType || !injuryPlace || !victimName || !treatmentStatus)
          return null;
        return {
          locationDetail: injuryPlace,
          description: `${injuryType} — ${victimName}, 치료: ${treatmentStatus}`,
        };
      case 'fire':
        if (fireType === null || fireReported === null || !fireDamageScope)
          return null;
        return {
          locationDetail: fireDamageScope,
          description: `${fireType}, 신고: ${fireReported ? '예' : '아니오'}, 피해범위: ${fireDamageScope}`,
        };
      default:
        return null;
    }
  }

  /** 스텝 전진마다 히스토리 엔트리 추가 — state.step·claimType으로 뒤로/앞으로 동기화 */
  function pushWizardHistory(nextStep: number, ct: ClaimType) {
    window.history.pushState(
      mergeClaimWizardHistoryState(nextStep, ct),
      '',
      window.location.href
    );
  }

  function handleAiReady() {
    setAiAnalysisDone(true);
    setAiCompletedSignature(computeStep2Signature());
  }

  // AI 계산 가능 여부
  const isAICalculable = claimType === 'facility' || claimType === 'leak';

  // 예상 보험금 계산 (제출 완료 후 폼 값 기반)
  function getInsuranceAmount(): number | null {
    if (claimType === 'facility' && facilityDefectType) {
      return FACILITY_ESTIMATION[facilityDefectType]?.insurance ?? null;
    }
    if (claimType === 'leak' && leakDamages.length > 0) {
      let total = 0;
      for (const dmg of leakDamages) {
        total += LEAK_DAMAGE_COSTS[dmg]?.subtotal ?? 0;
      }
      return Math.max(0, total - 100000);
    }
    return null;
  }

  /** Step 1 버튼: API 없이 Step 2로만 이동 — 입력 서명이 이전 AI 완료와 같으면 스켈레톤 생략 */
  function goToStep2() {
    if (!claimType) return;
    const pending = getPendingFromStep1();
    if (!pending) return;
    const sig = computeStep2Signature();
    setPendingLocationDetail(pending.locationDetail);
    setPendingDescription(pending.description);
    if (sig === aiCompletedSignature) {
      setAiAnalysisDone(true);
    } else {
      setAiAnalysisDone(false);
    }
    pushWizardHistory(2, claimType);
    setStep(2);
    scrollTop();
  }

  useEffect(() => {
    if (prevClaimTypeRef.current === undefined) {
      prevClaimTypeRef.current = claimType;
      return;
    }
    if (prevClaimTypeRef.current !== claimType) {
      resetFormDrafts();
      setPendingLocationDetail('');
      setPendingDescription('');
      setAiAnalysisDone(false);
    }
    prevClaimTypeRef.current = claimType;
  }, [claimType]);

  /** Step 2「접수 확정하기」: 이때 createClaim API 호출 */
  async function handleConfirmSubmission() {
    if (!claimType) return;
    try {
      const claim = await createClaim({
        category: claimType,
        location_type: 'private',
        location_detail: pendingLocationDetail,
        description: pendingDescription,
      });
      setCreatedClaimId(claim.id);
      setClaimNumber(claim.claim_number);
      setSubmitted(true);
      scrollTop();
    } catch {
      // 에러 처리
    }
  }

  function resetAll() {
    setClaimType(null);
    setStep(0);
    setSubmitted(false);
    setCreatedClaimId(null);
    setClaimNumber(`CLM-${String(Date.now()).slice(-6)}`);
    setPendingLocationDetail('');
    setPendingDescription('');
    setAiAnalysisDone(false);
    resetFormDrafts();
  }

  /** 헤더 뒤로가기: 스텝>0이면 히스토리 back → popstate에서 스텝 감소 */
  function goBack() {
    if (step === 0) navigate('/');
    else window.history.back();
  }

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (submittedRef.current) {
        navigate('/', { replace: true });
        return;
      }
      const st = event.state;
      if (isClaimWizardHistoryState(st)) {
        const next = Math.min(2, Math.max(0, st.step));
        if (next === 0) {
          if (isClaimTypeValue(st.claimType)) {
            setClaimType(st.claimType);
          } else {
            setClaimType(null);
          }
        } else if (isClaimTypeValue(st.claimType)) {
          setClaimType(st.claimType);
        } else if (claimTypeRef.current != null) {
          setClaimType(claimTypeRef.current);
        }
        setStep(next);
        return;
      }
      if (stepRef.current <= 0) return;
      if (stepRef.current === 1) setClaimType(null);
      setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [navigate]);

  /** step 0일 때 현재 엔트리에 step:0 + 선택 유형 시드 — 뒤로 올 때·카드 선택 시 히스토리와 React 동기화 */
  useEffect(() => {
    if (submitted) return;
    if (step !== 0) return;
    const st = window.history.state;
    if (isClaimWizardHistoryState(st) && st.step === 0) {
      const histCt = isClaimTypeValue(st.claimType) ? st.claimType : null;
      if (histCt === claimType) return;
    }
    window.history.replaceState(
      mergeClaimWizardHistoryState(0, claimType),
      '',
      window.location.href
    );
  }, [step, submitted, claimType]);

  /** step 1·2에서 현재 엔트리에 step·claimType 일치 — 뒤로/앞으로 시 히스토리에 유형 누락 보정 */
  useEffect(() => {
    if (submitted) return;
    if (step !== 1 && step !== 2) return;
    if (!claimType) return;
    const st = window.history.state;
    if (
      isClaimWizardHistoryState(st) &&
      st.step === step &&
      isClaimTypeValue(st.claimType) &&
      st.claimType === claimType
    ) {
      return;
    }
    window.history.replaceState(
      mergeClaimWizardHistoryState(step, claimType),
      '',
      window.location.href
    );
  }, [step, submitted, claimType]);

  const currentType = CLAIM_TYPES.find((t) => t.type === claimType);
  const totalSteps = 3; // 모든 유형 3단계 (유형선택 → 상세입력 → AI산정/확인)

  // ════════════════════════════════════
  // 접수 완료 전용 화면 (모달이 아닌 페이지)
  // ════════════════════════════════════
  if (submitted) {
    const insuranceAmt = getInsuranceAmount();
    const steps = claimType ? NEXT_STEPS[claimType] : [];
    const color = currentType?.color ?? '#00854A';

    return (
      <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
        <div className='text-center pt-8 pb-6'>
          {/* 체크 아이콘 */}
          <div
            className='w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center'
            style={{ backgroundColor: color }}
          >
            <svg
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <h2 className='text-[22px] font-bold text-text-heading mb-1'>
            접수 완료
          </h2>
          <p className='text-sm text-text-muted'>
            보험금 청구가 정상적으로 접수되었습니다
          </p>
        </div>

        {/* 접수 요약 카드 */}
        <div className='card border p-5 mb-5'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center py-1.5'>
              <span className='text-sm text-text-muted'>접수번호</span>
              <span className='text-sm font-bold text-text-heading'>
                {claimNumber}
              </span>
            </div>
            <div className='flex justify-between items-center py-1.5 border-t border-border-subtle'>
              <span className='text-sm text-text-muted'>유형</span>
              <span
                className='text-sm font-semibold px-2.5 py-0.5 rounded-full'
                style={{ backgroundColor: `${color}12`, color }}
              >
                {currentType?.title}
              </span>
            </div>
            {isAICalculable && insuranceAmt !== null && (
              <div className='flex justify-between items-center py-1.5 border-t border-border-subtle'>
                <span className='text-sm text-text-muted'>예상 보험금</span>
                <span className='text-base font-bold' style={{ color }}>
                  {fmt(insuranceAmt)}원
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 다음 단계 */}
        <div className='card border p-5 mb-8'>
          <h3 className='text-sm font-bold text-text-heading mb-4'>
            다음 단계
          </h3>
          <div className='relative pl-6'>
            {steps.map((s, i) => (
              <div key={i} className='relative pb-4 last:pb-0'>
                {/* 세로 라인 */}
                {i < steps.length - 1 && (
                  <div className='absolute left-[-16px] top-[22px] w-[2px] h-[calc(100%-8px)] bg-border' />
                )}
                {/* 원형 번호 */}
                <div
                  className='absolute left-[-22px] top-[2px] w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center text-[8px] font-bold'
                  style={
                    i === 0
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                          color: '#fff',
                        }
                      : {
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-muted)',
                        }
                  }
                >
                  {i + 1}
                </div>
                <p
                  className={clsx(
                    'text-sm',
                    i === 0
                      ? 'font-semibold text-text-heading'
                      : 'text-text-muted'
                  )}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className='space-y-3'>
          <button
            className='btn btn-full !rounded-full text-white !py-4 !text-base !font-bold'
            style={{ backgroundColor: color }}
            onClick={() => {
              resetAll();
              navigate('/myclaims');
            }}
          >
            내 접수 확인하기
          </button>
          <button
            className='btn btn-full !rounded-full !py-4 !text-base !font-bold border-border text-text-body'
            onClick={() => {
              resetAll();
              navigate('/');
            }}
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 0: 사고 유형 선택
  // ════════════════════════════════════
  if (step === 0) {
    return (
      <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
        {/* <BackHeader onBack={() => navigate('/')} title='간편 보험 접수' /> */}
        <h1 className='text-[22px] font-bold text-text-heading tracking-[-0.02em]'>
          간편 보험 접수
        </h1>
        <StepIndicator total={3} current={0} />
        <h2 className='text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]'>
          어떤 사고가 발생했나요?
        </h2>
        <p className='text-sm text-text-muted mb-6'>
          해당하는 사고 유형을 선택해주세요
        </p>

        <div className='flex flex-col gap-2.5 mb-5'>
          {CLAIM_TYPES.map((opt) => (
            <div
              key={opt.type}
              onClick={() => setClaimType(opt.type)}
              className={clsx(
                'card border py-4.5 px-5 cursor-pointer transition-all flex items-start gap-3.5',
                claimType === opt.type
                  ? 'bg-[rgba(0,0,0,0.02)]'
                  : 'border-border hover:border-text-dim'
              )}
              style={claimType === opt.type ? { borderColor: opt.color } : {}}
            >
              <div
                className='w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-base'
                style={
                  claimType === opt.type
                    ? { backgroundColor: opt.color, color: '#fff' }
                    : {
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-muted)',
                      }
                }
              >
                {opt.symbol}
              </div>
              <div>
                <h4 className='text-[15px] font-semibold text-text-body mb-0.5'>
                  {opt.title}
                </h4>
                <p className='text-[13px] text-text-muted leading-snug'>
                  {opt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className='btn btn-primary btn-full !rounded-full !py-4 !text-base !font-bold'
          disabled={!claimType}
          onClick={() => {
            if (claimType) pushWizardHistory(1, claimType);
            setStep(1);
            scrollTop();
          }}
        >
          다음
        </button>
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 1: 유형별 상세 입력
  // ════════════════════════════════════
  if (step === 1) {
    return (
      <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
        <BackHeader onBack={goBack} title='간편 보험 접수' />
        <StepIndicator total={totalSteps} current={1} />

        {claimType === 'facility' && (
          <FacilityForm
            defectType={facilityDefectType}
            defectLocation={facilityDefectLocation}
            photos={facilityPhotos}
            desc={facilityDesc}
            onDefectType={setFacilityDefectType}
            onDefectLocation={setFacilityDefectLocation}
            onPhotos={setFacilityPhotos}
            onDesc={setFacilityDesc}
            onSubmit={goToStep2}
          />
        )}
        {claimType === 'leak' && (
          <LeakForm
            leakLocation={leakLocation}
            leakCause={leakCause}
            leakDamages={leakDamages}
            photos={leakPhotos}
            leakAmount={leakAmount}
            onLeakLocation={setLeakLocation}
            onLeakCause={setLeakCause}
            onLeakDamages={setLeakDamages}
            onPhotos={setLeakPhotos}
            onLeakAmount={setLeakAmount}
            onSubmit={goToStep2}
          />
        )}
        {claimType === 'injury' && (
          <InjuryForm
            injuryType={injuryType}
            injuryPlace={injuryPlace}
            victimName={victimName}
            victimPhone={victimPhone}
            isResident={victimIsResident}
            treatmentStatus={treatmentStatus}
            diagnosisDocs={diagnosisDocs}
            receiptDocs={receiptDocs}
            onInjuryType={setInjuryType}
            onInjuryPlace={setInjuryPlace}
            onVictimName={setVictimName}
            onVictimPhone={setVictimPhone}
            onIsResident={setVictimIsResident}
            onTreatmentStatus={setTreatmentStatus}
            onDiagnosisDocs={setDiagnosisDocs}
            onReceiptDocs={setReceiptDocs}
            onSubmit={goToStep2}
          />
        )}
        {claimType === 'fire' && (
          <FireForm
            fireType={fireType}
            fireReported={fireReported}
            fireDamageScope={fireDamageScope}
            firePhotos={firePhotos}
            fireCertDocs={fireCertDocs}
            onFireType={setFireType}
            onFireReported={setFireReported}
            onFireDamageScope={setFireDamageScope}
            onFirePhotos={setFirePhotos}
            onFireCertDocs={setFireCertDocs}
            onSubmit={goToStep2}
          />
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 분석 결과 (균열·파손)
  // ════════════════════════════════════
  if (step === 2 && claimType === 'facility') {
    const step2Sig = computeStep2Signature();
    const skipAiRecompute =
      aiCompletedSignature !== null && step2Sig === aiCompletedSignature;
    return (
      <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
        <BackHeader onBack={goBack} title='간편 보험 접수' />
        <StepIndicator total={3} current={2} />

        <FacilityAIResult
          key={step2Sig}
          defectType={facilityDefectType!}
          defectLocation={facilityDefectLocation!}
          onReady={handleAiReady}
          skipSkeleton={skipAiRecompute}
        />

        {aiAnalysisDone && (
          <button
            className='btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold'
            style={{ backgroundColor: '#00854A' }}
            disabled={isConfirming}
            onClick={handleConfirmSubmission}
          >
            {isConfirming ? '처리 중...' : '접수 확정하기'}
          </button>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 피해 산정 결과 (누수)
  // ════════════════════════════════════
  if (step === 2 && claimType === 'leak') {
    const step2Sig = computeStep2Signature();
    const skipAiRecompute =
      aiCompletedSignature !== null && step2Sig === aiCompletedSignature;
    return (
      <div className='animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24'>
        <BackHeader onBack={goBack} title='간편 보험 접수' />
        <StepIndicator total={3} current={2} />

        <LeakAIResultWithSkeleton
          key={step2Sig}
          leakDamages={leakDamages}
          onReady={handleAiReady}
          skipSkeleton={skipAiRecompute}
        />

        {aiAnalysisDone && (
          <button
            className='btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold'
            style={{ backgroundColor: '#0061AF' }}
            disabled={isConfirming}
            onClick={handleConfirmSubmission}
          >
            {isConfirming ? '처리 중...' : '접수 확정하기'}
          </button>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 피해 산정 (신체손해)
  // ════════════════════════════════════
  if (step === 2 && claimType === 'injury') {
    const step2Sig = computeStep2Signature();
    const skipAiRecompute =
      aiCompletedSignature !== null && step2Sig === aiCompletedSignature;
    return (
      <InjuryFireStep2
        accentColor='#C9252C'
        title='신체손해 접수 확인'
        description={pendingDescription}
        note='대인 보상은 진단서·의료비 기반으로 산정되며, AI 즉시 계산이 불가합니다. 접수 후 손해사정사가 검토합니다.'
        isConfirming={isConfirming}
        onBack={goBack}
        onConfirm={handleConfirmSubmission}
        aiAnalysisDone={aiAnalysisDone}
        onReady={handleAiReady}
        skipInitialSkeleton={skipAiRecompute}
      />
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 피해 산정 (화재·폭발)
  // ════════════════════════════════════
  if (step === 2 && claimType === 'fire') {
    const step2Sig = computeStep2Signature();
    const skipAiRecompute =
      aiCompletedSignature !== null && step2Sig === aiCompletedSignature;
    return (
      <InjuryFireStep2
        accentColor='#F47920'
        title='화재·폭발 접수 확인'
        description={pendingDescription}
        note='화재·폭발은 화재증명원 + 현장 감정이 필수이며, AI 즉시 계산이 불가합니다. 접수 후 현장 감정 후 산정됩니다.'
        isConfirming={isConfirming}
        onBack={goBack}
        onConfirm={handleConfirmSubmission}
        aiAnalysisDone={aiAnalysisDone}
        onReady={handleAiReady}
        skipInitialSkeleton={skipAiRecompute}
      />
    );
  }

  return null;
}
