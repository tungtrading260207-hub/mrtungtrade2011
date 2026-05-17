"use client";

import { useDashboard } from "@/components/DashboardLayoutProvider";
import CryptoAlgorithmic from "@/components/dashboard/CryptoAlgorithmic"; // Import the new component
import VNStockIntensive from "@/components/dashboard/VNStockIntensive";
import PineScriptHub from "@/components/dashboard/PineScriptHub";
import PaperTradingEngine from "@/components/dashboard/PaperTradingEngine";
import GeminiAIEngine from "@/components/dashboard/GeminiAIEngine";
import ErrorMonitorCenter from "@/components/dashboard/ErrorMonitorCenter";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PriceBoard from "@/components/dashboard/PriceBoard";

export default function Home() {
  const { activeTab } = useDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "Tổng quan thị trường":
        return (
          <ErrorBoundary moduleName="Tổng quan thị trường">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceBoard />
              <PaperTradingEngine />
            </div>
          </ErrorBoundary>
        );
      case "Dấu vết On-chain (Crypto Algorithmic)":
        return (
          <ErrorBoundary moduleName="Dấu vết On-chain">
            <CryptoAlgorithmic />
          </ErrorBoundary>
        );
      case "Tiêu chí Vĩ mô (VN-Stock Intensive)":
        return (
          <ErrorBoundary moduleName="Tiêu chí Vĩ mô">
            <VNStockIntensive />
          </ErrorBoundary>
        );
      case "Bộ lọc Kèo Vàng":
        return (
          <ErrorBoundary moduleName="Bộ lọc Kèo Vàng">
            <GeminiAIEngine />
          </ErrorBoundary>
        );
      case "Kho Pine Script Hub":
        return (
          <ErrorBoundary moduleName="Kho Pine Script Hub">
            <PineScriptHub />
          </ErrorBoundary>
        );
      case "Cấu hình API Hệ thống":
        return <div>Tab Cấu hình API Hệ thống đang phát triển...</div>;
      case "Giám sát & Tự bảo dưỡng":
        return <ErrorMonitorCenter />;
      default:
        return <div>Chọn một tab để xem nội dung.</div>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard: {activeTab}</h1>
      <div className="flex-1 rounded-lg border border-border p-6 bg-card">
        {renderContent()}
      </div>
    </div>
  );
}
