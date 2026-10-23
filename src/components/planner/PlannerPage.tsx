"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Filter,
  Layers,
  Sparkles,
  Building2,
  AlertCircle,
  Tag,
  Check,
  ChevronDown,
  ListTodo,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

// ─────────────────────────────────────────────
// 1. Data Types & Interfaces
// ─────────────────────────────────────────────
export interface TaskItem {
  id: string;
  title: string;
  category: "unplanned" | "without_project" | "done";
  completed: boolean;
  relatedEntity?: string;
  createdAt: string;
}

export interface PlanItem {
  id: string;
  title: string;
  type: "unplanned" | "planned";
  date: string;
  dayNumber: number; // for calendar matching (e.g. 10, 15, 21, 25)
  deadlineType?: "campaign" | "license_renewal" | "deadline";
  associationName?: string;
  description?: string;
  progressPercent?: number;
}

// ─────────────────────────────────────────────
// 2. Mock Data
// ─────────────────────────────────────────────
const INITIAL_TASKS: TaskItem[] = [
  {
    id: "tsk-1",
    title: "متابعة سند التبرع لجمعية المحيصة REQ-2026-0012",
    category: "unplanned",
    completed: false,
    relatedEntity: "جمعية المحيصة",
    createdAt: "منذ ساعتين",
  },
  {
    id: "tsk-2",
    title: "مراجعة مستهدفات مبيعات شركة غزارة لشهر أكتوبر",
    category: "unplanned",
    completed: false,
    relatedEntity: "شركة غزارة",
    createdAt: "اليوم 09:30 ص",
  },
  {
    id: "tsk-3",
    title: "تحديث تراخيص جمعية روائع النجع المنتهية",
    category: "without_project",
    completed: false,
    relatedEntity: "LIC-EST-892",
    createdAt: "أمس",
  },
  {
    id: "tsk-4",
    title: "إعداد كشف عمولات المسوقين لفرع معين الرقمية",
    category: "without_project",
    completed: false,
    relatedEntity: "مؤسسة معين",
    createdAt: "منذ يومين",
  },
  {
    id: "tsk-5",
    title: "اعتماد سندات التحويل البنكي لجمعية إحسان",
    category: "done",
    completed: true,
    relatedEntity: "REQ-2026-1001",
    createdAt: "مكتملة",
  },
];

const INITIAL_PLANS: PlanItem[] = [
  {
    id: "pln-1",
    title: "تدشين حملة كفالة الشتاء الكبرى",
    type: "planned",
    date: "2026-10-25",
    dayNumber: 25,
    deadlineType: "campaign",
    associationName: "جمعية إحسان لرعاية الأيتام",
    description: "توزيع المواد الإعلانية ونشر روابط التبرع المباشر لـ 500 يتيم.",
    progressPercent: 75,
  },
  {
    id: "pln-2",
    title: "إغلاق مراجعة تراخيص جمع التبرعات الربعية",
    type: "planned",
    date: "2026-10-28",
    dayNumber: 28,
    deadlineType: "license_renewal",
    associationName: "جمعية المحيصة للتنمية",
    description: "رفع مستندات تجديد التراخيص للمركز الوطني للقطاع غير الربحي.",
    progressPercent: 40,
  },
  {
    id: "pln-3",
    title: "اجتماع إغلاق مستهدفات مبيعات أكتوبر",
    type: "planned",
    date: "2026-10-31",
    dayNumber: 31,
    deadlineType: "deadline",
    associationName: "مؤسسة بيت التمكين (المركز الرئيسي)",
    description: "مطابقة السندات البنكية واحتساب نسب التحقيق للجهات الثلاث.",
    progressPercent: 90,
  },
  {
    id: "pln-4",
    title: "خطة توسع شريحة المتبرعين لجمعية صفينة",
    type: "unplanned",
    date: "غير محدد",
    dayNumber: 0,
    deadlineType: "campaign",
    associationName: "جمعية صفينة",
    description: "تجهيز خطة استهداف رجال الأعمال والشركات للموسم القادم.",
    progressPercent: 15,
  },
  {
    id: "pln-5",
    title: "تجهيز ملحق الاتفاقية لشركة غزارة",
    type: "unplanned",
    date: "قيد الدراسة",
    dayNumber: 0,
    deadlineType: "deadline",
    associationName: "شركة غزارة للتسويق",
    description: "مراجعة نسب العمولات وشروط السداد.",
    progressPercent: 25,
  },
];

