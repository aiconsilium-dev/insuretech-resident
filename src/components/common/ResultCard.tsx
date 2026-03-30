import type { DamageType, OwnerType, ResultType } from "@/lib/types";
import { DAMAGE_LABELS, TYPE_MAP, AMOUNT_MAP } from "@/lib/types";
import clsx from "clsx";

interface Props {
  damageType: DamageType;
  ownerType: OwnerType;
  onSubmit: () => void;
}

const ANALYSIS_TEXTS: Record<DamageType, string> = {
  leak: '<b>AI 분석 결과:</b> 업로드된 사진에서 천장 및 벽면의 수분 침투 흔적이 확인되었습니다. 공용배관 또는 상층 세대에서 발생한 누수로 판단되며, <b>TYPE C (보험금 산출 대상)</b>로 분류되었습니다. 관리사무소 영업배상책임보험(CGL)을 통한 보상이 가능합니다.',
  fire: '<b>AI 분석 결과:</b> 화재로 인한 세대 내 피해가 확인되었습니다. 건물 마감재 및 가재도구 피해에 대해 <b>TYPE C (보험금 산출 대상)</b>로 분류되었습니다. 주택화재보험 우선 청구 후 관리사무소 보험으로 잔여분 보상이 가능합니다.',
  facility: '<b>AI 분석 결과:</b> 공용시설 이용 중 발생한 사고로 판단됩니다. 관리사무소의 시설 관리 책임에 해당하며, <b>TYPE C (보험금 산출 대상)</b>로 분류되었습니다. 영업배상책임보험(CGL)을 통한 보상 절차가 진행됩니다.',
  property: '<b>AI 분석 결과:</b> 가재도구(가전/가구) 피해가 확인되었습니다. 피해 원인에 따라 관리사무소 보험 또는 개인 가재보험 특약으로 보상이 가능하며, <b>TYPE C (보험금 산출 대상)</b>로 분류되었습니다.',
  injury: '<b>AI 분석 결과:</b> 단지 내 시설 하자로 인한 신체 부상으로 판단됩니다. 시공사 하자보수 청구 대상에 해당하며, <b>TYPE A (시공사 하자)</b>로 분류되었습니다. 하자보수 청구 절차가 안내될 예정입니다.',
  other: '<b>AI 분석 결과:</b> 제출된 자료를 기반으로 분석한 결과, 면책 여부에 대한 추가 검토가 필요합니다. <b>TYPE B (면책 검토 대상)</b>로 분류되었습니다. 전문 심사역이 추가 검토 후 결과를 안내드립니다.',
};

function TypeBadge({ type, highlighted }: { type: ResultType; highlighted: boolean }) {
  const badges: Record<ResultType, { cls: string; label: string; desc: string }> = {
    A: { cls: "bg-black text-white", label: "TYPE A", desc: "시공사 하자\n하자보수 청구 대상" },
    B: { cls: "bg-gray-300 text-gray-700", label: "TYPE B", desc: "면책 검토 대상" },
    C: { cls: "bg-primary text-white", label: "TYPE C", desc: "보험금 산출\nAI 적산 완료" },
  };
  const b = badges[type];

  return (
    <div className={clsx(
      "flex-1 py-3.5 px-2.5 rounded-xl text-center border-2",
      highlighted ? "border-primary bg-[rgba(255,107,53,0.05)]" : "border-gray-200 bg-gray-50"
    )}>
      <span className={clsx("inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5", b.cls)}>{b.label}</span>
      <div className={clsx("text-[11px] leading-snug mt-1 whitespace-pre-line", highlighted ? "text-gray-700" : "text-gray-500")}>{b.desc}</div>
    </div>
  );
}

export default function ResultCard({ damageType, ownerType, onSubmit }: Props) {
  const resultType = TYPE_MAP[damageType];
  const amount = AMOUNT_MAP[damageType];

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[22px] font-bold mb-1">AI 분석 완료</h2>
        <p className="text-sm text-gray-500">{DAMAGE_LABELS[damageType]}</p>
      </div>

      <div className="flex gap-2 mb-5">
        <TypeBadge type="A" highlighted={resultType === "A"} />
        <TypeBadge type="B" highlighted={resultType === "B"} />
        <TypeBadge type="C" highlighted={resultType === "C"} />
      </div>

      <div
        className="bg-gray-50 rounded-xl p-4.5 mb-5 text-sm text-gray-600 leading-relaxed [&_b]:font-semibold"
        dangerouslySetInnerHTML={{ __html: ANALYSIS_TEXTS[damageType] }}
      />

      <div className="text-center py-6 mb-5">
        <div className="text-sm text-gray-500 mb-1.5">예상 보상금액</div>
        <div className="text-4xl font-extrabold text-primary">
          {amount > 0 ? `${amount.toLocaleString()}원` : "별도 산정"}
        </div>
        <div className="text-[13px] text-gray-500 mt-2">
          {amount > 0
            ? ownerType === "owner" ? "소유자 기준 (건물마감재 보상)" : "임차인 기준 (가재도구 보상)"
            : resultType === "A" ? "하자보수 청구 대상 - 금액 별도 산정" : "추가 검토 후 안내"}
        </div>
      </div>

      <button className="btn btn-primary btn-full !rounded-full" onClick={onSubmit}>접수하기</button>
    </div>
  );
}
