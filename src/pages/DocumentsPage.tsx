import Badge from "@/components/common/Badge";
import List from "@/components/common/List";
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

export default function DocumentsPage() {
  return (
    <div className="animate-[fadeIn_0.25s_ease] px-[var(--space-page)] pt-[var(--space-page)] pb-24">
      <SubHeader title="서류관리" />
      <p className="text-sm text-text-muted mb-6">보험금 청구에 필요한 서류를 제출해주세요</p>

      <List className="border border-border">
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-bg-secondary flex items-center justify-center shrink-0 text-text-muted">─</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-body">건축물대장</h4>
            <p className="text-xs text-text-muted mt-0.5">건물 소유 확인용</p>
          </div>
          <Badge variant="primary">미제출</Badge>
        </List.Item>
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-bg-secondary flex items-center justify-center shrink-0 text-text-muted">─</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-body">등기부등본</h4>
            <p className="text-xs text-text-muted mt-0.5">소유권 확인용</p>
          </div>
          <Badge variant="primary">미제출</Badge>
        </List.Item>
        <List.Item>
          <div className="w-10 h-10 rounded-[10px] bg-bg-secondary flex items-center justify-center shrink-0 text-text-muted">─</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-body">신분증 사본</h4>
            <p className="text-xs text-text-muted mt-0.5">본인 확인용</p>
          </div>
          <Badge variant="gray">제출완료</Badge>
        </List.Item>
      </List>
      <p className="text-[13px] text-text-muted mt-3.5 leading-relaxed">서류는 보험금 청구 시 필요합니다. 미리 준비해두시면 심사가 빨라집니다. 사본도 인정됩니다.</p>
    </div>
  );
}
