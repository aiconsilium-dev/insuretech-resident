import { useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import StepIndicator from "@/components/common/StepIndicator";
import PhotoCapture from "@/components/common/PhotoCapture";
import AIAnalysis from "@/components/common/AIAnalysis";
import ResultCard from "@/components/common/ResultCard";
import Modal from "@/components/common/Modal";
import type { DamageType, OwnerType } from "@/lib/types";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const DAMAGE_OPTIONS: { type: DamageType; title: string; desc: string; symbol: string }[] = [
  { type: "leak", title: "하자/누수 피해", desc: "윗집/공용배관에서 누수로 내 세대 피해", symbol: "●" },
  { type: "fire", title: "화재 피해", desc: "화재로 인한 세대 내 피해", symbol: "◆" },
  { type: "facility", title: "시설 이용 중 사고", desc: "엘리베이터, 주차장 등 공용시설", symbol: "■" },
  { type: "property", title: "가재도구 피해", desc: "가전/가구 파손", symbol: "─" },
  { type: "injury", title: "신체 부상", desc: "단지 내 사고로 인한 부상", symbol: "●" },
  { type: "other", title: "기타", desc: "위에 해당하지 않는 피해", symbol: "○" },
];

export default function ClaimPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [ownerType, setOwnerType] = useState<OwnerType>("owner");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [desc, setDesc] = useState("");
  const [inspectionCheck, setInspectionCheck] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - dateNow.getTimezoneOffset());
  const [dateValue, setDateValue] = useState(dateNow.toISOString().slice(0, 16));

  function handlePhotoCapture(idx: number, url: string) {
    setPhotos((prev) => {
      const next = [...prev];
      next[idx] = url;
      return next;
    });
  }

  function goStep2() {
    if (!damageType) return;
    setStep(1);
    if (damageType === "leak") setInspectionCheck(true);
    window.scrollTo(0, 0);
  }

  function goStep3() {
    setStep(2);
    setAiDone(false);
    window.scrollTo(0, 0);
  }

  const handleAiComplete = useCallback(() => setAiDone(true), []);

  function handleSubmit() { setSubmitted(true); }

  function handleSubmitConfirm() {
    setSubmitted(false);
    setStep(0);
    setDamageType(null);
    setPhotos([null, null, null]);
    setDesc("");
    navigate("/myclaims");
  }

  // Step 1: 피해유형 선택
  if (step === 0) {
    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">간편 보험 접수</h2>
        </div>
        <StepIndicator total={3} current={0} />
        <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">어떤 피해를 입으셨나요?</h2>
        <p className="text-sm text-text-muted mb-6">해당하는 피해 유형을 선택해주세요</p>
        <div className="flex flex-col gap-2.5 mb-3.5">
          {DAMAGE_OPTIONS.map((opt) => (
            <div
              key={opt.type}
              onClick={() => setDamageType(opt.type)}
              className={clsx(
                "card border py-4.5 px-5 cursor-pointer transition-all flex items-start gap-3.5",
                damageType === opt.type
                  ? "border-[#00854A] bg-[rgba(0,133,74,0.05)]"
                  : "border-border hover:border-text-dim"
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-base",
                damageType === opt.type ? "bg-[#00854A] text-white" : "bg-bg-secondary text-text-muted"
              )}>
                {opt.symbol}
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-text-body mb-0.5">{opt.title}</h4>
                <p className="text-[13px] text-text-muted leading-snug">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-full !rounded-full" disabled={!damageType} onClick={goStep2}>
          다음
        </button>
      </div>
    );
  }

  // Step 2: 상세 정보
  if (step === 1) {
    return (
      <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep(0)} className="btn btn-icon bg-bg-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-text-heading">간편 보험 접수</h2>
        </div>
        <StepIndicator total={3} current={1} />
        <h2 className="text-[22px] font-bold text-text-heading mb-2 tracking-[-0.02em]">피해 상황을 알려주세요</h2>
        <p className="text-sm text-text-muted mb-6">정확한 분석을 위해 상세히 입력해주세요</p>

        <div className="flex gap-2.5 mb-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-body mb-2">동</label>
            <input className="input" readOnly value={`${user.dong}동`} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-body mb-2">호</label>
            <input className="input" readOnly value={`${user.ho}호`} />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">발생일시</label>
          <input type="datetime-local" className="input" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">피해자 구분</label>
          <div className="flex bg-bg-secondary rounded-xl p-1 gap-1 mb-2">
            <button
              className={clsx("flex-1 py-3 rounded-[10px] text-sm font-semibold transition-all", ownerType === "owner" ? "bg-white text-text-heading shadow-[var(--shadow-sm)]" : "text-text-muted")}
              onClick={() => setOwnerType("owner")}
            >소유자</button>
            <button
              className={clsx("flex-1 py-3 rounded-[10px] text-sm font-semibold transition-all", ownerType === "tenant" ? "bg-white text-text-heading shadow-[var(--shadow-sm)]" : "text-text-muted")}
              onClick={() => setOwnerType("tenant")}
            >임차인</button>
          </div>
          <div className="text-xs text-text-muted mt-1">
            {ownerType === "owner" ? "소유자: 건물마감재(벽지, 바닥재, 천장 등) 보상 대상" : "임차인: 가재도구(가전, 가구 등) 보상 대상"}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">피해 사진 (3종 필수)</label>
          <div className="flex gap-2.5 mb-2">
            <PhotoCapture label="전체사진" onCapture={(url) => handlePhotoCapture(0, url)} />
            <PhotoCapture label="주변부" onCapture={(url) => handlePhotoCapture(1, url)} />
            <PhotoCapture label="발생부위 상세" onCapture={(url) => handlePhotoCapture(2, url)} />
          </div>
          <div className="text-xs text-text-muted mt-1">전체, 주변부, 발생부위 상세 사진을 각각 첨부해주세요</div>
        </div>

        {damageType === "leak" && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-text-body mb-2">누수 기술 소견서</label>
            <div className="photo-slot !aspect-auto !h-20 !rounded-xl">
              <span className="text-text-dim text-lg">+</span>
              <p className="text-[13px] text-text-muted">소견서 파일을 업로드해주세요</p>
            </div>
            <div className="text-xs text-text-muted mt-1">누수 피해의 경우 기술 소견서를 첨부하면 심사가 빨라집니다</div>
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-text-body mb-2">피해 설명</label>
          <textarea
            className="input !min-h-[120px] !resize-y"
            placeholder="피해 상황을 상세히 설명해주세요. 발생 경위, 피해 범위, 원인 추정 등을 포함해주시면 정확한 분석에 도움됩니다."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-2.5 py-3.5">
          <input type="checkbox" className="w-5 h-5 accent-[#171717] shrink-0 mt-0.5" checked={inspectionCheck} onChange={(e) => setInspectionCheck(e.target.checked)} />
          <div className="text-sm text-text-body leading-relaxed">
            관리사무소 현장조사 요청
            {damageType === "leak" && <small className="block text-xs text-text-muted mt-0.5">누수의 경우 관리사무소 현장조사를 권장합니다</small>}
          </div>
        </div>

        <button className="btn btn-primary btn-full !rounded-full mt-2.5" onClick={goStep3}>
          AI 분석 시작
        </button>
      </div>
    );
  }

  // Step 3: AI 분석 + 결과
  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-text-heading">간편 보험 접수</h2>
      </div>
      <StepIndicator total={3} current={2} />

      {!aiDone ? (
        <AIAnalysis onComplete={handleAiComplete} />
      ) : (
        <ResultCard damageType={damageType!} ownerType={ownerType} onSubmit={handleSubmit} />
      )}

      {/* Submit Modal */}
      <Modal open={submitted} center>
        <Modal.Header className="!pt-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#00854A] mx-auto mb-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-heading mb-2">접수가 완료되었습니다</h3>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="text-sm text-text-muted leading-relaxed">
            접수번호 #CLM-0329<br />AI 분석 결과를 바탕으로 심사가 진행됩니다
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary btn-full !rounded-full" onClick={handleSubmitConfirm}>확인</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
