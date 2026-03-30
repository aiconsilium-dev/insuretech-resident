import { createContext, useContext, useState, type ReactNode } from "react";
import type { TabId, UserInfo, SubPage } from "@/lib/types";

interface AppContextType {
  user: UserInfo;
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

  return (
    <AppContext.Provider
      value={{ user }}
    >
      {children}
    </AppContext.Provider>
  );
}
