import Badge from "@/components/common/Badge";
import List from "@/components/common/List";
import { useNavigate } from "react-router-dom";

function SubHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={() => navigate(-1)} className="btn btn-icon bg-gray-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <div className="animate-[fadeIn_0.25s_ease]">
      <SubHeader title="서류관리" />
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
