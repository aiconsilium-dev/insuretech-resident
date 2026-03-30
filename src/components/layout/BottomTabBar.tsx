import { useApp } from "@/contexts/AppContext";
import type { TabId } from "@/lib/types";
import TabBar from "@/components/common/TabBar";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "홈",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "claim",
    label: "사고접수",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    id: "myclaims",
    label: "내 접수",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "더보기",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  },
];

export default function BottomTabBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <TabBar>
      {tabs.map((tab) => (
        <TabBar.Item
          key={tab.id}
          active={activeTab === tab.id}
          icon={tab.icon}
          label={tab.label}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </TabBar>
  );
}
