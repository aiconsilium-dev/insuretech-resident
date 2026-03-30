import { useApp } from "@/contexts/AppContext";
import List from "@/components/common/List";
import { useNavigate } from "react-router-dom";

export default function MorePage() {
  const { user } = useApp();
  const navigate = useNavigate();

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
        <List.Item onClick={() => navigate("/insurance-info")}>
          <div className="w-[22px] h-[22px] text-gray-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-0.5">보험안내</h4>
            <p className="text-[13px] text-gray-500">내가 받을 수 있는 보상 확인</p>
          </div>
          <svg className="text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => navigate("/documents")}>
          <div className="w-[22px] h-[22px] text-gray-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold mb-0.5">서류관리</h4>
            <p className="text-[13px] text-gray-500">건축물대장, 등기부등본 제출</p>
          </div>
          <svg className="text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </List.Item>
        <List.Item onClick={() => navigate("/profile")}>
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
