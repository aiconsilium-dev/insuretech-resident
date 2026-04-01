import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-[fadeIn_0.25s_ease] pb-24">
      {/* 인사말 — 흰 배경, 텍스트만 */}
      <div className="px-[var(--space-page)] pt-[var(--space-page)] pb-4">
        <div className="mb-2">
          <Badge variant="gray">{user.apt} {user.dong}동 {user.ho}호</Badge>
        </div>
        <h1 className="text-[22px] font-bold text-text-heading tracking-[-0.02em]">안녕하세요, {user.name}님</h1>
        <p className="text-sm text-text-muted mt-1">오늘도 안전한 하루 되세요</p>
      </div>

      <div className="px-[var(--space-page)]">
        {/* 간편 보험 접수 CTA — 흰 카드, Red 포인트 */}
        <Card className="mb-3.5 cursor-pointer transition-all hover:-translate-y-0.5" onClick={() => navigate("/claim")}>
          <Card.Body className="!py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: "rgba(201,37,44,0.08)" }}>
              <span className="text-[#C9252C] text-xl">◆</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-text-heading">간편 보험 접수</h3>
              <p className="text-[13px] text-text-muted mt-0.5">피해가 발생했나요? AI가 즉시 분석해드립니다</p>
            </div>
            <span className="text-[#C9252C] text-lg">→</span>
          </Card.Body>
        </Card>

        {/* 내 접수 현황 — 흰 카드, Green 포인트 */}
        <Card className="mb-3.5 cursor-pointer" onClick={() => navigate("/myclaims")}>
          <Card.Body className="!py-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: "rgba(0,133,74,0.08)" }}>
              <span className="text-[#00854A] text-lg font-bold">■</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-text-body">내 접수 현황</div>
              <div className="text-[13px] text-text-muted mt-0.5">TYPE C 2건 / TYPE A 1건</div>
            </div>
            <div className="text-[22px] font-bold text-[#00854A] tracking-[-0.5px]">3건</div>
          </Card.Body>
        </Card>

        {/* 빠른 메뉴 — 도형 아이콘에만 컬러 */}
        <div className="section-title mt-6">빠른 메뉴</div>
        <div className="grid grid-cols-4 gap-2.5 mb-3.5">
          <QuickMenuItem symbol="◆" label="보험접수" onClick={() => navigate("/claim")} color="#C9252C" />
          <QuickMenuItem symbol="■" label="내 접수" onClick={() => navigate("/myclaims")} color="#00854A" />
          <QuickMenuItem symbol="●" label="보험안내" onClick={() => navigate("/insurance-info")} color="#0061AF" />
          <QuickMenuItem symbol="─" label="서류관리" onClick={() => navigate("/documents")} color="#00854A" />
        </div>

        {/* 알림 — 흰 카드, 텍스트에만 Blue 포인트 */}
        <Card variant="outlined" className="mb-3.5">
          <Card.Body className="!py-3.5 flex items-center gap-3">
            <span className="shrink-0 w-2 h-2 rounded-full bg-[#0061AF]" />
            <span className="text-[13px] text-text-muted leading-relaxed">
              관리사무소 현장조사 요청 1건이 <b className="text-[#0061AF]">진행중</b>입니다.
            </span>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

function QuickMenuItem({ symbol, label, onClick, color }: { symbol: string; label: string; onClick: () => void; color: string }) {
  return (
    <div className="text-center cursor-pointer" onClick={onClick}>
      <div
        className="w-12 h-12 rounded-[14px] border border-[var(--color-border)] flex items-center justify-center text-lg mx-auto mb-2 bg-white transition-transform hover:scale-105"
        style={{ color }}
      >
        {symbol}
      </div>
      <span className="block text-xs font-medium text-text-muted">{label}</span>
    </div>
  );
}
