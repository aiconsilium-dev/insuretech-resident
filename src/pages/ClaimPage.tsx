import { useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/common/StepIndicator";
import PhotoCapture from "@/components/common/PhotoCapture";
import Modal from "@/components/common/Modal";
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
  { type: "facility", title: "시설하자", desc: "건물 균열, 방수불량, 배관 등", symbol: "■", color: "#00854A", completionMsg: "현장조사가 배정됩니다" },
  { type: "leak", title: "누수피해", desc: "누수로 인한 재물 피해", symbol: "●", color: "#0061AF", completionMsg: "현장 누수원인 조사가 진행됩니다" },
  { type: "injury", title: "신체손해", desc: "시설물로 인한 인명피해", symbol: "◆", color: "#C9252C", completionMsg: "대인 보상 심사가 진행됩니다 (자기부담금 없음)" },
  { type: "fire", title: "화재·폭발", desc: "화재, 가스폭발 등", symbol: "▲", color: "#F47920", completionMsg: "화재증명원 확인 후 처리됩니다" },
];

/* ─── 시설하자 옵션 ─── */
const DEFECT_TYPES = [
  { id: "structure", label: "구조체", desc: "균열, 철근, 콘크리트" },
  { id: "finish", label: "마감", desc: "도배, 타일, 창호, 방수" },
  { id: "mep", label: "설비", desc: "급배수, 난방, 전기, 소방" },
  { id: "civil", label: "토목·조경", desc: "옹벽, 주차장, 조경" },
];

/* ─── 누수피해 옵션 ─── */
const LEAK_LOCATIONS = ["내 세대", "아래층 세대", "공용부"];
const LEAK_CAUSES = ["상층 세대 배관", "공용 급배수", "방수층 불량", "원인 불명"];
const LEAK_DAMAGES = ["천장", "벽면", "바닥(장판)", "가전·가구", "기타"];

/* ─── 신체손해 옵션 ─── */
const INJURY_TYPES = ["미끄러짐", "낙하물", "놀이터", "주차장", "엘리베이터", "기타"];
const INJURY_PLACES = ["주차장", "복도·계단", "놀이터", "주출입구", "기타"];
const TREATMENT_STATUS = ["통원", "입원", "수술"];

/* ─── 화재 옵션 ─── */
const FIRE_TYPES = ["전기 화재", "가스 폭발", "방화", "기타"];
const FIRE_DAMAGE_SCOPE = ["대물만", "대인만", "대물+대인"];

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

/* ─── 공용 컴포넌트: AI 분석 애니메이션 ─── */
function AIAnalysisStep({ defectType, onComplete }: { defectType: string; onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0: 분석중, 1: 완료

  useState(() => {
    const timer = setTimeout(() => {
      setPhase(1);
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  });

  const costRange = defectType === "structure" ? "500만 ~ 2,000만원" :
    defectType === "finish" ? "100만 ~ 800만원" :
    defectType === "mep" ? "200만 ~ 1,500만원" : "300만 ~ 1,200만원";

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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#00854A] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-heading">AI 분석 완료</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">하자 분류</span>
          <span className="text-sm font-semibold text-text-heading">{defectLabel}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle">
          <span className="text-sm text-text-muted">예상 보수비용</span>
          <span className="text-sm font-bold" style={{ color: "#00854A" }}>{costRange}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-text-muted">현장조사</span>
          <span className="badge badge-primary">필수</span>
        </div>
      </div>
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
  const claimNumber = `CLM-${String(Date.now()).slice(-6)}`;

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

  function handleSubmitConfirm() {
    resetAll();
    navigate("/myclaims");
  }

  function goBack() {
    if (step === 0) navigate("/");
    else if (step === 2) setStep(1);
    else { setStep(0); setClaimType(null); }
  }

  const currentType = CLAIM_TYPES.find((t) => t.type === claimType);
  const totalSteps = claimType === "facility" ? 3 : 2;
  const scrollTop = () => window.scrollTo(0, 0);

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
          className="btn btn-primary btn-full !rounded-full"
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
            <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">시설하자 상세</h2>
            <p className="text-sm text-text-muted mb-6">하자 유형과 위치를 선택하고 사진을 촬영해주세요</p>

            <div className="mb-5">
              <SectionLabel>하자 유형</SectionLabel>
              <SelectGrid
                items={DEFECT_TYPES.map(d => ({ id: d.id, label: d.label, desc: d.desc }))}
                selected={defectType}
                onSelect={setDefectType}
                color="#00854A"
              />
            </div>

            <div className="mb-5">
              <SectionLabel>하자 위치</SectionLabel>
              <OptionButtons
                options={["전용부(세대 내)", "공용부(복도, 주차장 등)"]}
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
              className="btn btn-full !rounded-full text-white"
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
              className="btn btn-full !rounded-full text-white"
              style={{ backgroundColor: "#0061AF" }}
              disabled={!leakLocation || !leakCause || leakDamages.length === 0}
              onClick={() => { setSubmitted(true); }}
            >
              접수하기
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

            <button
              className="btn btn-full !rounded-full text-white"
              style={{ backgroundColor: "#C9252C" }}
              disabled={!injuryType || !injuryPlace || !victimName || !treatmentStatus}
              onClick={() => { setSubmitted(true); }}
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

            <button
              className="btn btn-full !rounded-full text-white"
              style={{ backgroundColor: "#F47920" }}
              disabled={!fireType || fireReported === null || !fireDamageScope}
              onClick={() => { setSubmitted(true); }}
            >
              접수하기
            </button>
          </>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // Step 2: AI 분석 (시설하자만)
  // ════════════════════════════════════
  if (step === 2 && claimType === "facility") {
    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <BackHeader onBack={goBack} title="간편 보험 접수" />
        <StepIndicator total={3} current={2} />

        <AIAnalysisStep
          defectType={defectType!}
          onComplete={() => setAiAnalysisDone(true)}
        />

        {aiAnalysisDone && (
          <button
            className="btn btn-full !rounded-full text-white mt-5"
            style={{ backgroundColor: "#00854A" }}
            onClick={() => setSubmitted(true)}
          >
            접수하기
          </button>
        )}
      </div>
    );
  }

  // ════════════════════════════════════
  // 접수 완료 모달 (공용)
  // ════════════════════════════════════
  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <Modal open={submitted} center>
        <Modal.Header className="!pt-8 text-center">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: currentType?.color ?? "#00854A" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-heading mb-2">접수가 완료되었습니다</h3>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            접수번호 <span className="font-semibold text-text-body">#{claimNumber}</span>
          </p>
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${currentType?.color ?? "#00854A"}12`, color: currentType?.color ?? "#00854A" }}
          >
            {currentType?.completionMsg}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary btn-full !rounded-full" onClick={handleSubmitConfirm}>확인</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
