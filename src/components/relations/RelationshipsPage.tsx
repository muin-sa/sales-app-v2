"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Phone,
  Users,
  StickyNote,
  Calendar,
  Target,
  Clock,
  UserCheck,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  ChevronLeft,
  Building2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";

// ─────────────────────────────────────────────
// Data Types
// ─────────────────────────────────────────────
export type FollowUpType = "Call" | "Meeting" | "Note";

export interface FollowUp {
  id: string;
  associationName: string;
  contactDate: string;
  responsiblePerson: string;
  type: FollowUpType;
  notes: string;
  nextFollowUpDate: string;
  color: string;
  stepNumber: string;
}

// ─────────────────────────────────────────────
// Mock Data (Chronological History)
// ─────────────────────────────────────────────
const INITIAL_FOLLOW_UPS: FollowUp[] = [
  {
    id: "1",
    associationName: "جمعية المحيصة للتنمية",
    contactDate: "2026-10-20",
    responsiblePerson: "أحمد المنيباري",
    type: "Call",
    notes:
      "تم التواصل هاتفياً لمناقشة أداء الربع الثالث، ومراجعة تقارير سندات التبرع، وتحديد موعد لاجتماع قادم لمراجعة تراخيص الحملات.",
    nextFollowUpDate: "2026-10-25",
    color: "bg-teal-600",
    stepNumber: "01",
  },
  {
    id: "2",
    associationName: "جمعية روائع النجع الخيرية",
    contactDate: "2026-10-18",
    responsiblePerson: "خالد الدوسري",
    type: "Meeting",
    notes:
      "اجتماع حضوري بمقر الجمعية لمراجعة التراخيص المتبقية وإغلاق طلبات مركز العمليات المتأخرة وتفعيل الربط المالي المباشر.",
    nextFollowUpDate: "2026-11-01",
    color: "bg-cyan-700",
    stepNumber: "02",
  },
  {
    id: "3",
    associationName: "جمعية صفينة للرعاية الاجتماعية",
    contactDate: "2026-10-15",
    responsiblePerson: "سالم المنصور",
    type: "Note",
    notes:
      "ملاحظة إدارية: تأخر الجمعية في رفع الكشوفات البنكية الخاصة بحملة كفالة الأيتام، وتم إشعار المشرف المالي للمتابعة العاجلة.",
    nextFollowUpDate: "2026-10-22",
    color: "bg-slate-700",
    stepNumber: "03",
  },
  {
    id: "4",
    associationName: "جمعية خريغط التنموية",
    contactDate: "2026-10-10",
    responsiblePerson: "أحمد المنيباري",
    type: "Meeting",
    notes:
      "توقيع ملحق العقد التسويقي الجديد لمؤسسة معين الرقمية واعتماد المستهدف البيعي للربع الرابع وتحديث قائمة أرقام الاتصال المعتمدة.",
    nextFollowUpDate: "2026-12-01",
    color: "bg-indigo-950",
    stepNumber: "04",
  },
  {
    id: "5",
    associationName: "جمعية إحسان لرعاية الأيتام",
    contactDate: "2026-10-05",
    responsiblePerson: "سلطان المنصور",
    type: "Call",
    notes:
      "مكالمة هاتفية مع المدير التنفيذي لبحث تدشين حملة الشتاء وتوفير المواد التسويقية والمطبوعات الميدانية قبل نهاية الشهر.",
    nextFollowUpDate: "2026-10-28",
    color: "bg-purple-900",
    stepNumber: "05",
  },
];

// Helper: Get icon based on type
function getIconForType(type: FollowUpType) {
  switch (type) {
    case "Call":
      return <Phone className="w-6 h-6 text-teal-600" />;
    case "Meeting":
      return <Users className="w-6 h-6 text-cyan-700" />;
    case "Note":
      return <StickyNote className="w-6 h-6 text-indigo-900" />;
    default:
      return <Target className="w-6 h-6 text-slate-700" />;
  }
}

