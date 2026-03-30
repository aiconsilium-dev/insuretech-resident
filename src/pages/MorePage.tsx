import { useApp } from "@/contexts/AppContext";
import type { SubPage } from "@/lib/types";
import Card from "@/components/common/Card";
import List from "@/components/common/List";
import Badge from "@/components/common/Badge";

export default function MorePage() {
  const { user, subPage, setSubPage } = useApp();

  if (subPage === "insurance-info") return <InsuranceInfoPage onBack={() => setSubPage(null)} />;
  if (subPage === "documents") return <DocumentsPage onBack={() => setSubPage(null)} />;
  if (subPage === "profile") return <ProfilePage user={user} onBack={() => setSubPage(null)} />;

  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      {/* Profile */}
      <div className="text-center py-8">
        <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3.5 text-3xl font-bold text-gray-400">
          {user.name.charAt(0)}
        </div>
        <div className="text-xl font-bold mb-1">{user.name}</div>
        <div className="text-sm text-gray-500">{user.apt} {user.dong}동 {user.ho}호</div>
      </div>

      {/* Menu — List compound */}
      <List className="border border-gray-200">
        <List.Item onClick={() => setSubPage("insurance-info")}>
          <div className="w-[22px] h-[22px] text-gray-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-0.5">보험안내</h4>
            <p className="text-[13px] text-gray-500">내가 받을 수 있는 보상 확인</p>
          </div>
          <svg className="text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => setSubPage("documents")}>
          <div className="w-[22px] h-[22px] text-gray-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-0.5">서류관리</h4>
            <p className="text-[13px] text-gray-500">건축물대장, 등기부등본 제출</p>
          </div>
          <svg className="text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => setSubPage("profile")}>
          <div className="w-[22px] h-[22px] text-gray-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-0.5">프로필</h4>
            <p className="text-[13px] text-gray-500">내 정보 확인</p>
          </div>
          <svg className="text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
      </List>
    </div>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="btn btn-icon bg-gray-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function InsuranceInfoPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      <SubHeader title="보험안내" onBack={onBack} />
      <h2 className="text-[22px] font-bold mb-1.5">내가 받을 수 있는 보상</h2>
      <p className="text-sm text-gray-500 mb-6">단지 보험 및 개인 보험 안내</p>

      <InfoCard dotColor="bg-primary" title="CGL (영업배상책임보험)" content={
        <>
          <p className="text-sm text-gray-600 leading-relaxed">공용부분의 하자나 관리 소홀로 인해 내 세대에 피해가 발생한 경우, <b>관리사무소가 가입한 영업배상책임보험</b>으로 보상받을 수 있습니다.</p>
          <p className="text-sm text-primary font-semibold mt-2">누수, 시설사고, 공용부 하자 피해 시 해당</p>
        </>
      } />
      <InfoCard dotColor="bg-black" title="주택화재보험" content={
        <>
          <p className="text-sm text-gray-600 leading-relaxed">본인이 가입한 주택화재보험이 있다면 <b>우선 청구가 가능</b>합니다. 화재뿐 아니라 풍수해, 급배수 설비 사고 등도 특약에 따라 보상 범위에 포함될 수 있습니다.</p>
          <p className="text-sm font-semibold mt-2">가입 보험사에 보장 범위를 확인하세요</p>
        </>
      } />
      <InfoCard dotColor="bg-gray-400" title="가재보험 (가재도구 특약)" content={
        <p className="text-sm text-gray-600 leading-relaxed">가전제품, 가구 등 <b>가재도구 피해</b>는 개인이 가입한 화재보험의 가재도구 특약으로 보상받을 수 있습니다. 특약 가입 여부를 먼저 확인해주세요.</p>
      } />
    </div>
  );
}

function DocumentsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      <SubHeader title="서류관리" onBack={onBack} />
      <p className="text-sm text-gray-500 mb-6">보험금 청구에 필요한 서류를 제출해주세요</p>

      <List className="border border-gray-200">
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold">건축물대장</h4>
            <p className="text-xs text-gray-500 mt-0.5">건물 소유 확인용</p>
          </div>
          <Badge variant="primary">미제출</Badge>
        </List.Item>
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold">등기부등본</h4>
            <p className="text-xs text-gray-500 mt-0.5">소유권 확인용</p>
          </div>
          <Badge variant="primary">미제출</Badge>
        </List.Item>
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold">신분증 사본</h4>
            <p className="text-xs text-gray-500 mt-0.5">본인 확인용</p>
          </div>
          <Badge variant="gray">제출완료</Badge>
        </List.Item>
      </List>
      <p className="text-[13px] text-gray-500 mt-3.5 leading-relaxed">서류는 보험금 청구 시 필요합니다. 미리 준비해두시면 심사가 빨라집니다. 사본도 인정됩니다.</p>
    </div>
  );
}

function ProfilePage({ user, onBack }: { user: { name: string; apt: string; dong: string; ho: string }; onBack: () => void }) {
  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      <SubHeader title="프로필" onBack={onBack} />
      <Card variant="outlined" className="!p-6">
        <ProfileRow label="이름" value={user.name} />
        <ProfileRow label="단지" value={user.apt} />
        <ProfileRow label="동" value={`${user.dong}동`} />
        <ProfileRow label="호" value={`${user.ho}호`} />
        <ProfileRow label="구분" value="입주민" />
      </Card>
    </div>
  );
}

function InfoCard({ dotColor, title, content }: { dotColor: string; title: string; content: React.ReactNode }) {
  return (
    <Card variant="outlined" className="!p-5 mb-3.5">
      <h4 className="text-base font-bold mb-2.5 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        {title}
      </h4>
      {content}
    </Card>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
