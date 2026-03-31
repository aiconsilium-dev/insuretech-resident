import { useApp } from "@/contexts/AppContext";
import List from "@/components/common/List";
import { useNavigate } from "react-router-dom";

export default function MorePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      {/* Profile */}
      <div className="text-center py-8">
        <div className="w-[72px] h-[72px] rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-3.5 text-3xl font-bold text-text-dim">
          {user.name.charAt(0)}
        </div>
        <div className="text-xl font-bold text-text-heading mb-1">{user.name}</div>
        <div className="text-sm text-text-muted">{user.apt} {user.dong}동 {user.ho}호</div>
      </div>

      {/* Menu */}
      <List className="border border-border">
        <List.Item onClick={() => navigate("/insurance-info")}>
          <div className="w-[22px] h-[22px] text-text-muted shrink-0 flex items-center justify-center">◆</div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-text-body mb-0.5">보험안내</h4>
            <p className="text-[13px] text-text-muted">내가 받을 수 있는 보상 확인</p>
          </div>
          <svg className="text-text-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => navigate("/documents")}>
          <div className="w-[22px] h-[22px] text-text-muted shrink-0 flex items-center justify-center">─</div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-text-body mb-0.5">서류관리</h4>
            <p className="text-[13px] text-text-muted">건축물대장, 등기부등본 제출</p>
          </div>
          <svg className="text-text-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => navigate("/profile")}>
          <div className="w-[22px] h-[22px] text-text-muted shrink-0 flex items-center justify-center">●</div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-text-body mb-0.5">프로필</h4>
            <p className="text-[13px] text-text-muted">내 정보 확인</p>
          </div>
          <svg className="text-text-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
      </List>
    </div>
  );
}
