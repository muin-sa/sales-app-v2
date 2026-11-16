"use client";

import React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  Target,
  FileText,
  Bell,
  ListTodo,
  Phone,
  ShieldCheck,
  History,
  Settings,
  PanelRightClose,
  PanelRightOpen
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const navigationItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "associations", label: "الجمعيات", icon: Building2 },
  { id: "revenue", label: "الإيرادات والمستهدفات", icon: Target },
  { id: "requests", label: "مركز الطلبات", icon: FileText },
  { id: "relations", label: "العلاقات والمتابعة", icon: Bell },
  { id: "plans", label: "الخطط", icon: ListTodo },
  { id: "phones", label: "الجوالات والداتا", icon: Phone },
  { id: "licenses", label: "التراخيص والأصول", icon: ShieldCheck },
  { id: "logs", label: "سجل العمليات", icon: History },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar({ activeTab = "dashboard", onSelectTab }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`bg-white border-l border-slate-200/80 flex flex-col justify-between transition-all duration-300 select-none z-20 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/bayt-tamkeen-logo.jpg"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full bg-white object-contain ring-1 ring-slate-200"
            />
            {!collapsed && (
              <div className="flex flex-col text-right">
                <span className="font-bold text-slate-900 text-base leading-tight tracking-tight">
                  بيت التمكين
                </span>
                <span className="text-slate-400 text-xs font-normal">
                  منصة عمليات المبيعات
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {collapsed ? (
              <PanelRightOpen className="w-5 h-5" />
            ) : (
              <PanelRightClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab && onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                  isActive
                    ? "bg-slate-100/90 text-indigo-950 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-indigo-950 stroke-[2.2]" : "text-slate-500"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-950 text-white font-bold flex items-center justify-center text-sm shrink-0 border border-indigo-800">
            MB
          </div>
          <div className="flex flex-col text-right overflow-hidden">
            <span className="font-semibold text-xs text-slate-900 truncate">
              Mohammed Bin Hameedh
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              مدير المبيعات
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
