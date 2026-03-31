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

export default function HistoryPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">내 접수</h1>
        <p className="text-sm text-text-muted mt-1">총 {CLAIMS.length}건의 접수 내역</p>
      </div>

      {CLAIMS.map((claim, idx) => (
        <Card
          key={claim.id}
          variant="outlined"
          className="mb-3.5 !p-5"
          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-bg-secondary flex items-center justify-center text-text-heading text-base">
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
                valueClass={claim.typeClass === "C" ? "text-accent" : undefined}
              />
              <DetailRow label="현재 상태" value={claim.status === "산정" ? "적산완료" : claim.status === "검토" ? (claim.typeClass === "A" ? "조사중" : "승인대기") : claim.status} />
              {claim.detail.inspection && (
                <DetailRow label="현장조사" value={claim.detail.inspection} />
              )}
              {claim.detail.amount && (
                <DetailRow label="AI 산출액" value={claim.detail.amount} valueClass="text-text-heading font-bold" />
              )}
              {claim.typeClass === "A" && !claim.detail.amount && (
                <DetailRow label="비고" value="하자보수 청구 진행 예정" />
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function DetailRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className={clsx("font-semibold text-text-body", valueClass)}>{value}</span>
    </div>
  );
}
