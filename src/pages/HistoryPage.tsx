import { useState } from "react";
import StatusSteps from "@/components/common/StatusSteps";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

/* ───────── 로컬 타입 ───────── */
interface Claim {
  id: string;
  type: string;
  typeIcon: string;
  typeColor: string;
  typeClass: "A" | "B" | "C";
  date: string;
  status: string;
  statusStep: number; // 1‑4
  amount: string | null;
  location: string;
  detail: string;
  inspection: string | null;
  nextAction: string | null;
  isDefectCase?: boolean;
  isDenied?: boolean;
}

/* ───────── 목업 데이터 ───────── */
const CLAIMS: Claim[] = [
  {
    id: "#CLM-0328",
    type: "누수·침수",
    typeIcon: "●",
    typeColor: "#0061AF",
    typeClass: "C",
    date: "2026.03.28",
    status: "산정완료",
    statusStep: 3,
    amount: "624,000원",
    location: "주방·욕실",
    detail: "천장 누수로 인한 도배·장판 피해",
    inspection: "완료 (03.29)",
    nextAction: "보험금 지급 대기",
  },
  {
    id: "#CLM-0315",
    type: "균열·파손",
    typeIcon: "■",
    typeColor: "#00854A",
    typeClass: "A",
    date: "2026.03.15",
    status: "하자조사중",
    statusStep: 1,
    amount: null,
    location: "거실·방",
    detail: "벽면 구조 균열 (폭 0.5mm 이상)",
    inspection: null,
    nextAction: "분류 완료 — 추가 확인 진행 중",
    isDefectCase: true,
  },
  {
    id: "#CLM-0310",
    type: "균열·파손",
    typeIcon: "■",
    typeColor: "#00854A",
    typeClass: "B",
    date: "2026.03.10",
    status: "면책통보",
    statusStep: 2,
    amount: null,
    location: "베란다·발코니",
    detail: "외벽 타일 균열 — 면책 사유: 자연 노화",
    inspection: "완료 (03.12)",
    nextAction: "이의신청 가능",
    isDenied: true,
  },
  {
    id: "#CLM-0301",
    type: "다침·부상",
    typeIcon: "◆",
    typeColor: "#C9252C",
    typeClass: "C",
    date: "2026.03.01",
    status: "심사중",
    statusStep: 2,
    amount: null,
    location: "주차장",
    detail: "주차장 미끄러짐 — 통원치료 중",
    inspection: null,
    nextAction: "손해사정사 심사 진행 중",
  },
  {
    id: "#CLM-0220",
    type: "누수·침수",
    typeIcon: "●",
    typeColor: "#0061AF",
    typeClass: "C",
    date: "2026.02.20",
    status: "지급완료",
    statusStep: 4,
    amount: "1,820,000원",
    location: "주방·욕실",
    detail: "상층 배관 파열로 인한 피해",
    inspection: "완료 (02.22)",
    nextAction: null,
  },
];

const STEPS = ["접수", "검토", "산정", "완료"];

type Tab = "all" | "active" | "done";

/* ───────── 배지 스타일 ───────── */
function typeBadge(tc: "A" | "B" | "C") {
  const map = {
    A: "border-[#C9252C] text-[#C9252C] bg-white",
    B: "border-[#888] text-[#888] bg-white",
    C: "border-[#00854A] text-[#00854A] bg-white",
  } as const;
  const label = { A: "TYPE A", B: "TYPE B", C: "TYPE C" } as const;
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border", map[tc])}>
      {label[tc]}
    </span>
  );
}

/* ───────── 액션 버튼 ───────── */
function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="px-3 py-1.5 rounded-full text-[12px] font-semibold border bg-white active:scale-95 transition-transform"
      style={{ borderColor: color, color }}
    >
      {label}
    </button>
  );
}

/* ───────── 필터 로직 ───────── */
function filterClaims(claims: Claim[], tab: Tab): Claim[] {
  if (tab === "all") return claims;
  if (tab === "done") return claims.filter((c) => c.statusStep >= 4 || c.isDenied);
  return claims.filter((c) => c.statusStep < 4 && !c.isDenied);
}

