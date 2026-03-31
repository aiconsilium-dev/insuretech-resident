import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <div className="mb-5">
        <Badge variant="gray">{user.apt} {user.dong}동 {user.ho}호</Badge>
      </div>
      <h1 className="text-[22px] font-bold text-text-heading mb-6 tracking-[-0.02em]">안녕하세요, {user.name}님</h1>

      {/* CTA Card — 블랙 primary */}
      <div
        className="bg-primary rounded-[var(--radius-card)] p-7 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] mb-3.5"
        onClick={() => navigate("/claim")}
      >
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-2xl">◆</span>
          <h3 className="text-xl font-bold">긴급 사고접수</h3>
        </div>
        <p className="text-sm opacity-80">피해가 발생했나요? AI가 즉시 분석해드립니다</p>
      </div>

      {/* Status Card */}
      <Card variant="outlined" className="mb-3.5" onClick={() => navigate("/myclaims")}>
        <Card.Body className="!py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-bg-secondary flex items-center justify-center shrink-0">
            <span className="text-text-heading text-lg font-bold">■</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-body">내 접수 현황</div>
            <div className="text-[13px] text-text-muted mt-0.5">TYPE C 2건 / TYPE A 1건</div>
          </div>
          <div className="text-[22px] font-bold text-text-heading tracking-[-0.5px]">3건</div>
        </Card.Body>
      </Card>

      {/* Quick Menu */}
      <div className="section-title mt-6">빠른 메뉴</div>
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <QuickMenuItem symbol="■" label="사고접수" onClick={() => navigate("/claim")} />
        <QuickMenuItem symbol="●" label="내 접수" onClick={() => navigate("/myclaims")} />
        <QuickMenuItem symbol="◆" label="보험안내" onClick={() => navigate("/insurance-info")} />
        <QuickMenuItem symbol="─" label="서류관리" onClick={() => navigate("/documents")} />
      </div>

      {/* Alert */}
      <Card variant="outlined" className="mb-3.5">
        <Card.Body className="flex items-center gap-3 !py-3.5">
          <span className="text-accent text-sm shrink-0">●</span>
          <span className="text-[13px] text-text-muted leading-relaxed">
            관리사무소 현장조사 요청 1건이 <b className="text-text-body">진행중</b>입니다. 담당자 배정 후 연락드리겠습니다.
          </span>
        </Card.Body>
      </Card>
    </div>
  );
}

function QuickMenuItem({ symbol, label, onClick }: { symbol: string; label: string; onClick: () => void }) {
  return (
    <Card variant="outlined" className="text-center !py-5 !px-3" onClick={onClick}>
      <div className="text-text-heading text-lg mx-auto mb-2">{symbol}</div>
      <span className="block text-sm font-semibold text-text-body">{label}</span>
    </Card>
  );
}
