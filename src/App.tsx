import { AppProvider, useApp } from "@/contexts/AppContext";
import BottomTabBar from "@/components/layout/BottomTabBar";
import HomePage from "@/pages/HomePage";
import ClaimPage from "@/pages/ClaimPage";
import HistoryPage from "@/pages/HistoryPage";
import MorePage from "@/pages/MorePage";

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="max-w-[430px] mx-auto min-h-dvh flex flex-col relative overflow-x-hidden bg-gray-50">
      <div className="flex-1 px-4 pt-5 pb-[100px]">
        {activeTab === "home" && <HomePage />}
        {activeTab === "claim" && <ClaimPage />}
        {activeTab === "myclaims" && <HistoryPage />}
        {activeTab === "more" && <MorePage />}
      </div>
      <BottomTabBar />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
