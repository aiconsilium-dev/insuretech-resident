import { useState } from "react";
import type { ClaimRecord } from "@/lib/types";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import StatusSteps from "@/components/common/StatusSteps";
import clsx from "clsx";

const CLAIMS: ClaimRecord[] = [
  {
    id: "#CLM-0328",
    type: "누수피해",
    damageType: "leak",
    typeClass: "C",
    date: "2026.03.28",
    status: "산정",
    statusStep: 2,
    detail: { desc: "하자/누수 피해", amount: "4,250,000원", inspection: "완료 (2026.03.29)" },
  },
  {
    id: "#CLM-0315",
    type: "시설사고",
    damageType: "facility",
    typeClass: "C",
    date: "2026.03.15",
    status: "검토",
    statusStep: 1,
    detail: { desc: "시설 이용 중 사고", amount: "1,820,000원" },
  },
  {
    id: "#CLM-0301",
    type: "신체부상",
    damageType: "injury",
    typeClass: "A",
    date: "2026.03.01",
    status: "검토",
    statusStep: 1,
    detail: { desc: "신체 부상" },
  },
];

const PROGRESS_LABELS = ["접수", "검토", "산정", "완료"];

const TYPE_SYMBOLS: Record<string, string> = {
  leak: "●",
  facility: "■",
  injury: "◆",
};

// statusStep 기준: 3이상=완료, 1=진행중, 0=에러/대기
function getStatusStyle(claim: ClaimRecord): { borderColor: string; iconBg: string; iconColor: string } {
  if (claim.statusStep >= 3) {
    return { borderColor: "#00854A", iconBg: "rgba(0,133,74,0.1)", iconColor: "#00854A" };
  }
  if (claim.statusStep >= 1) {
    return { borderColor: "#0061AF", iconBg: "rgba(0,97,175,0.1)", iconColor: "#0061AF" };
  }
  return { borderColor: "#C9252C", iconBg: "rgba(201,37,44,0.1)", iconColor: "#C9252C" };
}

export default function HistoryPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">내 접수</h1>
        <p className="text-sm text-text-muted mt-1">총 {CLAIMS.length}건의 접수 내역</p>
      </div>

      {CLAIMS.map((claim, idx) => {
        const style = getStatusStyle(claim);
        return (
          <div
            key={claim.id}
            className="mb-3.5 rounded-[var(--radius-card)] border bg-[var(--color-surface)] shadow-[var(--shadow-card)] cursor-pointer active:scale-[0.98] transition-transform overflow-hidden"
            style={{ borderLeftWidth: 4, borderLeftColor: style.borderColor, borderTopColor: "#e5e5e5", borderRightColor: "#e5e5e5", borderBottomColor: "#e5e5e5" }}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-base"
                    style={{ background: style.iconBg, color: style.iconColor }}
                  >
                    {TYPE_SYMBOLS[claim.damageType] || "●"}
                  </div>
                  <div>
                    <div className="text-[13px] text-text-muted font-medium">{claim.id}</div>
                    <div className="text-[15px] font-semibold text-text-body mt-0.5">{claim.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={claim.typeClass === "C" ? "primary" : "black"}>
                    TYPE {claim.typeClass}
                  </Badge>
                  <div className="text-xs text-text-dim mt-1.5">{claim.date}</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3.5 pt-3.5 border-t border-border-subtle">
                <StatusSteps>
                  {PROGRESS_LABELS.map((label, i) => (
                    <StatusSteps.Step
                      key={label}
                      label={label}
                      status={i < claim.statusStep ? "done" : i === claim.statusStep ? "current" : "pending"}
                    />
                  ))}
                </StatusSteps>
              </div>

              {/* Detail */}
              {openIdx === idx && (
                <div className="mt-3.5 pt-3.5 border-t border-border-subtle">
                  <DetailRow label="접수번호" value={claim.id} />
                  <DetailRow label="피해유형" value={claim.detail.desc} />
                  <DetailRow
                    label="분류"
                    value={
                      claim.typeClass === "C"
                        ? "TYPE C - 보험금 산출"
                        : claim.typeClass === "A"
                          ? "TYPE A - 시공사 하자"
                          : "TYPE B - 면책 검토"
                    }
                    valueClass={claim.typeClass === "C" ? "text-[#00854A]" : undefined}
                  />
                  <DetailRow label="현재 상태" value={claim.status === "산정" ? "적산완료" : claim.status === "검토" ? (claim.typeClass === "A" ? "조사중" : "승인대기") : claim.status} />
                  {claim.detail.inspection && (
                    <DetailRow label="현장조사" value={claim.detail.inspection} />
                  )}
                  {claim.detail.amount && (
                    <DetailRow label="AI 산출액" value={claim.detail.amount} valueClass="font-bold" style={{ color: "#00854A" }} />
                  )}
                  {claim.typeClass === "A" && !claim.detail.amount && (
                    <DetailRow label="비고" value="하자보수 청구 진행 예정" />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
  style,
}: {
  label: string;
  value: string;
  valueClass?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className={clsx("font-semibold text-text-body", valueClass)} style={style}>{value}</span>
    </div>
  );
}
