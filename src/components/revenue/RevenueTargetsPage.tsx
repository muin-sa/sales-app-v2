"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Target,
  Banknote,
  Percent,
  Building2,
  Users,
  Pencil,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
  DollarSign,
  Sparkles,
  X,
  FileSpreadsheet,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

// ─────────────────────────────────────────────
// Types & Schema Alignment
// ─────────────────────────────────────────────
export type UserRole = "admin" | "sales_manager" | "marketer" | "accountant";

export interface ContractEntityPerformance {
  id: string;
  code: "BAYT_TAMKEEN" | "GHAZARA" | "MOEEN";
  nameAr: string;
  nameEn: string;
  monthlyTarget: number;
  achievedRevenue: number;
  associationsCount: number;
  growthRate: number; // e.g. +18.5%
  themeColor: string;
}

export interface MarketerPerformance {
  id: string;
  name: string;
  role: string;
  entityCode: "BAYT_TAMKEEN" | "GHAZARA" | "MOEEN";
  entityName: string;
  monthlyTarget: number;
  achievedRevenue: number;
  completedRequests: number;
}

// ─────────────────────────────────────────────
// Seed Data Compatible with Database Schema
// ─────────────────────────────────────────────
const INITIAL_ENTITIES: ContractEntityPerformance[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    code: "BAYT_TAMKEEN",
    nameAr: "مؤسسة بيت التمكين للتسويق",
    nameEn: "Bayt Al-Tamkeen Marketing",
    monthlyTarget: 800000,
    achievedRevenue: 640000,
    associationsCount: 18,
    growthRate: 16.4,
    themeColor: "from-purple-900 to-indigo-950",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    code: "GHAZARA",
    nameAr: "شركة غزارة للتجارة والتسويق",
    nameEn: "Ghazara Trading & Marketing",
    monthlyTarget: 600000,
    achievedRevenue: 495000,
    associationsCount: 14,
    growthRate: 21.2,
    themeColor: "from-indigo-900 to-blue-950",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    code: "MOEEN",
    nameAr: "مؤسسة معين الرقمية التجارية",
    nameEn: "Moeen Digital Commercial",
    monthlyTarget: 450000,
    achievedRevenue: 315000,
    associationsCount: 9,
    growthRate: 12.8,
    themeColor: "from-slate-900 to-purple-950",
  },
];

const INITIAL_MARKETERS: MarketerPerformance[] = [
  {
    id: "aaaa2222-0000-0000-0000-000000000002",
    name: "أ. سلطان المنصور",
    role: "مدير مبيعات",
    entityCode: "GHAZARA",
    entityName: "شركة غزارة",
    monthlyTarget: 500000,
    achievedRevenue: 410000,
    completedRequests: 12,
  },
  {
    id: "aaaa3333-0000-0000-0000-000000000003",
    name: "أحمد منصور البارقي",
    role: "مسوق ميداني",
    entityCode: "GHAZARA",
    entityName: "شركة غزارة",
    monthlyTarget: 150000,
    achievedRevenue: 135000,
    completedRequests: 8,
  },
  {
    id: "aaaa4444-0000-0000-0000-000000000004",
    name: "سارة فهد القحطاني",
    role: "مسوقة ميدانية",
    entityCode: "MOEEN",
    entityName: "معين الرقمية",
    monthlyTarget: 180000,
    achievedRevenue: 142000,
    completedRequests: 7,
  },
  {
    id: "aaaa1111-0000-0000-0000-000000000001",
    name: "م. عبدالعزيز التميمي",
    role: "مدير النظام العام",
    entityCode: "BAYT_TAMKEEN",
    entityName: "بيت التمكين",
    monthlyTarget: 300000,
    achievedRevenue: 280000,
    completedRequests: 15,
  },
];

