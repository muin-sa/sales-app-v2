"use client";

import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Banknote,
  ClipboardList,
  Bell,
  Plus,
  ArrowUpRight,
  ChevronLeft,
  X,
  FileText,
  AlertTriangle,
  Clock,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/page-header";
import RevenueChart from "./RevenueChart";

export interface DashboardMetricData {
  monthlyTarget: string;
  realizedRevenue: string;
  realizedPercent: string;
  remainingToTarget: string;
  openOrdersCount: number;
  openOrdersOverdue: number;
}

export interface EntityPerformanceData {
  name: string;
  associationsCount: number;
  target: string;
  realized: string;
  remaining: string;
  achievementRatio: string;
  progressValue: number;
}

export interface DashboardProps {
  metrics?: DashboardMetricData;
  entities?: {
    tamkeen: EntityPerformanceData;
    moeen: EntityPerformanceData;
  };
  onNavigateToRequests?: () => void;
  onAddRevenue?: () => void;
  onSubmitRequest?: () => void;
}

const defaultMetrics: DashboardMetricData = {
  monthlyTarget: "0 ر.س.",
  realizedRevenue: "0 ر.س.",
  realizedPercent: "0%",
  remainingToTarget: "0 ر.س.",
  openOrdersCount: 2,
  openOrdersOverdue: 2,
};

const defaultEntities = {
  tamkeen: {
    name: "بيت التمكين",
    associationsCount: 18,
    target: "0 ر.س.",
    realized: "0 ر.س.",
    remaining: "0 ر.س.",
    achievementRatio: "0%",
    progressValue: 0,
  },
  moeen: {
    name: "معين",
    associationsCount: 9,
    target: "0 ر.س.",
    realized: "0 ر.س.",
    remaining: "0 ر.س.",
    achievementRatio: "0%",
    progressValue: 0,
  },
};