/* ───────── 메인 페이지 ───────── */
export default function HistoryPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("all");

  const filtered = filterClaims(CLAIMS, tab);

  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">접수 내역</h1>
        <p className="text-sm text-text-muted mt-1">총 {CLAIMS.length}건</p>
      </div>

      {/* 탭 필터 */}
      <div className="flex gap-2 mb-5">
        {([["all", "전체"], ["active", "진행중"], ["done", "완료"]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => { setTab(key); setOpenIdx(null); }}
            className={clsx(
              "px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors",
              tab === key
                ? "bg-[#0061AF] text-white border-[#0061AF]"
                : "bg-white text-text-muted border-[#ddd]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 카드 리스트 */}
      {filtered.length === 0 && (
        <p className="text-center text-text-muted text-sm py-12">해당 내역이 없습니다.</p>
      )}

      {filtered.map((claim) => {
        const globalIdx = CLAIMS.indexOf(claim);
        const isOpen = openIdx === globalIdx;

        return (
          <div
            key={claim.id}
            className="mb-3.5 rounded-[var(--radius-card)] border border-[#e5e5e5] bg-[var(--color-surface)] shadow-[var(--shadow-card)] cursor-pointer active:scale-[0.98] transition-transform overflow-hidden"
            onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
          >
            <div className="p-5">
              {/* ── 상단: 아이콘 + 접수번호 + 유형 | 배지 + 날짜 ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]"
                    style={{ background: `${claim.typeColor}14`, color: claim.typeColor }}
                  >
                    {claim.typeIcon}
                  </div>
                  <div>
                    <div className="text-[13px] text-text-muted font-medium">{claim.id}</div>
                    <div className="text-[15px] font-semibold text-text-body mt-0.5">{claim.type}</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  {typeBadge(claim.typeClass)}
                  <div className="text-xs text-text-dim">{claim.date}</div>
                </div>
              </div>

              {/* ── 중단: 진행 상태 스텝 ── */}
              <div className="mt-3.5 pt-3.5 border-t border-border-subtle">
                <StatusSteps>
                  {STEPS.map((label, i) => (
                    <StatusSteps.Step
                      key={label}
                      label={label}
                      status={
                        i + 1 < claim.statusStep
                          ? "done"
                          : i + 1 === claim.statusStep
                            ? "current"
                            : "pending"
                      }
                    />
                  ))}
                </StatusSteps>
              </div>

              {/* ── 현재 상태 요약 한 줄 ── */}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[13px] text-text-muted">{claim.status}</span>
                <ChevronDown
                  size={16}
                  className={clsx("text-text-dim transition-transform", isOpen && "rotate-180")}
                />
              </div>

              {/* ── 펼쳐지는 상세 ── */}
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-border-subtle animate-[fadeIn_0.15s_ease]">
                  <DetailRow label="위치" value={claim.location} />
                  <DetailRow label="피해 내용" value={claim.detail} />
                  {claim.inspection && (
                    <DetailRow label="현장조사" value={claim.inspection} />
                  )}

                  {/* TYPE C: 금액 & 상태 */}
                  {claim.typeClass === "C" && (
                    <>
                      {claim.amount && (
                        <DetailRow
                          label="AI 산출액"
                          value={claim.amount}
                          valueStyle={{
                            color: claim.statusStep >= 4 ? "#00854A" : "#0061AF",
                            fontWeight: 700,
                          }}
                        />
                      )}
                      {claim.statusStep >= 4 && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-[#00854A0D] text-[#00854A] text-[13px] font-semibold text-center">
                          ✓ 지급 완료
                        </div>
                      )}
                      {claim.statusStep === 3 && claim.nextAction && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-[#0061AF0D] text-[#0061AF] text-[13px] font-medium text-center">
                          {claim.nextAction} — {claim.amount}
                        </div>
                      )}
                      {claim.statusStep < 3 && claim.nextAction && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-[#f5f5f5] text-text-muted text-[13px] text-center">
                          {claim.nextAction}
                        </div>
                      )}
                    </>
                  )}

                  {/* TYPE A: 하자소송 안내 */}
                  {claim.typeClass === "A" && (
                    <div className="mt-3 p-3 rounded-lg border border-[#C9252C33] bg-[#C9252C08]">
                      <p className="text-[12px] text-[#C9252C] leading-relaxed">
                        ⚠ 본 건은 시공상 하자 가능성이 있습니다. 현재 단지에서 하자소송이 진행 중이며, 추가 확인이 필요합니다.
                      </p>
                      {claim.nextAction && (
                        <p className="text-[12px] text-text-muted mt-1.5">{claim.nextAction}</p>
                      )}
                    </div>
                  )}

                  {/* TYPE B: 면책 사유 */}
                  {claim.typeClass === "B" && (
                    <div className="mt-3 p-3 rounded-lg border border-[#ddd] bg-[#f9f9f9]">
                      <p className="text-[12px] text-text-muted leading-relaxed">
                        면책 통보 — {claim.detail.includes("면책 사유:") ? claim.detail.split("면책 사유:")[1].trim() : "사유 확인 필요"}
                      </p>
                      {claim.nextAction && (
                        <p className="text-[12px] text-[#C9252C] mt-1.5 font-medium">{claim.nextAction}</p>
                      )}
                    </div>
                  )}

                  {/* ── 액션 버튼 ── */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* TYPE A: 현장조사 + 변호사 의견서 */}
                    {claim.typeClass === "A" && (
                      <>
                        <ActionBtn label="추가 질의" color="#0061AF" />
                        <ActionBtn label="변호사 의견서 요청" color="#00854A" />
                      </>
                    )}
                    {/* TYPE B: 이의신청 + 변호사 의견서 */}
                    {claim.typeClass === "B" && (
                      <>
                        <ActionBtn label="이의신청" color="#C9252C" />
                        <ActionBtn label="변호사 의견서 요청" color="#00854A" />
                      </>
                    )}
                    {/* TYPE C: 산정 전 단계에서만 현장조사 요청 */}
                    {claim.typeClass === "C" && claim.statusStep < 3 && (
                      <ActionBtn label="관리소 방문 요청" color="#0061AF" />
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
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="font-medium text-text-body text-right ml-4" style={valueStyle}>{value}</span>
    </div>
  );
}
