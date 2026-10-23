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
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  X,
  FileText
} from "lucide-react";
import RevenueChart from "./RevenueChart";

interface DashboardViewProps {
  onNavigateToRequests?: () => void;
}

export default function DashboardView({ onNavigateToRequests }: DashboardViewProps) {
  // Modal states for interactive demo
  const [isAddRevenueOpen, setIsAddRevenueOpen] = useState(false);
  const [isSubmitRequestOpen, setIsSubmitRequestOpen] = useState(false);

  // Revenue form state
  const [revenueAmount, setRevenueAmount] = useState("");
  const [revenueSource, setRevenueSource] = useState("إيصالات تحويل بنكي");
  const [revenueEntity, setRevenueEntity] = useState("بيت التمكين");

  // Dynamic state for live interaction
  const [totalRevenue, setTotalRevenue] = useState(215000);
  const targetMonthly = 350000;
  const remainingTarget = Math.max(0, targetMonthly - totalRevenue);
  const achievementRate = ((totalRevenue / targetMonthly) * 100).toFixed(1);

  // Add revenue action
  const handleAddRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(revenueAmount);
    if (!isNaN(amount) && amount > 0) {
      setTotalRevenue((prev) => prev + amount);
      setIsAddRevenueOpen(false);
      setRevenueAmount("");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-8">
      {/* 1. Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-1 block">
            نظرة تشغيلية موحدة
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
            مساء الخير، Mohammed Bin Hameedh
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 mt-1 font-medium">
            ملخص الأداء المالي والتشغيلي لشهر اغسطس 2026
          </p>
        </div>

        {/* Action Buttons on Left (in RTL layout) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Primary Filled Button: إضافة إيراد */}
          <button
            onClick={() => setIsAddRevenueOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E1B4B] hover:bg-[#2E1065] text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إيراد</span>
          </button>

          {/* Secondary Outlined Button: رفع طلب */}
          <button
            onClick={() => {
              if (onNavigateToRequests) {
                onNavigateToRequests();
              } else {
                setIsSubmitRequestOpen(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>رفع طلب</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Band (Top Row - 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: المستهدف الشهري (Lavender / Soft Purple) */}
        <div className="bg-[#FAF8FF] border border-[#E9E4F8] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">المستهدف الشهري</span>
            <div className="w-10 h-10 rounded-full bg-[#EDE7F9] text-[#5B21B6] flex items-center justify-center">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {targetMonthly.toLocaleString('en-US')} <span className="text-base font-semibold text-slate-600">ر.س.</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              إجمالي الجمعيات ضمن نطاقك
            </p>
          </div>
        </div>

        {/* Card 2: الإيراد المحقق (Mint / Light Green) */}
        <div className="bg-[#F2FCF7] border border-[#DCF7E9] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">الإيراد المحقق</span>
            <div className="w-10 h-10 rounded-full bg-[#D6F5E4] text-[#059669] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalRevenue.toLocaleString('en-US')} <span className="text-base font-semibold text-slate-600">ر.س.</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <span>{achievementRate}% من المستهدف</span>
            </p>
          </div>
        </div>

        {/* Card 3: المتبقي للوصول (Pale Yellow / Warm Amber) */}
        <div className="bg-[#FFFDF4] border border-[#FEF3C7] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">المتبقي للوصول</span>
            <div className="w-10 h-10 rounded-full bg-[#FEF0C7] text-[#D97706] flex items-center justify-center">
              <Banknote className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {remainingTarget.toLocaleString('en-US')} <span className="text-base font-semibold text-slate-600">ر.س.</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              يحدّث مباشرة مع الإدخالات
            </p>
          </div>
        </div>

        {/* Card 4: الطلبات المفتوحة (Pastel Pink / Soft Rose) */}
        <div className="bg-[#FFF6F7] border border-[#FFE2E6] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600">الطلبات المفتوحة</span>
            <div className="w-10 h-10 rounded-full bg-[#FFD7DC] text-[#E11D48] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              2
            </div>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">
              2 طلبات تجاوزت SLA
            </p>
          </div>
        </div>
      </div>

      {/* 3. Contract Entities Performance (Middle Row) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">أداء الجهات التعاقدية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            حساب مباشر من مستهدفات وإيرادات الجمعيات التابعة لكل جهة خلال الفترة المحددة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Entity 1: بيت التمكين */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                18 جمعية
              </span>
              <h3 className="text-base font-bold text-slate-900">بيت التمكين</h3>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">المستهدف</span>
                <span className="font-bold text-slate-900 text-sm">200,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المحقق</span>
                <span className="font-bold text-emerald-700 text-sm">145,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المتبقي</span>
                <span className="font-bold text-amber-700 text-sm">55,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">نسبة التحقيق</span>
                <span className="font-extrabold text-indigo-950 text-sm">72.5%</span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1E1B4B] h-full rounded-full transition-all duration-700"
                style={{ width: "72.5%" }}
              />
            </div>
          </div>

          {/* Entity 2: معين */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                9 جمعية
              </span>
              <h3 className="text-base font-bold text-slate-900">معين</h3>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">المستهدف</span>
                <span className="font-bold text-slate-900 text-sm">150,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المحقق</span>
                <span className="font-bold text-emerald-700 text-sm">70,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">المتبقي</span>
                <span className="font-bold text-amber-700 text-sm">80,000 ر.س.</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">نسبة التحقيق</span>
                <span className="font-extrabold text-indigo-950 text-sm">46.6%</span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1E1B4B] h-full rounded-full transition-all duration-700"
                style={{ width: "46.6%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lower Widgets (Bottom Row - 2 Widgets Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Widget: منحنى الإيراد اليومي */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">منحنى الإيراد اليومي</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  الإيرادات من المتجر والإيصالات ومصادر الإيراد الأخرى.
                </p>
              </div>
              <div className="text-left font-semibold text-xs text-indigo-950 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
                <span className="text-slate-400 font-normal">المتجر / الإيصالات:</span>{" "}
                <span>85,000 ر.س. / 130,000 ر.س.</span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <RevenueChart />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>متوسط التحصيل اليومي: <strong>14,200 ر.س.</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% نمو مقارنة بالشهر السابق
            </span>
          </div>
        </div>

        {/* Left Widget: تنبيهات تحتاج انتباهاً */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-950 flex items-center justify-center shrink-0 border border-indigo-100">
                <Bell className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">تنبيهات تحتاج انتباهاً</h3>
                <p className="text-xs text-slate-500">
                  مستخرجة من الحالة الحالية للعمليات.
                </p>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start justify-between gap-3 transition-colors hover:bg-amber-50">
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
                <button
                  onClick={onNavigateToRequests}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/50 shrink-0"
                >
                  معاينة
                </button>
              </div>

              {/* Alert 2 */}
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start justify-between gap-3 transition-colors hover:bg-rose-50">
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
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-md shrink-0">
                  عاجل
                </span>
              </div>

              {/* Alert 3 */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60 flex items-start justify-between gap-3 transition-colors hover:bg-indigo-50">
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
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md shrink-0">
                  مالية
                </span>
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Modal: إضافة إيراد جديد */}
      {/* ========================================================================= */}
      {isAddRevenueOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">إضافة إيراد مالي جديد</h3>
              <button
                onClick={() => setIsAddRevenueOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRevenueSubmit} className="space-y-4 mt-4 text-right">
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
                  <option value="شيك مصدق لشركة / مؤسسة">شيك مصدق لشركة / مؤسسة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الجهة التعاقدية *
                </label>
                <select
                  value={revenueEntity}
                  onChange={(e) => setRevenueEntity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none bg-white"
                >
                  <option value="بيت التمكين">بيت التمكين للتسويق</option>
                  <option value="غزارة">شركة غزارة للتجارة والتسويق</option>
                  <option value="معين">مؤسسة معين الرقمية التجارية</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRevenueOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E1B4B] text-white hover:bg-[#2E1065] shadow-xs transition-colors"
                >
                  حفظ وتحديث المؤشرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