function getTypeBadgeLabel(type: FollowUpType) {
  switch (type) {
    case "Call":
      return "اتصال هاتفي";
    case "Meeting":
      return "اجتماع عمل";
    case "Note":
      return "ملاحظة تشغيلية";
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function RelationshipsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOW_UPS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formAssociation, setFormAssociation] = useState("");
  const [formType, setFormType] = useState<FollowUpType>("Call");
  const [formContactDate, setFormContactDate] = useState("2026-10-21");
  const [formResponsible, setFormResponsible] = useState("محمد بن حميد");
  const [formNextDate, setFormNextDate] = useState("2026-11-05");
  const [formNotes, setFormNotes] = useState("");

  // Statistics
  const stats = useMemo(() => {
    return {
      total: followUps.length,
      calls: followUps.filter((f) => f.type === "Call").length,
      meetings: followUps.filter((f) => f.type === "Meeting").length,
      notes: followUps.filter((f) => f.type === "Note").length,
    };
  }, [followUps]);

  // Filtered List
  const filteredList = useMemo(() => {
    return followUps.filter((item) => {
      const matchType =
        selectedTypeFilter === "ALL" || item.type === selectedTypeFilter;
      const matchSearch =
        item.associationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [followUps, selectedTypeFilter, searchQuery]);

  // Handle Add Follow-up
  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAssociation.trim() || !formNotes.trim()) {
      alert("يرجى إدخال اسم الجمعية وتفاصيل المتابعة.");
      return;
    }

    // Color based on step or type
    const palette = ["bg-teal-600", "bg-cyan-700", "bg-slate-700", "bg-indigo-950", "bg-purple-900"];
    const nextColor = palette[followUps.length % palette.length];
    const nextStep = String(followUps.length + 1).padStart(2, "0");

    const newEntry: FollowUp = {
      id: Date.now().toString(),
      associationName: formAssociation.trim(),
      contactDate: formContactDate,
      responsiblePerson: formResponsible.trim(),
      type: formType,
      notes: formNotes.trim(),
      nextFollowUpDate: formNextDate,
      color: nextColor,
      stepNumber: nextStep,
    };

    setFollowUps([newEntry, ...followUps]);
    setIsDialogOpen(false);

    // Reset Form
    setFormAssociation("");
    setFormNotes("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ─────────────────────────────────────────────
          Page Header
      ───────────────────────────────────────────── */}
      <PageHeader
        overline="منظومة رعاية الشركاء والجمعيات"
        badge={<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />}
        title="العلاقات والمتابعة (Relationships & Follow-ups)"
        subtitle="سجل زمني مرئي وتفاعلي لتوثيق كافة الاتصالات، الاجتماعات، والملاحظات الميدانية مع الجمعيات الشريكة لضمان استمرارية التواصل."
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E1B4B] hover:bg-indigo-900 text-white rounded-2xl px-6 py-2.5 h-auto text-sm font-bold shadow-md gap-2 shrink-0 transition-transform active:scale-95">
                <Plus className="w-5 h-5 ml-1" />
                إضافة متابعة جديدة
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg" dir="rtl">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <DialogTitle>تسجيل متابعة جديدة مع الجمعية</DialogTitle>
                </div>
                <DialogDescription>
                  أدخل تفاصيل الاتصال أو الاجتماع أو الملاحظة لإضافتها مباشرة إلى الخط الزمني للمتابعات.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveFollowUp} className="space-y-4 py-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم الجمعية الشريكة <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="مثال: جمعية إحسان لرعاية الأيتام"
                    value={formAssociation}
                    onChange={(e) => setFormAssociation(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نوع المتابعة <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as FollowUpType)}
                      className="w-full h-11 px-3.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    >
                      <option value="Call">اتصال هاتفي (Call)</option>
                      <option value="Meeting">اجتماع عمل (Meeting)</option>
                      <option value="Note">ملاحظة تشغيلية (Note)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      المسؤول عن التواصل <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="اسم الموظف أو المسوق"
                      value={formResponsible}
                      onChange={(e) => setFormResponsible(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      تاريخ التواصل الفعلي
                    </label>
                    <Input
                      type="date"
                      value={formContactDate}
                      onChange={(e) => setFormContactDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      تاريخ المتابعة القادمة
                    </label>
                    <Input
                      type="date"
                      value={formNextDate}
                      onChange={(e) => setFormNextDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تفاصيل وملاحظات المتابعة <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    placeholder="اكتب خلاصة المكالمة أو مخرجات الاجتماع والتوصيات المتفق عليها..."
                    rows={4}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-xl px-5 font-bold"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1E1B4B] hover:bg-indigo-900 text-white rounded-xl px-6 font-bold"
                  >
                    حفظ السجل
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* ─────────────────────────────────────────────
          Controls & Stats Bar
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        {/* KPI Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">إجمالي المتابعات</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {stats.total}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-700 block">اتصالات هاتفية</span>
              <span className="text-2xl font-black text-teal-900 font-mono mt-1 block">
                {stats.calls}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-700 block">اجتماعات عمل</span>
              <span className="text-2xl font-black text-cyan-950 font-mono mt-1 block">
                {stats.meetings}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-700 block">ملاحظات تشغيلية</span>
              <span className="text-2xl font-black text-indigo-950 font-mono mt-1 block">
                {stats.notes}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <StickyNote className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> تصفية السجل:
            </span>
            {[
              { id: "ALL", label: `الكل (${followUps.length})` },
              { id: "Call", label: `اتصالات (${stats.calls})` },
              { id: "Meeting", label: `اجتماعات (${stats.meetings})` },
              { id: "Note", label: `ملاحظات (${stats.notes})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedTypeFilter === tab.id
                    ? "bg-[#1E1B4B] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="بحث بالجمعية أو المسؤول أو الملاحظات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            Alternating Timeline Container
        ───────────────────────────────────────────── */}
        <div className="relative py-12 px-2 sm:px-6">
          {/* Central Vertical Dotted Line (Desktop only) */}
          <div className="absolute right-1/2 translate-x-1/2 top-4 bottom-4 w-0 border-r-4 border-dotted border-slate-300 hidden md:block z-0 pointer-events-none" />

          {/* Timeline Nodes */}
          {filteredList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">لا توجد سجلات متابعة مطابقة</h3>
              <p className="text-xs text-slate-500 mt-1">
                جرب تغيير خيارات التصفية أو أضف متابعة جديدة بواسطة الزر العلوي.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredList.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`relative flex items-center justify-between md:justify-normal w-full ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Central Circular Elevated White Icon Container */}
                    <div className="absolute right-1/2 translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-slate-100 shadow-xl items-center justify-center z-10 hidden md:flex shrink-0 transition-transform duration-300 hover:scale-110">
                      {getIconForType(item.type)}
                    </div>

                    {/* Dotted Connecting Horizontal Arm to Center Line */}
                    <div
                      className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-10 border-t-2 border-dotted border-slate-400 z-0 ${
                        isEven ? "right-[45%]" : "left-[45%]"
                      }`}
                    />

                    {/* Pill-Shaped Rounded Card */}
                    <div
                      className={`w-full md:w-[45%] ${
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      <div
                        className={`relative ${item.color} text-white rounded-[2.5rem] p-7 md:p-8 shadow-xl transition-all hover:-translate-y-1.5 hover:shadow-2xl duration-300 overflow-hidden group`}
                      >
                        {/* Subtle background gloss */}
                        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                        {/* Card Content */}
                        <div className="flex flex-col gap-3 relative z-10">
                          {/* Header of the Card */}
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-mono tracking-widest font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full text-white/90">
                                  STEP {item.stepNumber}
                                </span>
                                <Badge className="bg-white/15 hover:bg-white/20 text-white text-[11px] font-bold border-white/20">
                                  {getTypeBadgeLabel(item.type)}
                                </Badge>
                              </div>
                              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                                {item.associationName}
                              </h3>
                            </div>

                            {/* Mobile icon display when central line is hidden */}
                            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center md:hidden shrink-0">
                              {React.cloneElement(getIconForType(item.type), {
                                className: "w-5 h-5 text-white",
                              })}
                            </div>
                          </div>

                          {/* Contact Date & Responsible Person */}
                          <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs font-semibold mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-white/70" />
                              <span className="font-mono">{item.contactDate}</span>
                            </div>
                            <span className="opacity-40">•</span>
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-white/70" />
                              <span>{item.responsiblePerson}</span>
                            </div>
                          </div>

                          {/* Notes Body */}
                          <p className="text-white/95 leading-relaxed text-sm mt-2 font-normal">
                            {item.notes}
                          </p>

                          {/* Card Footer: Next Follow-Up Date */}
                          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-semibold">
                            <span className="text-white/70 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-300" />
                              موعد المتابعة القادمة:
                            </span>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full font-mono font-bold shadow-2xs">
                              {item.nextFollowUpDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
