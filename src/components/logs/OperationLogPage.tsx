"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Layers,
  Hash,
  Calendar,
  Clock,
  History,
  FileText,
  Building2,
  Shield,
  User,
  Activity,
  ArrowUpDown,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─────────────────────────────────────────────
// 1. Data Types & Interfaces (Matching operation_logs Table)
// ─────────────────────────────────────────────
export type ActionType = "CREATE" | "UPDATE" | "DELETE";
export type EntityType = "Request" | "Association" | "License" | "User";

export interface OperationLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  action: ActionType;
  affectedEntity: EntityType;
  recordId: string;
  details?: string;
  ipAddress?: string;
}

// ─────────────────────────────────────────────
// 2. Mock Data (Simulating operation_logs Core Table)
// ─────────────────────────────────────────────
const INITIAL_LOGS: OperationLog[] = [
  {
    id: "LOG-1092",
    timestamp: "2026-10-21 21:45:12",
    userName: "أحمد المنيباري",
    userEmail: "a.munibari@bayt-altamkeen.com",
    action: "CREATE",
    affectedEntity: "Request",
    recordId: "REQ-2026-00005",
    details: "إضافة طلب تسويقي جديد لجمعية إطعام وحفظ النعمة",
    ipAddress: "192.168.1.45",
  },
  {
    id: "LOG-1091",
    timestamp: "2026-10-21 20:12:05",
    userName: "Mohamed Bin Hameedh",
    userEmail: "binhameedh@gmail.com",
    action: "UPDATE",
    affectedEntity: "Association",
    recordId: "ASC-002",
    details: "تحديث بيانات مسؤول التواصل والمستهدف لجمعية روائع النجع",
    ipAddress: "192.168.1.12",
  },
  {
    id: "LOG-1090",
    timestamp: "2026-10-21 18:30:40",
    userName: "خالد الدوسري",
    userEmail: "k.aldosari@bayt-altamkeen.com",
    action: "DELETE",
    affectedEntity: "License",
    recordId: "LIC-9821-X",
    details: "أرشفة وإلغاء مسودة ترخيص حملة الكفالة الملغاة",
    ipAddress: "192.168.1.88",
  },
  {
    id: "LOG-1089",
    timestamp: "2026-10-21 16:15:22",
    userName: "سالم المنصور",
    userEmail: "s.almansour@bayt-altamkeen.com",
    action: "UPDATE",
    affectedEntity: "Request",
    recordId: "REQ-2026-00003",
    details: "تغيير حالة الطلب من (قيد التنفيذ) إلى (بانتظار المشرف)",
    ipAddress: "192.168.1.34",
  },
  {
    id: "LOG-1088",
    timestamp: "2026-10-21 14:05:00",
    userName: "م. عبدالعزيز التميمي",
    userEmail: "admin@tamkeen-mkt.sa",
    action: "CREATE",
    affectedEntity: "User",
    recordId: "USR-004",
    details: "إنشاء حساب مستخدم جديد بدور (محاسب مالي)",
    ipAddress: "192.168.1.10",
  },
  {
    id: "LOG-1087",
    timestamp: "2026-10-20 11:22:15",
    userName: "أحمد المنيباري",
    userEmail: "a.munibari@bayt-altamkeen.com",
    action: "UPDATE",
    affectedEntity: "Association",
    recordId: "ASC-001",
    details: "تعديل حالة اتفاقية جمعية المحيصة إلى (نشط معتمد)",
    ipAddress: "192.168.1.45",
  },
  {
    id: "LOG-1086",
    timestamp: "2026-10-20 09:14:30",
    userName: "سلطان المنصور",
    userEmail: "sales.mgr@ghazara.sa",
    action: "UPDATE",
    affectedEntity: "License",
    recordId: "LIC-2026-9812",
    details: "تحديث تاريخ صلاحية ترخيص جمع التبرعات وتجديد المرفقات",
    ipAddress: "192.168.1.55",
  },
  {
    id: "LOG-1085",
    timestamp: "2026-10-19 15:40:10",
    userName: "سارة فهد القحطاني",
    userEmail: "sara.mkt@moeen-digital.sa",
    action: "CREATE",
    affectedEntity: "Request",
    recordId: "REQ-2026-00002",
    details: "رفع طلب سندات كفالة طبية برقم مرجعي REQ-2026-1002",
    ipAddress: "192.168.1.62",
  },
];

// Helper: Action Badges
function renderActionBadge(action: ActionType) {
  switch (action) {
    case "CREATE":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold px-2.5 py-0.5 text-[11px] gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          إنشاء (CREATE)
        </Badge>
      );
    case "UPDATE":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-bold px-2.5 py-0.5 text-[11px] gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          تعديل (UPDATE)
        </Badge>
      );
    case "DELETE":
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-bold px-2.5 py-0.5 text-[11px] gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          حذف (DELETE)
        </Badge>
      );
  }
}

// Helper: Entity Badges
function renderEntityBadge(entity: EntityType) {
  const configs: Record<EntityType, { label: string; icon: React.ReactNode; style: string }> = {
    Request: {
      label: "طلب مبيعات",
      icon: <FileText className="w-3 h-3 text-purple-700" />,
      style: "bg-purple-50 text-purple-900 border-purple-200",
    },
    Association: {
      label: "جمعية خيرية",
      icon: <Building2 className="w-3 h-3 text-blue-700" />,
      style: "bg-blue-50 text-blue-900 border-blue-200",
    },
    License: {
      label: "ترخيص نظامي",
      icon: <Shield className="w-3 h-3 text-indigo-700" />,
      style: "bg-indigo-50 text-indigo-900 border-indigo-200",
    },
    User: {
      label: "مستخدم نظام",
      icon: <User className="w-3 h-3 text-slate-700" />,
      style: "bg-slate-100 text-slate-800 border-slate-200",
    },
  };

  const item = configs[entity];

  return (
    <Badge variant="outline" className={`${item.style} font-medium px-2.5 py-0.5 text-xs gap-1.5`}>
      {item.icon}
      <span>{item.label}</span>
    </Badge>
  );
}

