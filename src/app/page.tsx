"use client";

import { useDashboard } from "@/components/DashboardLayoutProvider";
import CryptoAlgorithmic from "@/components/dashboard/CryptoAlgorithmic"; // Import the new component
import VNStockIntensive from "@/components/dashboard/VNStockIntensive";

export default function Home() {
  const { activeTab } = useDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "Tổng quan thị trường":
        return <div>Tab Tổng quan thị trường đang phát triển...</div>;
      case "Dấu vết On-chain (Crypto Algorithmic)":
        return <CryptoAlgorithmic />;
      case "Tiêu chí Vĩ mô (VN-Stock Intensive)":
        return <VNStockIntensive />;
      case "Bộ lọc Kèo Vàng":
        return <div>Tab Bộ lọc Kèo Vàng đang phát triển...</div>;
      case "Kho Pine Script Hub":
        return <div>Tab Kho Pine Script Hub đang phát triển...</div>;
      case "Cấu hình API Hệ thống":
        return <div>Tab Cấu hình API Hệ thống đang phát triển...</div>;
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
