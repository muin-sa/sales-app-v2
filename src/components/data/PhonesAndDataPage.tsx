"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Phone,
  UserCheck,
  FileSpreadsheet,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  FileText,
  FileCode,
  Mail,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─────────────────────────────────────────────
// 1. Types & Interfaces
// ─────────────────────────────────────────────
export interface PhoneDataRecord {
  id: string;
  contactName: string;
  phone: string;
  entity: "بيت التمكين" | "غزارة" | "معين";
  dateAdded: string;
  status: "Active" | "Inactive";
}

export type ExportFileType = "excel" | "pdf" | "csv";

// ─────────────────────────────────────────────
// 2. Mock Data
// ─────────────────────────────────────────────
const INITIAL_RECORDS: PhoneDataRecord[] = [
  {
    id: "PH-001",
    contactName: "أحمد المنيباري",
    phone: "0501234567",
    entity: "بيت التمكين",
    dateAdded: "02 Sep 2026",
    status: "Active",
  },
  {
    id: "PH-002",
    contactName: "سارة فهد القحطاني",
    phone: "0559876543",
    entity: "معين",
    dateAdded: "15 Sep 2026",
    status: "Active",
  },
  {
    id: "PH-003",
    contactName: "سلطان المنصور",
    phone: "0543334455",
    entity: "غزارة",
    dateAdded: "28 Sep 2026",
    status: "Active",
  },
  {
    id: "PH-004",
    contactName: "خالد الدوسري",
    phone: "0564445566",
    entity: "بيت التمكين",
    dateAdded: "01 Oct 2026",
    status: "Inactive",
  },
  {
    id: "PH-005",
    contactName: "فيصل الخالدي",
    phone: "0595556677",
    entity: "غزارة",
    dateAdded: "10 Oct 2026",
    status: "Active",
  },
  {
    id: "PH-006",
    contactName: "عبدالله السليمان",
    phone: "0507788990",
    entity: "بيت التمكين",
    dateAdded: "14 Oct 2026",
    status: "Active",
  },
  {
    id: "PH-007",
    contactName: "ناصر الغامدي",
    phone: "0551122334",
    entity: "معين",
    dateAdded: "18 Oct 2026",
    status: "Inactive",
  },
];