// Helper: Format Currency in Saudi Riyal
function formatSAR(val: number): string {
  return val.toLocaleString("en-US") + " ر.س.";
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function RevenueTargetsPage() {
  // RBAC State: Current active user role (defaulting to sales_manager as logged-in Mohammed Bin Hameedh)
  const [currentRole, setCurrentRole] = useState<UserRole>("sales_manager");

  // Data State
  const [entities, setEntities] = useState<ContractEntityPerformance[]>(INITIAL_ENTITIES);
  const [marketers, setMarketers] = useState<MarketerPerformance[]>(INITIAL_MARKETERS);

  // Filter State
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>("ALL");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editTargetItem, setEditTargetItem] = useState<{
    type: "entity" | "marketer";
    id: string;
    name: string;
    currentTarget: number;
  } | null>(null);
  const [newTargetValue, setNewTargetValue] = useState<string>("");

  // Check RBAC permission: Only admin or sales_manager can edit targets
  const canEditTarget = currentRole === "admin" || currentRole === "sales_manager";

  // Calculations for Totals & KPIs
  const totals = useMemo(() => {
    const totalAchieved = entities.reduce((acc, curr) => acc + curr.achievedRevenue, 0);
    const totalMonthlyTarget = entities.reduce((acc, curr) => acc + curr.monthlyTarget, 0);
    const totalAnnualTarget = totalMonthlyTarget * 12;
    const achievementRate = totalMonthlyTarget > 0 ? (totalAchieved / totalMonthlyTarget) * 100 : 0;
    const remainingToTarget = Math.max(0, totalMonthlyTarget - totalAchieved);

    // Weighted average growth
    const avgGrowth =
      entities.reduce((acc, curr) => acc + curr.growthRate, 0) / (entities.length || 1);

    return {
      totalAchieved,
      totalMonthlyTarget,
      totalAnnualTarget,
      achievementRate,
      remainingToTarget,
      avgGrowth,
    };
  }, [entities]);

  // Filtered Entities
  const filteredEntities = useMemo(() => {
    if (selectedEntityFilter === "ALL") return entities;
    return entities.filter((e) => e.code === selectedEntityFilter);
  }, [entities, selectedEntityFilter]);

  // Filtered Marketers
  const filteredMarketers = useMemo(() => {
    if (selectedEntityFilter === "ALL") return marketers;
    return marketers.filter((m) => m.entityCode === selectedEntityFilter);
  }, [marketers, selectedEntityFilter]);

  // Handlers for Target Modification
  const handleOpenEditModal = (
    type: "entity" | "marketer",
    id: string,
    name: string,
    currentTarget: number
  ) => {
    if (!canEditTarget) return;
    setEditTargetItem({ type, id, name, currentTarget });
    setNewTargetValue(currentTarget.toString());
    setIsEditModalOpen(true);
  };

  const handleSaveTarget = () => {
    if (!editTargetItem) return;
    const numericVal = parseFloat(newTargetValue.replace(/,/g, ""));
    if (isNaN(numericVal) || numericVal < 0) {
      alert("يرجى إدخال مبلغ صحيح أكبر من الصفر.");
      return;
    }

    if (editTargetItem.type === "entity") {
      setEntities((prev) =>
        prev.map((item) =>
          item.id === editTargetItem.id ? { ...item, monthlyTarget: numericVal } : item
        )
      );
    } else {
      setMarketers((prev) =>
        prev.map((item) =>
          item.id === editTargetItem.id ? { ...item, monthlyTarget: numericVal } : item
        )
      );
    }

    setIsEditModalOpen(false);
    setEditTargetItem(null);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ─────────────────────────────────────────────
          Top Header & Navigation Bar
      ───────────────────────────────────────────── */}
      <PageHeader
        overline="القطاع المالي والمبيعات · سنة 2026"
        badge={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
        title="الإيرادات والمستهدفات"
        subtitle="لوحة متقدمة لمتابعة تحقيق الإيرادات مقارنة بالمستهدفات الشهرية والسنوية على مستوى الجهات التعاقدية وفريق المبيعات."
        actions={
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>دور المعاينة (RBAC):</span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-900"
              >
                <option value="sales_manager">مدير مبيعات (Sales Manager)</option>
                <option value="admin">مدير نظام (Admin)</option>
                <option value="marketer">مسوق ميداني (Marketer)</option>
                <option value="accountant">محاسب مالي (Accountant)</option>
              </select>

              {canEditTarget ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-[11px] gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  مخوّل بتعديل المستهدفات
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium text-[11px] gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  صلاحية قراءة فقط
                </Badge>
              )}
            </div>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────
          Main Dashboard Content Area
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        {/* Filters and Timeframe Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 ml-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> تصفية الجهات:
            </span>
            {[
              { id: "ALL", label: "كافة الجهات التعاقدية" },
              { id: "BAYT_TAMKEEN", label: "مؤسسة بيت التمكين" },
              { id: "GHAZARA", label: "شركة غزارة" },
              { id: "MOEEN", label: "مؤسسة معين" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedEntityFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedEntityFilter === f.id
                    ? "bg-[#1E1B4B] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-900" />
              <span>الفترة: أكتوبر 2026 (الشهري)</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            4 KPI Metric Cards
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Achieved Revenue */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">إجمالي الإيراد المحقق</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatSAR(totals.totalAchieved)}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>محقق فعلياً من سندات التبرعات</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Total Monthly / Annual Target */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-900" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">المستهدف الشهري المطلوب</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatSAR(totals.totalMonthlyTarget)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>المستهدف السنوي التقديري:</span>
                  <span className="font-bold text-slate-600 font-mono">
                    {formatSAR(totals.totalAnnualTarget)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Achievement Rate */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-purple-600" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">نسبة التحقيق الإجمالية</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-purple-950 font-mono">
                    {totals.achievementRate.toFixed(1)}%
                  </div>
                  <span className="text-xs font-bold text-slate-400">من مستهدف الشهر</span>
                </div>
                {/* Visual mini bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-purple-700 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, totals.achievementRate)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Growth Rate */}
          <Card className="rounded-2xl border-slate-200/90 shadow-xs bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">معدل النمو الشهري</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900 font-mono flex items-center gap-1">
                  <span>+{totals.avgGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>المتبقي للهدف:</span>
                  <span className="font-bold text-rose-600 font-mono">
                    {formatSAR(totals.remainingToTarget)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─────────────────────────────────────────────
            Section 1: Contract Entities Performance Table
        ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-950" />
                <h2 className="text-lg font-bold text-slate-900">
                  أداء الجهات التعاقدية (Contract Entities)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                توزيع المستهدفات ومستوى التحقيق ومعدلات الإنجاز على مستوى الشركات الشقيقة
              </p>
            </div>

            {canEditTarget && (
              <Badge className="bg-indigo-50 text-indigo-900 border-indigo-200 text-xs px-3 py-1 font-semibold">
                اضغط على &ldquo;تعديل المستهدف&rdquo; في الجدول لتحديث أهداف أي جهة
              </Badge>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-bold text-slate-600">
                  <th className="py-4 px-6">الجهة التعاقدية</th>
                  <th className="py-4 px-6">المستهدف الشهري</th>
                  <th className="py-4 px-6">الإيراد المحقق</th>
                  <th className="py-4 px-6">المتبقي للهدف</th>
                  <th className="py-4 px-6 w-64">نسبة الإنجاز ومؤشر التقدم</th>
                  <th className="py-4 px-6 text-center">الجمعيات</th>
                  <th className="py-4 px-6 text-center">النمو</th>
                  <th className="py-4 px-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEntities.map((entity) => {
                  const rate =
                    entity.monthlyTarget > 0
                      ? (entity.achievedRevenue / entity.monthlyTarget) * 100
                      : 0;
                  const remaining = Math.max(0, entity.monthlyTarget - entity.achievedRevenue);

                  // Dynamic color indicator based on achievement
                  const progressColor =
                    rate >= 80
                      ? "bg-emerald-500"
                      : rate >= 60
                      ? "bg-indigo-600"
                      : rate >= 40
                      ? "bg-amber-500"
                      : "bg-rose-500";

                  const badgeColor =
                    rate >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : rate >= 60
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <tr
                      key={entity.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Entity Name & Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${entity.themeColor} text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0`}
                          >
                            {entity.code === "BAYT_TAMKEEN"
                              ? "تمكين"
                              : entity.code === "GHAZARA"
                              ? "غزارة"
                              : "معين"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                              {entity.nameAr}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {entity.nameEn}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Monthly Target */}
                      <td className="py-4 px-6 font-bold font-mono text-slate-900 text-[15px]">
                        {formatSAR(entity.monthlyTarget)}
                      </td>

                      {/* Achieved Revenue */}
                      <td className="py-4 px-6 font-bold font-mono text-emerald-600 text-[15px]">
                        {formatSAR(entity.achievedRevenue)}
                      </td>

                      {/* Remaining */}
                      <td className="py-4 px-6 font-bold font-mono text-rose-600 text-xs">
                        {remaining > 0 ? formatSAR(remaining) : "تم تحقيق المستهدف كاملًا ✓"}
                      </td>

                      {/* Progress Bar & Rate */}
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="font-mono text-slate-800">{rate.toFixed(1)}%</span>
                            <Badge className={`${badgeColor} text-[10px] px-2 py-0.5 font-bold`}>
                              {rate >= 100
                                ? "مكتمل فائق"
                                : rate >= 80
                                ? "أداء ممتاز"
                                : rate >= 60
                                ? "قيد التقدم"
                                : "يحتاج متابعة"}
                            </Badge>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${progressColor} rounded-full transition-all duration-700`}
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Associations Count */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                          {entity.associationsCount} جمعية
                        </span>
                      </td>

                      {/* Growth */}
                      <td className="py-4 px-6 text-center font-mono font-bold text-emerald-600 text-xs">
                        +{entity.growthRate}%
                      </td>

                      {/* Edit Target Action (Protected by RBAC) */}
                      <td className="py-4 px-6 text-center">
                        {canEditTarget ? (
                          <button
                            onClick={() =>
                              handleOpenEditModal(
                                "entity",
                                entity.id,
                                entity.nameAr,
                                entity.monthlyTarget
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-900 hover:text-white text-indigo-900 text-xs font-bold rounded-xl transition-all shadow-xs"
                            title="تعديل المستهدف الشهري لهذه الجهة"
                          >
                            <Pencil className="w-3 h-3" />
                            تعديل المستهدف
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs italic select-none">
                            عرض فقط
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            Section 2: Marketers & Sales Team Targets
        ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-950" />
                <h2 className="text-lg font-bold text-slate-900">
                  مستهدفات فريق المبيعات والمسوقين (Users Targets)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                المستهدفات الشهرية للأفراد المسجلة في جدول المستخدمين (users.monthly_target) ومتابعة
                نسب إنجاز كل مسؤول
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-bold text-slate-600">
                  <th className="py-4 px-6">المسوق / المسؤول</th>
                  <th className="py-4 px-6">الجهة التابعة</th>
                  <th className="py-4 px-6">المستهدف الفردي</th>
                  <th className="py-4 px-6">الإنجاز المحقق</th>
                  <th className="py-4 px-6">الطلبات المنجزة</th>
                  <th className="py-4 px-6 w-56">نسبة التحقيق</th>
                  <th className="py-4 px-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMarketers.map((marketer) => {
                  const rate =
                    marketer.monthlyTarget > 0
                      ? (marketer.achievedRevenue / marketer.monthlyTarget) * 100
                      : 0;

                  return (
                    <tr
                      key={marketer.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-950 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {marketer.name.split(" ")[0][0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{marketer.name}</div>
                            <div className="text-xs text-slate-400">{marketer.role}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                        {marketer.entityName}
                      </td>

                      <td className="py-4 px-6 font-bold font-mono text-slate-900 text-sm">
                        {formatSAR(marketer.monthlyTarget)}
                      </td>

                      <td className="py-4 px-6 font-bold font-mono text-emerald-600 text-sm">
                        {formatSAR(marketer.achievedRevenue)}
                      </td>

                      <td className="py-4 px-6 text-xs font-bold text-slate-600">
                        {marketer.completedRequests} طلبات
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
                            <span>{rate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        {canEditTarget ? (
                          <button
                            onClick={() =>
                              handleOpenEditModal(
                                "marketer",
                                marketer.id,
                                marketer.name,
                                marketer.monthlyTarget
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-950 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all"
                            title="تعديل مستهدف هذا المسوق"
                          >
                            <Pencil className="w-3 h-3" />
                            تعديل المستهدف
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">عرض فقط</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────
          Edit Target Modal (Role Protected)
      ───────────────────────────────────────────── */}
      {isEditModalOpen && editTargetItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={(e) => e.target === e.currentTarget && setIsEditModalOpen(false)}
        >
          <div
            dir="rtl"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-950 text-white flex items-center justify-center shadow-xs">
                  <Pencil className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تعديل المستهدف المالي</h3>
                  <p className="text-xs text-slate-500">
                    {editTargetItem.type === "entity" ? "جهة تعاقدية" : "مسؤول مبيعات"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-2xl">
                <span className="text-xs text-indigo-900 font-medium block">الجهة / المسؤول:</span>
                <span className="text-sm font-black text-indigo-950 block mt-0.5">
                  {editTargetItem.name}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  المستهدف الحالي:{" "}
                  <strong className="font-mono text-slate-700">
                    {formatSAR(editTargetItem.currentTarget)}
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المستهدف الشهري الجديد (ر.س) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="5000"
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(e.target.value)}
                    placeholder="أدخل قيمة المستهدف الشهري الجديد"
                    className="font-mono text-base font-bold pr-4 pl-12 h-11 border-slate-300 focus:ring-2 focus:ring-indigo-900"
                    autoFocus
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    ر.س.
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  سيتم فورياً تحديث نسب الإنجاز وإعادة احتساب بطاقات الأداء الإجمالية في النظام.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-6">
                <Button
                  onClick={handleSaveTarget}
                  className="flex-1 bg-[#1E1B4B] hover:bg-[#161338] text-white font-bold text-sm h-11 rounded-xl shadow-xs"
                >
                  حفظ المستهدف الجديد
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 h-11 rounded-xl border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
