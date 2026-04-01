import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      {/* 인사말 헤더 — DB Green Gradient 배경 */}
      <div
        className="px-[var(--space-page)] pt-[var(--space-page)] pb-6"
        style={{ background: "linear-gradient(135deg, #00854A 0%, #009559 100%)" }}
      >
        <div className="mb-3">
          <Badge className="!bg-white/20 !text-white !border-white/30">{user.apt} {user.dong}동 {user.ho}호</Badge>
        </div>
        <h1 className="text-[22px] font-bold text-white tracking-[-0.02em]">안녕하세요, {user.name}님</h1>
        <p className="text-sm text-white/75 mt-1">오늘도 안전한 하루 되세요</p>
      </div>

      <div className="px-[var(--space-page)] pt-5">
        {/* CTA Card — DB Green 배경 */}
        <div
          className="rounded-[var(--radius-card)] p-7 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] mb-3.5"
          style={{ background: "linear-gradient(135deg, #171717 0%, #0a0a0a 100%)" }}
          onClick={() => navigate("/claim")}
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <span className="text-base">◆</span>
            </div>
            <h3 className="text-xl font-bold">긴급 사고접수</h3>
          </div>
          <p className="text-sm opacity-80">피해가 발생했나요? AI가 즉시 분석해드립니다</p>
        </div>

        {/* Status Card */}
        <Card variant="accent" className="mb-3.5" onClick={() => navigate("/myclaims")}>
          <Card.Body className="!py-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,133,74,0.1)" }}>
              <span className="text-[#00854A] text-lg font-bold">■</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-text-body">내 접수 현황</div>
              <div className="text-[13px] text-text-muted mt-0.5">TYPE C 2건 / TYPE A 1건</div>
            </div>
            <div className="text-[22px] font-bold text-[#00854A] tracking-[-0.5px]">3건</div>
          </Card.Body>
        </Card>

        {/* Quick Menu */}
        <div className="section-title mt-6">빠른 메뉴</div>
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <QuickMenuItem
            symbol="■"
            label="사고접수"
            onClick={() => navigate("/claim")}
            iconBg="rgba(0,133,74,0.1)"
            iconColor="#00854A"
          />
          <QuickMenuItem
            symbol="●"
            label="내 접수"
            onClick={() => navigate("/myclaims")}
            iconBg="rgba(0,97,175,0.1)"
            iconColor="#0061AF"
          />
          <QuickMenuItem
            symbol="◆"
            label="보험안내"
            onClick={() => navigate("/insurance-info")}
            iconBg="rgba(0,133,74,0.1)"
            iconColor="#00854A"
          />
          <QuickMenuItem
            symbol="─"
            label="서류관리"
            onClick={() => navigate("/documents")}
            iconBg="rgba(0,97,175,0.1)"
            iconColor="#0061AF"
          />
        </div>

        {/* Alert — DB Blue 연한 배경 */}
        <div
          className="rounded-[var(--radius-card)] border mb-3.5"
          style={{ background: "rgba(0,97,175,0.06)", borderColor: "rgba(0,97,175,0.15)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="shrink-0 text-[#0061AF] text-sm">●</span>
            <span className="text-[13px] text-text-muted leading-relaxed">
              관리사무소 현장조사 요청 1건이 <b className="text-[#0061AF]">진행중</b>입니다. 담당자 배정 후 연락드리겠습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickMenuItem({
  symbol,
  label,
  onClick,
  iconBg,
  iconColor,
}: {
  symbol: string;
  label: string;
  onClick: () => void;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card variant="outlined" className="text-center !py-5 !px-3" onClick={onClick}>
      <div
        className="w-11 h-11 rounded-[12px] flex items-center justify-center text-lg mx-auto mb-2"
        style={{ background: iconBg, color: iconColor }}
      >
        {symbol}
      </div>
      <span className="block text-sm font-semibold text-text-body">{label}</span>
    </Card>
  );
}