// Helper: Format Saudi Phone for visual clarity
function formatSaudiPhone(phone: string): string {
  // 05X XXX XXXX
  if (phone.length === 10) {
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }
  return phone;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function PhonesAndDataPage() {
  const [records, setRecords] = useState<PhoneDataRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Notifications State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden File Input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<ExportFileType>("excel");
  const [exportEmail, setExportEmail] = useState("admin@tamkeen-mkt.sa");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [newExtraEmail, setNewExtraEmail] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // CSV Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate adding 2 new parsed records
    const simulatedRecord1: PhoneDataRecord = {
      id: `PH-${Date.now().toString().slice(-3)}`,
      contactName: "مشاري بن حمدان",
      phone: "0509988776",
      entity: "بيت التمكين",
      dateAdded: "اليوم",
      status: "Active",
    };
    const simulatedRecord2: PhoneDataRecord = {
      id: `PH-${(Date.now() + 1).toString().slice(-3)}`,
      contactName: "هند آل إبراهيم",
      phone: "0541122889",
      entity: "غزارة",
      dateAdded: "اليوم",
      status: "Active",
    };

    setRecords((prev) => [simulatedRecord1, simulatedRecord2, ...prev]);
    showToast(`تم رفع الملف (${file.name}) بنجاح وإضافة البيانات إلى النظام!`);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Confirm Export
  const handleConfirmExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExportModalOpen(false);
    showToast(
      `تم إرسال تقرير البيانات بصيغة (${selectedFileType.toUpperCase()}) إلى البريد ${exportEmail} بنجاح!`
    );
  };

  // Add Additional Email
  const handleAddExtraEmail = () => {
    if (newExtraEmail.trim() && newExtraEmail.includes("@")) {
      setAdditionalEmails((prev) => [...prev, newExtraEmail.trim()]);
      setNewExtraEmail("");
      setShowAdditionalInput(false);
    }
  };

  // Toggle Selection
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setOpenActionMenuId(null);
    showToast("تم حذف السجل بنجاح.");
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: r.status === "Active" ? "Inactive" : "Active",
        };
      })
    );
    setOpenActionMenuId(null);
    showToast("تم تحديث حالة الرقم بنجاح.");
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.contactName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.entity.toLowerCase().includes(q);

      const matchEntity =
        selectedEntityFilter === "ALL" || r.entity === selectedEntityFilter;

      return matchSearch && matchEntity;
    });
  }, [records, searchQuery, selectedEntityFilter]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] pb-24 font-[Cairo,sans-serif] relative">
      {/* ─────────────────────────────────────────────
          Toast / Alert Notification Banner
      ───────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden File Input for CSV Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />

      {/* ─────────────────────────────────────────────
          Top Header
      ───────────────────────────────────────────── */}
      <PageHeader
        overline="قاعدة بيانات الاتصال والمستهدفات"
        badge={<Phone className="w-3.5 h-3.5 text-purple-900" />}
        title="الجوالات والداتا (Phones & Data)"
        subtitle="إدارة المستهدفات والهواتف المحدثة والجهات التعاقدية."
        actions={
          <div className="flex items-center gap-3">
            {/* Upload CSV Button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#1E1B4B] hover:bg-indigo-900 text-white rounded-2xl px-5 py-2.5 h-auto text-xs font-bold shadow-xs gap-2 shrink-0 transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              رفع ملف CSV (Upload CSV)
            </Button>

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl px-5 py-2.5 h-auto text-xs font-bold shadow-2xs gap-2 shrink-0"
            >
              <Download className="w-4 h-4 text-slate-500" />
              تصدير (Export)
            </Button>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────
          Main Container
      ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        {/* ─────────────────────────────────────────────
            Three KPI Cards Grid
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* KPI 1: Total Numbers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-950 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +16%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-500 block">إجمالي الأرقام (Total Numbers)</span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1 tracking-tight">
                223,763
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">مقارنة بالشهر السابق</p>
            </div>
          </div>

          {/* KPI 2: Active Numbers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +12%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-500 block">الأرقام النشطة (Active Numbers)</span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1 tracking-tight">
                89,922
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">مقارنة بالشهر السابق</p>
            </div>
          </div>

          {/* KPI 3: Total Uploaded Files */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -5%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-500 block">الملفات المرفوعة (Uploaded Files)</span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1 tracking-tight">
                132
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">مقارنة بالشهر السابق</p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            Split Content Area (Table + Distribution Sidebar)
        ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ─────────────────────────────────────────────
              Main Column (Data Table Section - 8 cols)
          ───────────────────────────────────────────── */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Search & Filter Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المسوق أو رقم الجوال..."
                  className="pr-10 bg-slate-50/70 border-slate-200 text-sm focus-visible:ring-purple-900 h-11 rounded-2xl"
                  icon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              {/* Entity Filter */}
              <div className="w-full sm:w-48 shrink-0">
                <Select
                  value={selectedEntityFilter}
                  onValueChange={setSelectedEntityFilter}
                >
                  <SelectTrigger className="bg-slate-50/70 border-slate-200 h-11 text-xs font-bold rounded-2xl">
                    <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                    <SelectValue placeholder="كل الجهات" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="ALL">كل الجهات التعاقدية</SelectItem>
                    <SelectItem value="بيت التمكين">بيت التمكين</SelectItem>
                    <SelectItem value="غزارة">غزارة</SelectItem>
                    <SelectItem value="معين">معين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selection Status Banner */}
            {selectedIds.length > 0 && (
              <div className="bg-indigo-50/70 px-6 py-2.5 border-b border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-950">
                <span>تم تحديد {selectedIds.length} عنصر</span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-indigo-700 hover:underline"
                >
                  إلغاء التحديد
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200/90 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredRecords.length > 0 &&
                          selectedIds.length === filteredRecords.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-indigo-950 focus:ring-indigo-900 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4">اسم الجوال / المسوق</th>
                    <th className="py-4 px-4">رقم الجوال</th>
                    <th className="py-4 px-4">الجهة التعاقدية</th>
                    <th className="py-4 px-4">تاريخ الإضافة</th>
                    <th className="py-4 px-4 text-center">الحالة</th>
                    <th className="py-4 px-4 text-center w-16">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400">
                        <Phone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">لم يتم العثور على أرقام مطابقة</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          جرب تعديل كلمات البحث أو اختيار جهة أخرى.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => {
                      const isSelected = selectedIds.includes(rec.id);
                      const isMenuOpen = openActionMenuId === rec.id;

                      const entityBadge =
                        rec.entity === "بيت التمكين"
                          ? "bg-purple-50 text-purple-900 border-purple-200"
                          : rec.entity === "غزارة"
                          ? "bg-cyan-50 text-cyan-900 border-cyan-200"
                          : "bg-amber-50 text-amber-900 border-amber-200";

                      return (
                        <tr
                          key={rec.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isSelected ? "bg-indigo-50/40" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(rec.id)}
                              className="rounded border-slate-300 text-indigo-950 focus:ring-indigo-900 w-4 h-4 cursor-pointer"
                            />
                          </td>

                          {/* Contact Name with Avatar */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="w-8 h-8 bg-indigo-950 text-white font-bold text-[11px] shrink-0">
                                <AvatarFallback className="bg-indigo-950 text-white">
                                  {rec.contactName.trim().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {rec.contactName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {rec.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Phone Number */}
                          <td className="py-4 px-4 font-mono font-bold text-slate-800 text-left dir-ltr">
                            {formatSaudiPhone(rec.phone)}
                          </td>

                          {/* Entity */}
                          <td className="py-4 px-4">
                            <Badge variant="outline" className={`${entityBadge} font-bold text-[11px]`}>
                              {rec.entity}
                            </Badge>
                          </td>

                          {/* Date Added */}
                          <td className="py-4 px-4 font-mono text-slate-500 whitespace-nowrap">
                            {rec.dateAdded}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            {rec.status === "Active" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                نشط (Active)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                غير نشط (Inactive)
                              </span>
                            )}
                          </td>

                          {/* Actions Three-dot menu */}
                          <td className="py-4 px-4 text-center relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionMenuId(isMenuOpen ? null : rec.id)
                              }
                              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              title="خيارات"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Popup Menu */}
                            {isMenuOpen && (
                              <div
                                dir="rtl"
                                className="absolute left-4 top-10 z-30 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-1 text-right animate-in fade-in zoom-in-95"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(rec.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-indigo-700" />
                                  <span>تبديل الحالة</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecord(rec.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>حذف الرقم</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50/70 border-t border-slate-200/90 px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>عرض {filteredRecords.length} سجل اتصال</span>
              <span className="font-mono text-[11px] text-slate-400">
                منصة بيت التمكين الموحدة © 2026
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Side Panel (Data Distribution by Entity - 4 cols)
          ───────────────────────────────────────────── */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-950" />
                <h3 className="text-base font-bold text-slate-900">
                  توزيع البيانات حسب الجهة
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                نسبة توزيع أرقام وقوائم التواصل المخصصة لكل جهة تعاقدية.
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-5">
              {/* Entity 1: Bayt Al-Tamkeen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">بيت التمكين للتسويق (الشركة الأم)</span>
                  <span className="font-mono text-purple-900 font-black">54%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-purple-900 to-indigo-950 rounded-full transition-all duration-700"
                    style={{ width: "54%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>120,832 رقم اتصال</span>
                  <span>المركز الرئيسي</span>
                </div>
              </div>

              {/* Entity 2: Ghazara */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">شركة غزارة للتجارة والتسويق</span>
                  <span className="font-mono text-cyan-800 font-black">28%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-cyan-600 to-cyan-800 rounded-full transition-all duration-700"
                    style={{ width: "28%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>62,653 رقم اتصال</span>
                  <span>فرع الرياض</span>
                </div>
              </div>

              {/* Entity 3: Moeen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">مؤسسة معين الرقمية التجارية</span>
                  <span className="font-mono text-amber-700 font-black">18%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-amber-500 to-amber-700 rounded-full transition-all duration-700"
                    style={{ width: "18%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>40,278 رقم اتصال</span>
                  <span>فرع الغربية</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                ملاحظة التخصيص:
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                يتم تحديث نسب التوزيع تلقائياً عند استيراد أي ملف CSV جديد بناءً على الكيان
                التعاقدي المحدد في الملف.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────
          Export Modal (Email Report Modal)
      ───────────────────────────────────────────── */}
      {isExportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsExportModalOpen(false)}
        >
          <div
            dir="rtl"
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/90 duration-200 animate-in zoom-in-95"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute left-5 top-5 rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-950 flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-900" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  تصدير التقرير عبر البريد (Email report)
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              اختر نوع الملف وسنرسل التقرير مباشرة إلى بريدك الإلكتروني المعتمد.
            </p>

            <form onSubmit={handleConfirmExport} className="space-y-5">
              {/* File Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  صيغة الملف المطلوبة
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Excel */}
                  <button
                    type="button"
                    onClick={() => setSelectedFileType("excel")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      selectedFileType === "excel"
                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileSpreadsheet
                      className={`w-5 h-5 mb-1 ${
                        selectedFileType === "excel" ? "text-emerald-600" : "text-slate-400"
                      }`}
                    />
                    <span className="text-xs">ملف Excel</span>
                  </button>

                  {/* PDF */}
                  <button
                    type="button"
                    onClick={() => setSelectedFileType("pdf")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      selectedFileType === "pdf"
                        ? "border-rose-500 bg-rose-50/50 text-rose-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 mb-1 ${
                        selectedFileType === "pdf" ? "text-rose-600" : "text-slate-400"
                      }`}
                    />
                    <span className="text-xs">ملف PDF</span>
                  </button>

                  {/* CSV */}
                  <button
                    type="button"
                    onClick={() => setSelectedFileType("csv")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      selectedFileType === "csv"
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileCode
                      className={`w-5 h-5 mb-1 ${
                        selectedFileType === "csv" ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    <span className="text-xs">ملف CSV</span>
                  </button>
                </div>
              </div>

              {/* Email Input Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  البريد الإلكتروني للإرسال
                </label>
                <Input
                  type="email"
                  value={exportEmail}
                  onChange={(e) => setExportEmail(e.target.value)}
                  placeholder="user@company.com"
                  required
                  className="bg-slate-50 border-slate-200 font-mono text-xs h-11 rounded-2xl"
                />
              </div>

              {/* Additional Emails List */}
              {additionalEmails.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    عناوين إضافية:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {additionalEmails.map((em, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-mono"
                      >
                        {em}
                        <button
                          type="button"
                          onClick={() =>
                            setAdditionalEmails((p) => p.filter((_, i) => i !== idx))
                          }
                          className="hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add more email link */}
              <div>
                {!showAdditionalInput ? (
                  <button
                    type="button"
                    onClick={() => setShowAdditionalInput(true)}
                    className="text-xs font-bold text-indigo-900 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + إضافة بريد إلكتروني إضافي
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="email"
                      value={newExtraEmail}
                      onChange={(e) => setNewExtraEmail(e.target.value)}
                      placeholder="بريد إلكتروني آخر..."
                      className="text-xs h-9 font-mono rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAddExtraEmail}
                      className="bg-slate-800 text-white text-xs h-9 px-3 rounded-xl"
                    >
                      إضافة
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowAdditionalInput(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExportModalOpen(false)}
                  className="rounded-2xl px-5 h-11 text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 h-11 text-xs font-bold shadow-xs gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  تأكيد إرسال التقرير (Confirm)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
