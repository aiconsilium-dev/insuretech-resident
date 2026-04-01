import { useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/common/StepIndicator";
import PhotoCapture from "@/components/common/PhotoCapture";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

/* ─── 보험 유형 정의 ─── */
type ClaimType = "facility" | "leak" | "injury" | "fire";

interface ClaimTypeOption {
  type: ClaimType;
  title: string;
  desc: string;
  symbol: string;
  color: string;
  completionMsg: string;
}

const CLAIM_TYPES: ClaimTypeOption[] = [
  { type: "facility", title: "균열·파손", desc: "유리창 파손, 벽면 균열, 타일 깨짐 등", symbol: "■", color: "#00854A", completionMsg: "현장조사가 배정됩니다" },
  { type: "leak", title: "누수·침수", desc: "천장·벽에서 물이 새는 경우", symbol: "●", color: "#0061AF", completionMsg: "현장 누수원인 조사가 진행됩니다" },
  { type: "injury", title: "다침·부상", desc: "미끄러짐, 넘어짐, 물건 낙하 등", symbol: "◆", color: "#C9252C", completionMsg: "대인 보상 심사가 진행됩니다 (자기부담금 없음)" },
  { type: "fire", title: "화재·폭발", desc: "불이 나거나 폭발이 발생한 경우", symbol: "▲", color: "#F47920", completionMsg: "화재증명원 확인 후 처리됩니다" },
];

/* ─── 시설하자 옵션 ─── */
const DEFECT_TYPES = [
  { id: "structure", label: "벽·천장 균열", desc: "벽면·천장 금, 콘크리트 깨짐" },
  { id: "finish", label: "타일·유리 파손", desc: "타일 깨짐, 유리창 파손, 도배 들뜸" },
  { id: "mep", label: "배관·설비 고장", desc: "수도, 난방, 전기, 환기 문제" },
  { id: "civil", label: "방수 불량", desc: "외벽 방수, 창틀 방수 문제" },
];

/* ─── 누수피해 옵션 ─── */
const LEAK_LOCATIONS = ["내 세대", "아래층 세대"];
const LEAK_CAUSES = ["상층 세대 배관", "공용 급배수", "방수층 불량", "원인 불명"];
const LEAK_DAMAGES = ["천장", "벽면", "바닥(장판)", "가전·가구", "기타"];

/* ─── 신체손해 옵션 ─── */
const INJURY_TYPES = ["미끄러짐", "낙하물", "놀이터", "주차장", "엘리베이터", "기타"];
const INJURY_PLACES = ["주차장", "복도·계단", "놀이터", "주출입구", "기타"];
const TREATMENT_STATUS = ["통원", "입원", "수술"];

/* ─── 화재 옵션 ─── */
const FIRE_TYPES = ["전기 화재", "가스 폭발", "방화", "기타"];
const FIRE_DAMAGE_SCOPE = ["대물만", "대인만", "대물+대인"];

/* ─── AI 적산 데이터 (균열·파손) ─── */
interface EstimationItem {
  name: string;
  qty: string;
  unitPrice: number;
  total: number;
}
interface EstimationData {
  items: EstimationItem[];
  damageTotal: number;
  deductible: number;
  insurance: number;
}

const FACILITY_ESTIMATION: Record<string, EstimationData> = {
  structure: {
    items: [
      { name: "균열 보수(V커팅+충전)", qty: "5m", unitPrice: 18000, total: 90000 },
      { name: "도배 재시공", qty: "15㎡", unitPrice: 12000, total: 180000 },
      { name: "부자재", qty: "1식", unitPrice: 50000, total: 50000 },
    ],
    damageTotal: 320000,
    deductible: 100000,
    insurance: 220000,
  },
  finish: {
    items: [
      { name: "타일 철거·재시공", qty: "12㎡", unitPrice: 35000, total: 420000 },
      { name: "방수 보수", qty: "8㎡", unitPrice: 28000, total: 224000 },
      { name: "부자재·폐기물", qty: "1식", unitPrice: 80000, total: 80000 },
    ],
    damageTotal: 724000,
    deductible: 100000,
    insurance: 624000,
  },
  mep: {
    items: [
      { name: "배관 교체", qty: "3m", unitPrice: 45000, total: 135000 },
      { name: "마감 복구", qty: "1식", unitPrice: 120000, total: 120000 },
      { name: "설비 부품", qty: "1식", unitPrice: 85000, total: 85000 },
    ],
    damageTotal: 340000,
    deductible: 100000,
    insurance: 240000,
  },
  civil: {
    items: [
      { name: "방수층 재시공", qty: "20㎡", unitPrice: 32000, total: 640000 },
      { name: "마감 복구", qty: "1식", unitPrice: 150000, total: 150000 },
      { name: "부자재", qty: "1식", unitPrice: 60000, total: 60000 },
    ],
    damageTotal: 850000,
    deductible: 100000,
    insurance: 750000,
  },
};

/* ─── AI 적산 데이터 (누수) ─── */
const LEAK_DAMAGE_COSTS: Record<string, { items: { name: string; qty: string; unitPrice: number; total: number }[]; subtotal: number }> = {
  "천장": {
    items: [
      { name: "도배", qty: "12㎡", unitPrice: 12000, total: 144000 },
      { name: "석고보드 교체", qty: "4㎡", unitPrice: 25000, total: 100000 },
    ],
    subtotal: 244000,
  },
  "벽면": {
    items: [
      { name: "도배", qty: "20㎡", unitPrice: 12000, total: 240000 },
    ],
    subtotal: 240000,
  },
  "바닥(장판)": {
    items: [
      { name: "장판 교체", qty: "15㎡", unitPrice: 18000, total: 270000 },
    ],
    subtotal: 270000,
  },
  "가전·가구": {
    items: [
      { name: "중고가 감가 산정", qty: "1식", unitPrice: 300000, total: 300000 },
    ],
    subtotal: 300000,
  },
  "기타": {
    items: [
      { name: "기타 피해", qty: "1식", unitPrice: 100000, total: 100000 },
    ],
    subtotal: 100000,
  },
};

/* ─── 유형별 다음 단계 ─── */
const NEXT_STEPS: Record<ClaimType, string[]> = {
  facility: ["현장조사 배정 (1~3일)", "손해사정 확정", "보험금 지급"],
  leak: ["누수원인 조사 (3~5일)", "책임소재 판단", "수리비 확정", "보험금 지급"],
  injury: ["서류 검토 (3~5일)", "손해사정사 심사", "대인 보상금 확정"],
  fire: ["화재증명원 확인 (5~7일)", "현장 감정", "보험금 확정"],
};

/* ─── 공용 컴포넌트: 뒤로가기 헤더 ─── */
function BackHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="btn btn-icon bg-bg-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-text-heading">{title}</h2>
    </div>
  );
}

