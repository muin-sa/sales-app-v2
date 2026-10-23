"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import RequestCenterView from "@/components/requests/RequestCenterView";
import AssociationsPage from "@/components/associations/AssociationsPage";
import SettingsPage from "@/components/settings/SettingsPage";
import LicensesPage from "@/components/licenses/LicensesPage";
import RevenueTargetsPage from "@/components/revenue/RevenueTargetsPage";
import RelationshipsPage from "@/components/relations/RelationshipsPage";
import OperationLogPage from "@/components/logs/OperationLogPage";
import PlannerPage from "@/components/planner/PlannerPage";
import PhonesAndDataPage from "@/components/data/PhonesAndDataPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Right Sidebar (RTL) */}
      <Sidebar activeTab={activeTab} onSelectTab={(tabId) => setActiveTab(tabId)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {activeTab === "dashboard" ? (
          <Dashboard onNavigateToRequests={() => setActiveTab("requests")} />
        ) : activeTab === "associations" ? (
          <AssociationsPage />
        ) : activeTab === "requests" ? (
          <RequestCenterView />
        ) : activeTab === "licenses" ? (
          <LicensesPage />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : activeTab === "revenue" ? (
          <RevenueTargetsPage />
        ) : activeTab === "relations" ? (
          <RelationshipsPage />
        ) : activeTab === "plans" ? (
          <PlannerPage />
        ) : activeTab === "phones" ? (
          <PhonesAndDataPage />
        ) : activeTab === "logs" ? (
          <OperationLogPage />
        ) : (
          <div className="p-8 text-center text-slate-500">
            <h2 className="text-xl font-bold text-slate-800 mb-2">قريباً</h2>
            <p className="text-sm">هذا القسم قيد التطوير وفق الخطة المعتمدة.</p>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="mt-4 px-4 py-2 bg-[#1E1B4B] text-white text-xs font-semibold rounded-xl"
            >
              العودة للوحة التحكم
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
