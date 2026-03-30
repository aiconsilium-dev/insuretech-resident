import { createContext, useContext, useState, type ReactNode } from "react";
import type { TabId, UserInfo, SubPage } from "@/lib/types";

interface AppContextType {
  user: UserInfo;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  subPage: SubPage;
  setSubPage: (page: SubPage) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function getUserFromParams(): UserInfo {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name") || "홍길동",
    apt: params.get("apt") || "헬리오시티",
    dong: params.get("dong") || "101",
    ho: params.get("ho") || "1502",
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<UserInfo>(getUserFromParams);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [subPage, setSubPage] = useState<SubPage>(null);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    setSubPage(null);
  }

  return (
    <AppContext.Provider
      value={{ user, activeTab, setActiveTab: handleTabChange, subPage, setSubPage }}
    >
      {children}
    </AppContext.Provider>
  );
}