export default function Dashboard({
  metrics = defaultMetrics,
  entities = defaultEntities,
  onNavigateToRequests,
  onAddRevenue,
  onSubmitRequest,
}: DashboardProps) {
  // Modal state for adding revenue
  const [isAddRevenueOpen, setIsAddRevenueOpen] = useState(false);
  const [revenueAmount, setRevenueAmount] = useState("");
  const [revenueSource, setRevenueSource] = useState("إيصالات تحويل بنكي");

  const handleRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddRevenue) {
      onAddRevenue();
    }
    setIsAddRevenueOpen(false);
    setRevenueAmount("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" dir="rtl">
      {/* 1. Top Header */}
      <PageHeader
        overline="نظرة تشغيلية موحدة"
        title="مساء الخير، Mohammed Bin Hameedh"
        subtitle="ملخص الأداء المالي والتشغيلي لشهر اغسطس 2026"
        actions={
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Primary Solid Purple Button: إضافة إيراد + */}
            <Button
              onClick={() => setIsAddRevenueOpen(true)}
              className="bg-[#1E1B4B] hover:bg-[#2E1065] text-white rounded-xl shadow-xs px-5 py-2.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إيراد</span>
            </Button>

            {/* Secondary Outline Button: رفع طلب */}
            <Button
              variant="outline"
              onClick={() => {
                if (onNavigateToRequests) {
                  onNavigateToRequests();
                } else if (onSubmitRequest) {
                  onSubmitRequest();
                }
              }}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl px-4 py-2.5"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>رفع طلب</span>
            </Button>
          </div>
        }
      />

      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        {/* 2. Top KPI Metrics (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: المستهدف الشهري (Purple tint) */}
        <div className="bg-[#FAF8FF] border border-[#E9E4F8] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">المستهدف الشهري</span>
            <div className="w-10 h-10 rounded-full bg-[#EDE7F9] text-[#5B21B6] flex items-center justify-center">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.monthlyTarget}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              إجمالي الجمعيات ضمن نطاقك
            </p>
          </div>
        </div>

        {/* Card 2: الإيراد المحقق (Green tint) */}
        <div className="bg-[#F2FCF7] border border-[#DCF7E9] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">الإيراد المحقق</span>
            <div className="w-10 h-10 rounded-full bg-[#D6F5E4] text-[#059669] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.realizedRevenue}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              {metrics.realizedPercent} من المستهدف
            </p>
          </div>
        </div>

        {/* Card 3: المتبقي للوصول (Yellow tint) */}
        <div className="bg-[#FFFDF4] border border-[#FEF3C7] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">المتبقي للوصول</span>
            <div className="w-10 h-10 rounded-full bg-[#FEF0C7] text-[#D97706] flex items-center justify-center">
              <Banknote className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.remainingToTarget}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              يحدث مباشرة مع الإدخالات
            </p>
          </div>
        </div>

        {/* Card 4: الطلبات المفتوحة (Red tint) */}
        <div className="bg-[#FFF6F7] border border-[#FFE2E6] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">الطلبات المفتوحة</span>
            <div className="w-10 h-10 rounded-full bg-[#FFD7DC] text-[#E11D48] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.openOrdersCount}
            </div>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">
              {metrics.openOrdersOverdue} طلبات تجاوزت SLA
            </p>
          </div>
        </div>
      </div>

      {/* 3. Contractual Entities Performance Section ("أداء الجهات التعاقدية") */}
      <Card className="rounded-2xl p-6 border-slate-200/90 shadow-xs space-y-6">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900">أداء الجهات التعاقدية</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            حساب مباشر من مستهدفات وإيرادات الجمعيات التابعة لكل جهة خلال الفترة المحددة.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Right Column: بيت التمكين */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <Badge variant="outline" className="text-slate-600 font-medium">
                {entities.tamkeen.associationsCount} جمعية
              </Badge>
              <h3 className="text-base font-bold text-slate-900">{entities.tamkeen.name}</h3>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">المستهدف</span>
                <span className="font-bold text-slate-900 text-sm">{entities.tamkeen.target}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المحقق</span>
                <span className="font-bold text-emerald-700 text-sm">{entities.tamkeen.realized}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المتبقي</span>
                <span className="font-bold text-amber-700 text-sm">{entities.tamkeen.remaining}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">نسبة التحقيق</span>
                <span className="font-extrabold text-indigo-950 text-sm">{entities.tamkeen.achievementRatio}</span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <Progress value={entities.tamkeen.progressValue} className="h-2" />
          </div>

          {/* Left Column: معين */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <Badge variant="outline" className="text-slate-600 font-medium">
                {entities.moeen.associationsCount} جمعية
              </Badge>
              <h3 className="text-base font-bold text-slate-900">{entities.moeen.name}</h3>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">المستهدف</span>
                <span className="font-bold text-slate-900 text-sm">{entities.moeen.target}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المحقق</span>
                <span className="font-bold text-emerald-700 text-sm">{entities.moeen.realized}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المتبقي</span>
                <span className="font-bold text-amber-700 text-sm">{entities.moeen.remaining}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">نسبة التحقيق</span>
                <span className="font-extrabold text-indigo-950 text-sm">{entities.moeen.achievementRatio}</span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <Progress value={entities.moeen.progressValue} className="h-2" />
          </div>
        </div>
      </Card>

      {/* 4. Bottom Analytical Section (2 Columns Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Column: منحنى الإيراد اليومي */}
        <Card className="p-6 border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">منحنى الإيراد اليومي</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  الإيرادات من المتجر والإيصالات ومصادر الإيراد الأخرى.
                </CardDescription>
              </div>
              <div className="text-left font-semibold text-xs text-indigo-950 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
                <span className="text-slate-400 font-normal">المتجر / الإيصالات:</span>{" "}
                <span>0 ر.س. / 0 ر.س.</span>
              </div>
            </div>

            {/* Chart */}
            <RevenueChart />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>متوسط التحصيل اليومي: <strong>0 ر.س.</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> استقرار الأداء المالي
            </span>
          </div>
        </Card>

        {/* Left Column: تنبيهات تحتاج انتباهًا */}
        <Card className="p-6 border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-950 flex items-center justify-center shrink-0 border border-indigo-100">
                <Bell className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">تنبيهات تحتاج انتباهًا</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  مستخرجة من الحالة الحالية للعمليات.
                </CardDescription>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      طلب REQ-2026-000003 بانتظار المشرف
                    </h4>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      كشف أيتام لجمعية المحيصة معلق منذ 48 ساعة ويتطلب اعتماد الميزانية.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onNavigateToRequests}
                  className="bg-white border-amber-200 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/50 h-7 px-2.5 rounded-lg shrink-0"
                >
                  معاينة
                </Button>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">
                      ترخيص جمع تبرعات ينتهي خلال 18 يوماً
                    </h4>
                    <p className="text-[11px] text-rose-800/80 mt-0.5">
                      ترخيص حملة جمعية إحسان (LIC-2026-9812) يتطلب الرفع للمركز الوطني للتجديد.
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-rose-100 text-rose-700 text-[10px] shrink-0">
                  عاجل
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950">
                      سند مالي بقيمة 15,000 ر.س. بانتظار التدقيق
                    </h4>
                    <p className="text-[11px] text-indigo-800/80 mt-0.5">
                      تم رفع إشعار تحويل مصرف الراجحي لحساب جمعية صفينة بانتظار إفادة المحاسب.
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-[10px] shrink-0">
                  مالية
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={onNavigateToRequests}
              className="text-xs font-semibold text-indigo-950 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <span>عرض جميع تنبيهات العمليات والمهام</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </main>

      {/* Interactive Modal: إضافة إيراد */}
      {isAddRevenueOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">إضافة إيراد مالي جديد</h3>
              <button
                onClick={() => setIsAddRevenueOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRevenueSubmit} className="space-y-4 mt-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المبلغ المحصل (ريال سعودي) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  placeholder="مثال: 15000"
                  value={revenueAmount}
                  onChange={(e) => setRevenueAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  مصدر الإيراد *
                </label>
                <select
                  value={revenueSource}
                  onChange={(e) => setRevenueSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none bg-white"
                >
                  <option value="إيصالات تحويل بنكي">إيصالات تحويل بنكي</option>
                  <option value="تبرع إلكتروني (مدى / Apple Pay)">تبرع إلكتروني (مدى / Apple Pay)</option>
                  <option value="تحصيل نقدي / أجهزة نقاط البيع">تحصيل نقدي / أجهزة نقاط البيع</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddRevenueOpen(false)}
                  className="rounded-xl text-xs"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1E1B4B] hover:bg-[#2E1065] text-white rounded-xl text-xs"
                >
                  حفظ وتأكيد
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
