"use client";

import { useState } from "react";
import type { ViewType } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import AppHeader from "@/components/layout/app-header";
import PerformanceMonitoring from "@/components/dashboard/performance-monitoring";
import OptimizationAdvisor from "@/components/dashboard/optimization-advisor";
import ResourceForecasting from "@/components/dashboard/resource-forecasting";
import ConfigProfiler from "@/components/dashboard/config-profiler";
import CodeAnalysis from "@/components/dashboard/code-analysis";
import AlertsSettings from "@/components/dashboard/alerts-settings";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <PerformanceMonitoring />;
      case "advisor":
        return <OptimizationAdvisor />;
      case "forecasting":
        return <ResourceForecasting />;
      case "profiler":
        return <ConfigProfiler />;
      case "analysis":
        return <CodeAnalysis />;
      case "alerts":
        return <AlertsSettings />;
      default:
        return <PerformanceMonitoring />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex flex-1 flex-col">
          <AppHeader activeView={activeView} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