// ─────────────────────────────────────────────
// Component: OperationLogPage
// ─────────────────────────────────────────────
export default function OperationLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");

  // Dynamic Filtering
  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter((log) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        log.userName.toLowerCase().includes(q) ||
        log.userEmail.toLowerCase().includes(q) ||
        log.recordId.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q));

      const matchesEntity = selectedEntity === "ALL" || log.affectedEntity === selectedEntity;
      const matchesAction = selectedAction === "ALL" || log.action === selectedAction;

      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [searchQuery, selectedEntity, selectedAction]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: INITIAL_LOGS.length,
      creates: INITIAL_LOGS.filter((l) => l.action === "CREATE").length,
      updates: INITIAL_LOGS.filter((l) => l.action === "UPDATE").length,
      deletes: INITIAL_LOGS.filter((l) => l.action === "DELETE").length,
    };
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ─────────────────────────────────────────────
          1. Header Section
      ───────────────────────────────────────────── */}
      <PageHeader
        overline="الأمان والرقابة والتدقيق التاريخي (Audit Trail)"
        badge={<ShieldCheck className="w-4 h-4 text-purple-900" />}
        title="سجل العمليات (Operation Log)"
        subtitle="سجل أحادي الاتجاه غير قابل للتعديل لتتبع كافة الإجراءات والتغييرات الحاصلة في النظام، المطابق لجدول operation_logs."
        actions={
          <div className="bg-white border border-slate-200/90 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-xs shrink-0">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-950 flex items-center justify-center font-black font-mono text-base border border-purple-100">
              {filteredLogs.length}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">سجلات معروضة من أصل {stats.total}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mt-0.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>سجل محمي وموثق تلقائياً</span>
              </div>
            </div>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────
          Main Container
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 mt-8 space-y-6 pb-16">
        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">إجمالي الأحداث</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {stats.total}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 block">عمليات الإنشاء</span>
              <span className="text-2xl font-black text-emerald-900 font-mono mt-1 block">
                {stats.creates}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="text-xs font-black font-mono">+ADD</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 block">عمليات التعديل</span>
              <span className="text-2xl font-black text-amber-900 font-mono mt-1 block">
                {stats.updates}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="text-xs font-black font-mono">MOD</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-700 block">عمليات الحذف</span>
              <span className="text-2xl font-black text-rose-900 font-mono mt-1 block">
                {stats.deletes}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <span className="text-xs font-black font-mono">DEL</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            2. Search & Filter Bar
        ───────────────────────────────────────────── */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Input
              placeholder="ابحث باسم المستخدم، البريد، رقم السجل (Record ID)، أو التفاصيل..."
              className="pr-10 bg-slate-50/50 border-slate-200 focus-visible:ring-purple-900 h-11 text-sm placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Entity Filter */}
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[170px] bg-slate-50/50 border-slate-200 h-11 text-xs font-bold">
                <Layers className="w-4 h-4 ml-2 text-slate-400 shrink-0" />
                <SelectValue placeholder="الكيان المتأثر" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="ALL">كل الكيانات (ALL)</SelectItem>
                <SelectItem value="Request">الطلبات (Request)</SelectItem>
                <SelectItem value="Association">الجمعيات (Association)</SelectItem>
                <SelectItem value="License">التراخيص (License)</SelectItem>
                <SelectItem value="User">المستخدمين (User)</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Filter */}
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-[160px] bg-slate-50/50 border-slate-200 h-11 text-xs font-bold">
                <Filter className="w-4 h-4 ml-2 text-slate-400 shrink-0" />
                <SelectValue placeholder="نوع الإجراء" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="ALL">جميع الإجراءات (ALL)</SelectItem>
                <SelectItem value="CREATE">إنشاء (CREATE)</SelectItem>
                <SelectItem value="UPDATE">تعديل (UPDATE)</SelectItem>
                <SelectItem value="DELETE">حذف (DELETE)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            3. Read-Only Data Table
        ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-48">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>التوقيت (Timestamp)</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 w-64">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>المستخدم (User)</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 w-36">الإجراء (Action)</th>
                  <th className="py-4 px-6 w-36">الكيان (Entity)</th>
                  <th className="py-4 px-6 w-40">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span>رقم السجل (Record ID)</span>
                    </div>
                  </th>
                  <th className="py-4 px-6">التفاصيل والوصف</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-500 text-right whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-indigo-950 text-white font-bold text-xs shrink-0 border border-indigo-900">
                            <AvatarFallback className="bg-indigo-950 text-white font-bold">
                              {log.userName.trim().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 truncate group-hover:text-purple-950 transition-colors">
                              {log.userName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono truncate">
                              {log.userEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderActionBadge(log.action)}
                      </td>

                      {/* Affected Entity */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderEntityBadge(log.affectedEntity)}
                      </td>

                      {/* Record ID */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold inline-block">
                          {log.recordId}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-6 text-slate-600 text-xs leading-relaxed max-w-md">
                        <span title={log.details}>{log.details || "—"}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty State */
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
                          <ShieldCheck className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-700">
                          لم يتم العثور على أي سجلات مطابقة
                        </p>
                        <p className="text-xs text-slate-400">
                          جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية لعرض السجلات.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-50/70 border-t border-slate-200/90 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>سجل العرض: للقراءة والتدقيق فقط (Read-Only Audit Trail)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              متوافق مع معايير الأمان والرقابة للنظام وقاعدة بيانات PostgreSQL
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
