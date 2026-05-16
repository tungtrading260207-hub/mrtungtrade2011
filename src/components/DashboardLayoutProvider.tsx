
"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface DashboardContextType {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardLayoutProvider");
  }
  return context;
};

export function DashboardLayoutProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("Tổng quan thị trường");

  return (
    <DashboardContext.Provider value={{ activeTab, onTabChange: setActiveTab }}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <div className="flex flex-1">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