/* ─── 공용 컴포넌트: 섹션 라벨 ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-text-body mb-2">{children}</label>;
}

/* ─── 공용 컴포넌트: 선택 그리드 (2열) ─── */
function SelectGrid({ items, selected, onSelect, color }: {
  items: { id: string; label: string; desc?: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  color: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={clsx(
            "card border py-3.5 px-4 cursor-pointer transition-all text-center",
            selected === item.id
              ? `border-[${color}]`
              : "border-border hover:border-text-dim"
          )}
          style={selected === item.id ? { borderColor: color, backgroundColor: `${color}0D` } : {}}
        >
          <h4 className="text-[14px] font-semibold text-text-body">{item.label}</h4>
          {item.desc && <p className="text-[12px] text-text-muted mt-0.5">{item.desc}</p>}
        </div>
      ))}
    </div>
  );
}

/* ─── 공용 컴포넌트: 단일 선택 버튼 목록 ─── */
function OptionButtons({ options, selected, onSelect, color }: {
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={clsx(
            "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
            selected === opt ? "text-white" : "border-border text-text-body hover:border-text-dim"
          )}
          style={selected === opt ? { backgroundColor: color, borderColor: color } : {}}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── 공용 컴포넌트: 멀티 선택 체크리스트 ─── */
function CheckList({ options, selected, onToggle, color }: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] border cursor-pointer transition-all",
            selected.includes(opt) ? "" : "border-border hover:border-text-dim"
          )}
          style={selected.includes(opt) ? { borderColor: color, backgroundColor: `${color}0D` } : {}}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="w-4.5 h-4.5 accent-[#171717] shrink-0"
          />
          <span className="text-sm text-text-body">{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* ─── 숫자 포맷 ─── */
function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

/* ─── AI 분석 + 적산 결과 (균열·파손) ─── */
function FacilityAIResult({ defectType, defectLocation, onReady }: {
  defectType: string;
  defectLocation: string;
  onReady: () => void;
}) {
  const [phase, setPhase] = useState(0); // 0: 분석중, 1: 완료

  useState(() => {
    const timer = setTimeout(() => {
      setPhase(1);
      onReady();
    }, 2500);
    return () => clearTimeout(timer);
  });

  const est = FACILITY_ESTIMATION[defectType];
  const defectLabel = DEFECT_TYPES.find(d => d.id === defectType)?.label ?? defectType;

  if (phase === 0) {
    return (
      <div className="card border p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#00854A0D] mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#00854A] border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
        </div>
        <h3 className="text-base font-bold text-text-heading mb-1">AI 하자 분석 중</h3>
        <p className="text-sm text-text-muted">사진과 정보를 분석하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="card border p-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#00854A] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-heading">AI 분석 결과</h3>
      </div>

      {/* 하자 분류 + 위치 */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">하자 분류</span>
          <span className="text-sm font-semibold text-text-heading">{defectLabel}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">위치</span>
          <span className="text-sm font-semibold text-text-heading">{defectLocation}</span>
        </div>
      </div>

      {/* 공종별 적산 */}
      <div className="bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">공종별 적산</h4>
        <div className="space-y-2">
          {est.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="text-text-body">{item.name}</span>
                <span className="text-text-muted ml-1.5 text-xs">{item.qty} × @{fmt(item.unitPrice)}</span>
              </div>
              <span className="font-medium text-text-heading tabular-nums">{fmt(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 금액 요약 */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">손해액 합계</span>
          <span className="font-semibold text-text-heading">{fmt(est.damageTotal)}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">자기부담금</span>
          <span className="text-text-dim">-{fmt(est.deductible)}원</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-border">
          <span className="font-bold text-text-heading">예상 보험금</span>
          <span className="font-bold text-[#00854A] text-lg">{fmt(est.insurance)}원</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4 text-center">※ 현장조사 후 최종 확정됩니다</p>
    </div>
  );
}

/* ─── AI 적산 결과 (누수) ─── */
function LeakAIResult({ leakDamages }: { leakDamages: string[] }) {
  const allItems: { name: string; qty: string; unitPrice: number; total: number }[] = [];
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
    <div className="card border p-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#0061AF] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-heading">AI 피해 산정 결과</h3>
      </div>

      {/* 피해범위별 적산 */}
      <div className="bg-bg-secondary rounded-[var(--radius-card)] p-4 mb-4">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">피해범위별 적산</h4>
        <div className="space-y-2">
          {allItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="text-text-body">{item.name}</span>
                <span className="text-text-muted ml-1.5 text-xs">{item.qty} × @{fmt(item.unitPrice)}</span>
              </div>
              <span className="font-medium text-text-heading tabular-nums">{fmt(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 금액 요약 */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">손해액 합계</span>
          <span className="font-semibold text-text-heading">{fmt(damageTotal)}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">자기부담금</span>
          <span className="text-text-dim">-{fmt(deductible)}원</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-border">
          <span className="font-bold text-text-heading">예상 보험금</span>
          <span className="font-bold text-[#0061AF] text-lg">{fmt(insurance)}원</span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-4 text-center">※ 현장 누수원인 조사 후 최종 확정됩니다</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   메인 ClaimPage
   ═══════════════════════════════════════ */
export default function ClaimPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  // 전체 흐름 상태
  const [claimType, setClaimType] = useState<ClaimType | null>(null);
  const [step, setStep] = useState(0); // 0: 유형선택, 1: 상세입력, 2: AI분석/확인
  const [submitted, setSubmitted] = useState(false);

  // ── 시설하자 (TYPE A) 상태 ──
  const [defectType, setDefectType] = useState<string | null>(null);
  const [defectLocation, setDefectLocation] = useState<string | null>(null);
  const [facilityPhotos, setFacilityPhotos] = useState<(string | null)[]>([null, null, null]);
  const [facilityDesc, setFacilityDesc] = useState("");
  const [aiAnalysisDone, setAiAnalysisDone] = useState(false);

  // ── 누수피해 (TYPE B) 상태 ──
  const [leakLocation, setLeakLocation] = useState<string | null>(null);
  const [leakCause, setLeakCause] = useState<string | null>(null);
  const [leakDamages, setLeakDamages] = useState<string[]>([]);
  const [leakPhotos, setLeakPhotos] = useState<(string | null)[]>([null, null, null]);
  const [leakAmount, setLeakAmount] = useState("");
  const [leakAiReady, setLeakAiReady] = useState(false);

  // ── 신체손해 (TYPE C) 상태 ──
  const [injuryType, setInjuryType] = useState<string | null>(null);
  const [injuryPlace, setInjuryPlace] = useState<string | null>(null);
  const [victimName, setVictimName] = useState("");
  const [victimPhone, setVictimPhone] = useState("");
  const [isResident, setIsResident] = useState<boolean | null>(null);
  const [treatmentStatus, setTreatmentStatus] = useState<string | null>(null);
  const [injuryDocs, setInjuryDocs] = useState<(string | null)[]>([null, null]);

  // ── 화재·폭발 (TYPE D) 상태 ──
  const [fireType, setFireType] = useState<string | null>(null);
  const [fireReported, setFireReported] = useState<boolean | null>(null);
  const [fireDamageScope, setFireDamageScope] = useState<string | null>(null);
  const [firePhotos, setFirePhotos] = useState<(string | null)[]>([null, null, null]);
  const [fireCertDoc, setFireCertDoc] = useState<(string | null)[]>([null]);

  // 접수번호 생성
  const [claimNumber] = useState(() => `CLM-${String(Date.now()).slice(-6)}`);

  // AI 계산 가능 여부
  const isAICalculable = claimType === "facility" || claimType === "leak";

  // 예상 보험금 계산
  function getInsuranceAmount(): number | null {
    if (claimType === "facility" && defectType) {
      return FACILITY_ESTIMATION[defectType]?.insurance ?? null;
    }
    if (claimType === "leak" && leakDamages.length > 0) {
      let total = 0;
      for (const dmg of leakDamages) {
        total += LEAK_DAMAGE_COSTS[dmg]?.subtotal ?? 0;
      }
      return Math.max(0, total - 100000);
    }
    return null;
  }

  function resetAll() {
    setClaimType(null);
    setStep(0);
    setSubmitted(false);
    setDefectType(null);
    setDefectLocation(null);
    setFacilityPhotos([null, null, null]);
    setFacilityDesc("");
    setAiAnalysisDone(false);
    setLeakLocation(null);
    setLeakCause(null);
    setLeakDamages([]);
    setLeakPhotos([null, null, null]);
    setLeakAmount("");
    setLeakAiReady(false);
    setInjuryType(null);
    setInjuryPlace(null);
    setVictimName("");
    setVictimPhone("");
    setIsResident(null);
    setTreatmentStatus(null);
    setInjuryDocs([null, null]);
    setFireType(null);
    setFireReported(null);
    setFireDamageScope(null);
    setFirePhotos([null, null, null]);
    setFireCertDoc([null]);
  }

  function goBack() {
    if (step === 0) navigate("/");
    else if (step === 2) setStep(1);
    else { setStep(0); setClaimType(null); }
  }

  const currentType = CLAIM_TYPES.find((t) => t.type === claimType);
  const totalSteps = (claimType === "facility" || claimType === "leak") ? 3 : 2;
  const scrollTop = () => window.scrollTo(0, 0);

  // ════════════════════════════════════
  // 접수 완료 전용 화면 (모달이 아닌 페이지)
  // ════════════════════════════════════
  if (submitted) {
    const insuranceAmt = getInsuranceAmount();
    const steps = claimType ? NEXT_STEPS[claimType] : [];
    const color = currentType?.color ?? "#00854A";

    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <div className="text-center pt-8 pb-6">
          {/* 체크 아이콘 */}
          <div
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-text-heading mb-1">접수 완료</h2>
          <p className="text-sm text-text-muted">보험금 청구가 정상적으로 접수되었습니다</p>
        </div>

        {/* 접수 요약 카드 */}
        <div className="card border p-5 mb-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-text-muted">접수번호</span>
              <span className="text-sm font-bold text-text-heading">{claimNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-t border-border-subtle">
              <span className="text-sm text-text-muted">유형</span>
              <span
                className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${color}12`, color }}
              >
                {currentType?.title}
              </span>
            </div>
            {isAICalculable && insuranceAmt !== null && (
              <div className="flex justify-between items-center py-1.5 border-t border-border-subtle">
                <span className="text-sm text-text-muted">예상 보험금</span>
                <span className="text-base font-bold" style={{ color }}>{fmt(insuranceAmt)}원</span>
              </div>
            )}
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="card border p-5 mb-8">
          <h3 className="text-sm font-bold text-text-heading mb-4">다음 단계</h3>
          <div className="relative pl-6">
            {steps.map((s, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                {/* 세로 라인 */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[-16px] top-[22px] w-[2px] h-[calc(100%-8px)] bg-border" />
                )}
                {/* 원형 번호 */}
                <div
                  className="absolute left-[-22px] top-[2px] w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                  style={
                    i === 0
                      ? { backgroundColor: color, borderColor: color, color: "#fff" }
                      : { backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }
                  }
                >
                  {i + 1}
                </div>
                <p className={clsx(
                  "text-sm",
                  i === 0 ? "font-semibold text-text-heading" : "text-text-muted"
                )}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="space-y-3">
          <button
            className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
            style={{ backgroundColor: color }}
            onClick={() => { resetAll(); navigate("/myclaims"); }}
          >
            내 접수 확인하기
          </button>
          <button
            className="btn btn-full !rounded-full !py-4 !text-base !font-bold border-border text-text-body"
            onClick={() => { resetAll(); navigate("/"); }}
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
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <BackHeader onBack={() => navigate("/")} title="간편 보험 접수" />
        <StepIndicator total={3} current={0} />
        <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">
          어떤 사고가 발생했나요?
        </h2>
        <p className="text-sm text-text-muted mb-6">해당하는 사고 유형을 선택해주세요</p>

        <div className="flex flex-col gap-2.5 mb-5">
          {CLAIM_TYPES.map((opt) => (
            <div
              key={opt.type}
              onClick={() => setClaimType(opt.type)}
              className={clsx(
                "card border py-4.5 px-5 cursor-pointer transition-all flex items-start gap-3.5",
                claimType === opt.type
                  ? "bg-[rgba(0,0,0,0.02)]"
                  : "border-border hover:border-text-dim"
              )}
              style={claimType === opt.type ? { borderColor: opt.color } : {}}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-base"
                style={
                  claimType === opt.type
                    ? { backgroundColor: opt.color, color: "#fff" }
                    : { backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }
                }
              >
                {opt.symbol}
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-text-body mb-0.5">{opt.title}</h4>
                <p className="text-[13px] text-text-muted leading-snug">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full !rounded-full !py-4 !text-base !font-bold"
          disabled={!claimType}
          onClick={() => { setStep(1); scrollTop(); }}
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
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <BackHeader onBack={goBack} title="간편 보험 접수" />
        <StepIndicator total={totalSteps} current={1} />

        {/* ── TYPE A: 시설하자 ── */}
        {claimType === "facility" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">어떤 파손이 발생했나요?</h2>
            <p className="text-sm text-text-muted mb-6">파손 유형을 선택하고 사진을 찍어주세요</p>

            <div className="mb-5">
              <SectionLabel>파손 유형</SectionLabel>
              <SelectGrid
                items={DEFECT_TYPES.map(d => ({ id: d.id, label: d.label, desc: d.desc }))}
                selected={defectType}
                onSelect={setDefectType}
                color="#00854A"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>어디에서 발생했나요?</SectionLabel>
              <OptionButtons
                options={["거실·방", "주방·욕실", "베란다·발코니", "현관"]}
                selected={defectLocation}
                onSelect={setDefectLocation}
                color="#00854A"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진 (3장)</SectionLabel>
              <div className="flex gap-2.5 mb-1">
                <PhotoCapture label="전경" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setFacilityPhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
              <p className="text-xs text-text-muted mt-1">전경, 근접, 주변 사진을 각각 첨부해주세요</p>
            </div>

            <div className="mb-5">
              <SectionLabel>상세 설명</SectionLabel>
              <textarea
                className="input !min-h-[100px] !resize-y"
                placeholder="하자 상황을 상세히 설명해주세요 (발생 위치, 범위, 시기 등)"
                value={facilityDesc}
                onChange={(e) => setFacilityDesc(e.target.value)}
              />
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#00854A" }}
              disabled={!defectType || !defectLocation}
              onClick={() => { setStep(2); setAiAnalysisDone(false); scrollTop(); }}
            >
              AI 분석 시작
            </button>
          </>
        )}

        {/* ── TYPE B: 누수피해 ── */}
        {claimType === "leak" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">누수피해 상세</h2>
            <p className="text-sm text-text-muted mb-6">누수 위치와 피해 범위를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>누수 발생 위치</SectionLabel>
              <OptionButtons options={LEAK_LOCATIONS} selected={leakLocation} onSelect={setLeakLocation} color="#0061AF" />
            </div>

            <div className="mb-5">
              <SectionLabel>추정 원인</SectionLabel>
              <OptionButtons options={LEAK_CAUSES} selected={leakCause} onSelect={setLeakCause} color="#0061AF" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 범위 (복수 선택)</SectionLabel>
              <CheckList
                options={LEAK_DAMAGES}
                selected={leakDamages}
                onToggle={(val) => setLeakDamages(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])}
                color="#0061AF"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진 (3장)</SectionLabel>
              <div className="flex gap-2.5 mb-1">
                <PhotoCapture label="전경" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setLeakPhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>피해 금액 (선택)</SectionLabel>
              <input
                className="input"
                placeholder="수리 견적 금액을 입력해주세요 (원)"
                value={leakAmount}
                onChange={(e) => setLeakAmount(e.target.value)}
              />
              <p className="text-xs text-text-muted mt-1">수리 견적서가 있으면 사진으로 첨부해주세요</p>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#0061AF" }}
              disabled={!leakLocation || !leakCause || leakDamages.length === 0}
              onClick={() => { setStep(2); setLeakAiReady(false); scrollTop(); }}
            >
              AI 피해 산정
            </button>
          </>
        )}

        {/* ── TYPE C: 신체손해 ── */}
        {claimType === "injury" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">신체손해 상세</h2>
            <p className="text-sm text-text-muted mb-6">사고 정보와 피해자 정보를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>사고 유형</SectionLabel>
              <OptionButtons options={INJURY_TYPES} selected={injuryType} onSelect={setInjuryType} color="#C9252C" />
            </div>

            <div className="mb-5">
              <SectionLabel>사고 장소</SectionLabel>
              <OptionButtons options={INJURY_PLACES} selected={injuryPlace} onSelect={setInjuryPlace} color="#C9252C" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해자 정보</SectionLabel>
              <div className="space-y-2.5">
                <input className="input" placeholder="이름" value={victimName} onChange={(e) => setVictimName(e.target.value)} />
                <input className="input" placeholder="연락처" value={victimPhone} onChange={(e) => setVictimPhone(e.target.value)} />
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setIsResident(true)}
                    className={clsx(
                      "flex-1 py-2.5 rounded-full text-sm font-medium border transition-all",
                      isResident === true ? "text-white" : "border-border text-text-body"
                    )}
                    style={isResident === true ? { backgroundColor: "#C9252C", borderColor: "#C9252C" } : {}}
                  >
                    입주민
                  </button>
                  <button
                    onClick={() => setIsResident(false)}
                    className={clsx(
                      "flex-1 py-2.5 rounded-full text-sm font-medium border transition-all",
                      isResident === false ? "text-white" : "border-border text-text-body"
                    )}
                    style={isResident === false ? { backgroundColor: "#C9252C", borderColor: "#C9252C" } : {}}
                  >
                    외부인
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>치료 현황</SectionLabel>
              <OptionButtons options={TREATMENT_STATUS} selected={treatmentStatus} onSelect={setTreatmentStatus} color="#C9252C" />
            </div>

            <div className="mb-5">
              <SectionLabel>서류 첨부</SectionLabel>
              <div className="flex gap-2.5">
                <PhotoCapture label="진단서" onCapture={(url) => setInjuryDocs(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="의료비 영수증" onCapture={(url) => setInjuryDocs(p => { const n = [...p]; n[1] = url; return n; })} />
              </div>
              <p className="text-xs text-text-muted mt-1">진단서는 필수, 의료비 영수증은 선택입니다</p>
            </div>

            <div className="card border border-[#C9252C20] bg-[#C9252C08] p-4 mb-5 rounded-[var(--radius-card)]">
              <div className="flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9252C" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-text-muted leading-relaxed">
                  대인 보상은 진단서·의료비 기반으로 산정되며, AI 즉시 계산이 불가합니다.
                  접수 후 <strong className="text-text-body">손해사정사가 검토</strong>합니다.
                </p>
              </div>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#C9252C" }}
              disabled={!injuryType || !injuryPlace || !victimName || !treatmentStatus}
              onClick={() => { setSubmitted(true); scrollTop(); }}
            >
              접수하기
            </button>
          </>
        )}

        {/* ── TYPE D: 화재·폭발 ── */}
        {claimType === "fire" && (
          <>
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">화재·폭발 상세</h2>
            <p className="text-sm text-text-muted mb-6">사고 유형과 피해 범위를 입력해주세요</p>

            <div className="mb-5">
              <SectionLabel>사고 유형</SectionLabel>
              <OptionButtons options={FIRE_TYPES} selected={fireType} onSelect={setFireType} color="#F47920" />
            </div>

            <div className="mb-5">
              <SectionLabel>소방서 신고 여부</SectionLabel>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setFireReported(true)}
                  className={clsx(
                    "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                    fireReported === true ? "text-white" : "border-border text-text-body"
                  )}
                  style={fireReported === true ? { backgroundColor: "#F47920", borderColor: "#F47920" } : {}}
                >
                  예
                </button>
                <button
                  onClick={() => setFireReported(false)}
                  className={clsx(
                    "flex-1 py-3 rounded-full text-sm font-semibold border transition-all",
                    fireReported === false ? "text-white" : "border-border text-text-body"
                  )}
                  style={fireReported === false ? { backgroundColor: "#F47920", borderColor: "#F47920" } : {}}
                >
                  아니오
                </button>
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>피해 범위</SectionLabel>
              <OptionButtons options={FIRE_DAMAGE_SCOPE} selected={fireDamageScope} onSelect={setFireDamageScope} color="#F47920" />
            </div>

            <div className="mb-5">
              <SectionLabel>피해 사진</SectionLabel>
              <div className="flex gap-2.5 mb-1">
                <PhotoCapture label="전경" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[0] = url; return n; })} />
                <PhotoCapture label="근접" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[1] = url; return n; })} />
                <PhotoCapture label="주변" onCapture={(url) => setFirePhotos(p => { const n = [...p]; n[2] = url; return n; })} />
              </div>
            </div>

            <div className="mb-5">
              <SectionLabel>화재증명원 (선택)</SectionLabel>
              <div className="flex gap-2.5">
                <PhotoCapture label="화재증명원" onCapture={(url) => setFireCertDoc([url])} />
              </div>
              <p className="text-xs text-text-muted mt-1">소방서 발급 화재증명원이 있으면 첨부해주세요</p>
            </div>

            <div className="card border border-[#F4792020] bg-[#F4792008] p-4 mb-5 rounded-[var(--radius-card)]">
              <div className="flex gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F47920" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-text-muted leading-relaxed">
                  화재·폭발은 화재증명원 + 현장 감정이 필수이며, AI 즉시 계산이 불가합니다.
                  접수 후 <strong className="text-text-body">현장 감정 후 산정</strong>됩니다.
                </p>
              </div>
            </div>

            <button
              className="btn btn-full !rounded-full text-white !py-4 !text-base !font-bold"
              style={{ backgroundColor: "#F47920" }}
              disabled={!fireType || fireReported === null || !fireDamageScope}
              onClick={() => { setSubmitted(true); scrollTop(); }}
            >
              접수하기
            </button>
          </>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 분석 결과 (균열·파손)
  // ════════════════════════════════════
  if (step === 2 && claimType === "facility") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <BackHeader onBack={goBack} title="간편 보험 접수" />
        <StepIndicator total={3} current={2} />

        <FacilityAIResult
          defectType={defectType!}
          defectLocation={defectLocation!}
          onReady={() => setAiAnalysisDone(true)}
        />

        {aiAnalysisDone && (
          <button
            className="btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold"
            style={{ backgroundColor: "#00854A" }}
            onClick={() => { setSubmitted(true); scrollTop(); }}
          >
            접수하기
          </button>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 피해 산정 결과 (누수)
  // ════════════════════════════════════
  if (step === 2 && claimType === "leak") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <BackHeader onBack={goBack} title="간편 보험 접수" />
        <StepIndicator total={3} current={2} />

        <LeakAIResult leakDamages={leakDamages} />

        <button
          className="btn btn-full !rounded-full text-white mt-5 !py-4 !text-base !font-bold"
          style={{ backgroundColor: "#0061AF" }}
          onClick={() => { setSubmitted(true); scrollTop(); }}
        >
          접수하기
        </button>
      </div>
    );
  }

  return null;
}