// Highlighted deadlines map: dayNumber -> label
const DEADLINE_DAYS: Record<number, { title: string; color: string }> = {
  15: { title: "مراجعة منتصف الشهر", color: "bg-blue-600" },
  25: { title: "حملة كفالة الشتاء", color: "bg-emerald-600" },
  28: { title: "تجديد التراخيص", color: "bg-amber-600" },
  31: { title: "إغلاق مستهدفات أكتوبر", color: "bg-[#1E1B4B]" },
};

// ─────────────────────────────────────────────
// Analog Clock Sub-Component
// ─────────────────────────────────────────────
function AnalogClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="w-36 h-36 rounded-full border-4 border-slate-100 flex items-center justify-center mx-auto bg-white shadow-inner">
        <span className="text-xs text-slate-300">جارٍ التحميل...</span>
      </div>
    );
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const formatDigitalTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatArabicDate = (date: Date) => {
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Clock Face */}
      <div className="relative w-36 h-36 rounded-full border-4 border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-md flex items-center justify-center">
        {/* Hour Markers (12, 3, 6, 9) */}
        <span className="absolute top-1 text-[11px] font-black font-mono text-slate-400">12</span>
        <span className="absolute right-2 text-[11px] font-black font-mono text-slate-400">3</span>
        <span className="absolute bottom-1 text-[11px] font-black font-mono text-slate-400">6</span>
        <span className="absolute left-2 text-[11px] font-black font-mono text-slate-400">9</span>

        {/* Center Pivot Point */}
        <div className="w-3 h-3 bg-[#1E1B4B] rounded-full z-20 shadow-xs border-2 border-white" />

        {/* Hour Hand */}
        <div
          className="absolute w-1.5 h-10 bg-slate-900 rounded-full origin-bottom z-10 transition-transform"
          style={{
            transform: `translateY(-50%) rotate(${hourDeg}deg)`,
            bottom: "50%",
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-1 h-14 bg-indigo-900 rounded-full origin-bottom z-10 transition-transform"
          style={{
            transform: `translateY(-50%) rotate(${minuteDeg}deg)`,
            bottom: "50%",
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-16 bg-rose-500 rounded-full origin-bottom z-15"
          style={{
            transform: `translateY(-50%) rotate(${secondDeg}deg)`,
            bottom: "50%",
          }}
        />
      </div>

      {/* Digital Time & Date Pill */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100/80 rounded-xl border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-950" />
          <span className="text-sm font-black font-mono text-slate-900 tracking-tight">
            {formatDigitalTime(time)}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-1.5">{formatArabicDate(time)}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Monthly Calendar Sub-Component
// ─────────────────────────────────────────────
interface CalendarWidgetProps {
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

function CalendarWidget({ selectedDay, onSelectDay }: CalendarWidgetProps) {
  // Fixed to October 2026 to match platform dataset
  const monthName = "أكتوبر 2026";
  const daysInMonth = 31;
  const startDayOffset = 4; // Starts on Thursday (الخميس)

  const weekDays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-slate-900">{monthName}</h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="الشهر السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="الشهر التالي"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map((wd) => (
          <span key={wd} className="text-[11px] font-bold text-slate-400">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Empty slots for offset */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isDeadline = DEADLINE_DAYS[day] !== undefined;
          const isSelected = selectedDay === day;

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`h-8 rounded-xl text-xs font-bold font-mono flex flex-col items-center justify-center relative transition-all ${
                isSelected
                  ? "bg-purple-900 text-white shadow-sm scale-105"
                  : isDeadline
                  ? "bg-[#1E1B4B] text-white hover:bg-indigo-900 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{day}</span>
              {isDeadline && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Highlighted Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E1B4B]" />
            مواعيد إغلاق وحملات نشطة
          </span>
          <span className="font-mono font-bold text-indigo-950">4 فعاليات</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main PlannerPage Component
// ─────────────────────────────────────────────
export default function PlannerPage() {
  // Tasks State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState("");

  // Plans State
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);
  const [planFilter, setPlanFilter] = useState<"all" | "unplanned" | "planned">("all");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Add Task Handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTaskInput.trim(),
      category: "unplanned",
      completed: false,
      relatedEntity: "مهمة تشغيلية",
      createdAt: "الآن",
    };

    setTasks([newTask, ...tasks]);
    setNewTaskInput("");
  };

  // Toggle Task Completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          category: nextCompleted ? "done" : "unplanned",
        };
      })
    );
  };

  // Grouped Tasks
  const unplannedTasks = useMemo(
    () => tasks.filter((t) => !t.completed && t.category === "unplanned"),
    [tasks]
  );
  const withoutProjectTasks = useMemo(
    () => tasks.filter((t) => !t.completed && t.category === "without_project"),
    [tasks]
  );
  const doneTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  // Filtered Plans
  const filteredPlans = useMemo(() => {
    let list = plans;
    if (planFilter !== "all") {
      list = list.filter((p) => p.type === planFilter);
    }
    if (selectedDay !== null) {
      list = list.filter((p) => p.dayNumber === selectedDay);
    }
    return list;
  }, [plans, planFilter, selectedDay]);

  const unplannedPlansCount = useMemo(
    () => plans.filter((p) => p.type === "unplanned").length,
    [plans]
  );
  const plannedPlansCount = useMemo(
    () => plans.filter((p) => p.type === "planned").length,
    [plans]
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ─────────────────────────────────────────────
          Page Header
      ───────────────────────────────────────────── */}
      <PageHeader
        overline="محطة التخطيط والتنفيذ والمتابعة اليومية"
        badge={<Sparkles className="w-4 h-4 text-amber-500" />}
        title="الخطط والمخطط الزمني (Planner)"
        subtitle="إدارة المهام التشغيلية اليومية، ربط المواعيد بالجمعيات، ومزامنة خطط الحملات في شاشة واحدة مقسمة لثلاث مساحات عمل تفاعلية."
        actions={
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-semibold">إجمالي المهام المنجزة:</span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono font-bold text-xs">
              {doneTasks.length} / {tasks.length}
            </Badge>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────
          3-Column Split View Layout
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ─────────────────────────────────────────────
              Column 1 (Right): Todo's & Tasks
          ───────────────────────────────────────────── */}
          <section className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-indigo-950" />
                <h2 className="text-base font-bold text-slate-900">قائمة المهام السريعة</h2>
              </div>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-mono font-bold text-xs">
                {tasks.filter((t) => !t.completed).length} متبقية
              </Badge>
            </div>

            {/* Input Task Field */}
            <form onSubmit={handleAddTask} className="relative">
              <Input
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="أضف مهمة جديدة، واضغط ENTER للحفظ..."
                className="pr-4 pl-12 h-12 bg-slate-50/70 border-slate-200 text-sm focus-visible:ring-purple-900 rounded-2xl shadow-2xs"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#1E1B4B] hover:bg-indigo-900 text-white flex items-center justify-center transition-colors shadow-2xs"
                title="إضافة المهمة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Task Lists Grouped */}
            <div className="space-y-6">
              {/* Group 1: Unplanned */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5 px-1">
                  <span>غير مخطط (Unplanned)</span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                    {unplannedTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {unplannedTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic px-2 py-1">لا توجد مهام غير مخططة</p>
                  ) : (
                    unplannedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        className="group flex items-start gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer transition-all bg-white"
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-300 group-hover:text-indigo-900 transition-colors"
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-snug">{t.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {t.relatedEntity && (
                              <span className="text-[10px] font-medium bg-purple-50 text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded-md">
                                {t.relatedEntity}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              {t.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Group 2: Without Project */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5 px-1">
                  <span>بدون مشروع (Without Project)</span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                    {withoutProjectTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {withoutProjectTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(t.id)}
                      className="group flex items-start gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer transition-all bg-white"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-300 group-hover:text-indigo-900 transition-colors"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {t.relatedEntity && (
                            <span className="text-[10px] font-medium bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded-md">
                              {t.relatedEntity}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">{t.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: Done Tasks */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 mb-2.5 px-1">
                  <span>مكتملة (Done)</span>
                  <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {doneTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {doneTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(t.id)}
                      className="group flex items-start gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer transition-all"
                    >
                      <button type="button" className="mt-0.5 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-400 line-through leading-snug">
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">تم الإنجاز ✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────
              Column 2 (Middle): Planner Lists & Cards
          ───────────────────────────────────────────── */}
          <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">المخطط الزمني للحملات</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDay !== null
                    ? `عرض خطط ومواعيد يوم ${selectedDay} أكتوبر`
                    : "استعراض كافة الخطط التشغيلية المعتمدة"}
                </p>
              </div>

              {selectedDay !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="text-xs text-purple-900 font-bold hover:underline self-start sm:self-auto"
                >
                  إلغاء تصفية اليوم ✕
                </button>
              )}
            </div>

            {/* Filter Links Tabs */}
            <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPlanFilter("all")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  planFilter === "all"
                    ? "bg-[#1E1B4B] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                الكل ({plans.length})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter("planned")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  planFilter === "planned"
                    ? "bg-[#1E1B4B] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                مخطط ({plannedPlansCount})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter("unplanned")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  planFilter === "unplanned"
                    ? "bg-[#1E1B4B] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                غير مخطط ({unplannedPlansCount})
              </button>
            </div>

            {/* Plan Cards List */}
            <div className="space-y-4">
              {filteredPlans.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">لا توجد خطط في هذه التصفية</p>
                  <p className="text-xs text-slate-400 mt-1">
                    جرب اختيار &ldquo;الكل&rdquo; أو إلغاء تحديد اليوم من التقويم.
                  </p>
                </div>
              ) : (
                filteredPlans.map((plan) => {
                  const badgeConfig =
                    plan.deadlineType === "campaign"
                      ? { label: "حملة تسويقية", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                      : plan.deadlineType === "license_renewal"
                      ? { label: "تجديد تراخيص", bg: "bg-amber-50 text-amber-700 border-amber-200" }
                      : { label: "موعد نهائي للإغلاق", bg: "bg-purple-50 text-purple-900 border-purple-200" };

                  return (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${badgeConfig.bg} text-[10px] font-bold px-2 py-0.5`}>
                              {badgeConfig.label}
                            </Badge>
                            {plan.date && (
                              <span className="text-[11px] font-mono text-slate-400">
                                {plan.date}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-950 transition-colors">
                            {plan.title}
                          </h3>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{plan.associationName}</span>
                        {plan.progressPercent !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-600">
                              {plan.progressPercent}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-900 rounded-full"
                                style={{ width: `${plan.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ─────────────────────────────────────────────
              Column 3 (Left): Calendar & Analog Clock
          ───────────────────────────────────────────── */}
          <section className="lg:col-span-3 space-y-6">
            {/* Clock Widget Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
              <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase mb-4 text-center">
                التوقيت الحالي واليوم
              </h3>
              <AnalogClock />
            </div>

            {/* Monthly Calendar Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
              <CalendarWidget selectedDay={selectedDay} onSelectDay={setSelectedDay} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
