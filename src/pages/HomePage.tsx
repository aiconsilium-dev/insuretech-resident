import { useApp } from "@/contexts/AppContext";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";

export default function HomePage() {
  const { user, setActiveTab, setSubPage } = useApp();

  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      <div className="mb-5">
        <Badge variant="gray">{user.apt} {user.dong}동 {user.ho}호</Badge>
      </div>
      <h1 className="text-[22px] font-bold mb-6">안녕하세요, {user.name}님</h1>

      {/* CTA Card */}
      <div
        className="bg-primary rounded-[var(--radius-card)] p-7 text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] mb-3.5"
        onClick={() => setActiveTab("claim")}
      >
        <div className="flex items-center gap-3 mb-2.5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3 className="text-xl font-bold">긴급 사고접수</h3>
        </div>
        <p className="text-sm opacity-90">피해가 발생했나요? AI가 즉시 분석해드립니다</p>
      </div>

      {/* Status Card */}
      <Card variant="outlined" className="mb-3.5" onClick={() => setActiveTab("myclaims")}>
        <Card.Body className="!py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center shrink-0">
            <svg className="text-primary" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-black">내 접수 현황</div>
            <div className="text-[13px] text-gray-500 mt-0.5">TYPE C 2건 / TYPE A 1건</div>
          </div>
          <div className="text-[22px] font-bold text-primary">3건</div>
        </Card.Body>
      </Card>

      {/* Quick Menu */}
      <div className="section-title mt-6">빠른 메뉴</div>
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <QuickMenuItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
          label="사고접수"
          onClick={() => setActiveTab("claim")}
        />
        <QuickMenuItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          label="내 접수"
          onClick={() => setActiveTab("myclaims")}
        />
        <QuickMenuItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          label="보험안내"
          onClick={() => { setActiveTab("more"); setSubPage("insurance-info"); }}
        />
        <QuickMenuItem
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>}
          label="서류관리"
          onClick={() => { setActiveTab("more"); setSubPage("documents"); }}
        />
      </div>

      {/* Alert */}
      <Card variant="outlined" className="!border-primary-border !bg-primary-light mb-3.5">
        <Card.Body className="flex items-center gap-3 !py-3.5">
          <svg className="w-5 h-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[13px] text-gray-700 leading-relaxed">
            관리사무소 현장조사 요청 1건이 <b>진행중</b>입니다. 담당자 배정 후 연락드리겠습니다.
          </span>
        </Card.Body>
      </Card>
    </div>
  );
}

function QuickMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Card variant="outlined" className="text-center !py-5 !px-3" onClick={onClick}>
      <div className="w-7 h-7 text-primary mx-auto mb-2">{icon}</div>
      <span className="block text-sm font-semibold text-black">{label}</span>
    </Card>
  );
}
