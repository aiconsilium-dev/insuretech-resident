import Card from "@/components/common/Card";
import { useNavigate } from "react-router-dom";

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={() => navigate(-1)} className="btn btn-icon bg-bg-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <h2 className="text-xl font-bold text-text-heading">{title}</h2>
    </div>
  );
}

function InfoCard({ dot, title, content }: { dot: string; title: string; content: React.ReactNode }) {
  return (
    <Card variant="outlined" className="!p-5 mb-3.5">
      <h4 className="text-base font-bold text-text-heading mb-2.5 flex items-center gap-2">
        <span className="text-xs">{dot}</span>
        {title}
      </h4>
      {content}
    </Card>
  );
}

export default function InsuranceInfoPage() {
  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <SubHeader title="보험안내" />
      <h2 className="text-[22px] font-bold text-text-heading mb-1.5 tracking-[-0.02em]">내가 받을 수 있는 보상</h2>
      <p className="text-sm text-text-muted mb-6">단지 보험 및 개인 보험 안내</p>

      <InfoCard dot="●" title="CGL (영업배상책임보험)" content={
        <>
          <p className="text-sm text-text-muted leading-relaxed">공용부분의 하자나 관리 소홀로 인해 내 세대에 피해가 발생한 경우, <b className="text-text-body">관리사무소가 가입한 영업배상책임보험</b>으로 보상받을 수 있습니다.</p>
          <p className="text-sm text-accent font-semibold mt-2">누수, 시설사고, 공용부 하자 피해 시 해당</p>
        </>
      } />
      <InfoCard dot="■" title="주택화재보험" content={
        <>
          <p className="text-sm text-text-muted leading-relaxed">본인이 가입한 주택화재보험이 있다면 <b className="text-text-body">우선 청구가 가능</b>합니다. 화재뿐 아니라 풍수해, 급배수 설비 사고 등도 특약에 따라 보상 범위에 포함될 수 있습니다.</p>
          <p className="text-sm text-text-body font-semibold mt-2">가입 보험사에 보장 범위를 확인하세요</p>
        </>
      } />
      <InfoCard dot="◆" title="가재보험 (가재도구 특약)" content={
        <p className="text-sm text-text-muted leading-relaxed">가전제품, 가구 등 <b className="text-text-body">가재도구 피해</b>는 개인이 가입한 화재보험의 가재도구 특약으로 보상받을 수 있습니다. 특약 가입 여부를 먼저 확인해주세요.</p>
      } />
    </div>
  );
}
