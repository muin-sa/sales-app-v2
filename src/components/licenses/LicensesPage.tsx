"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type AlertStatus = "valid" | "expiring_soon" | "expired";

interface License {
  id: string;
  name: string;
  licenseNumber: string;
  associationName: string;
  licenseType: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  alertStatus: AlertStatus;
}

// ─────────────────────────────────────────────
//  Mock Data (aligned with database/seed.sql)
// ─────────────────────────────────────────────
const MOCK_LICENSES: License[] = [
  {
    id: "1",
    name: "ترخيص جمع التبرعات",
    licenseNumber: "LIC-نصا-2026",
    associationName: "جمعية نصا للتنمية",
    licenseType: "جمع تبرعات",
    issuingAuthority: "وزارة الشؤون الاجتماعية",
    issueDate: "2025-08-20",
    expiryDate: "2026-08-20",
    alertStatus: "expired",
  },
  {
    id: "2",
    name: "ترخيص جمع التبرعات",
    licenseNumber: "LIC-الأل-2026",
    associationName: "جمعية الأُلفة الخيرية",
    licenseType: "جمع تبرعات",
    issuingAuthority: "وزارة الشؤون الاجتماعية",
    issueDate: "2025-08-20",
    expiryDate: "2026-08-20",
    alertStatus: "expired",
  },
  {
    id: "3",
    name: "ترخيص جمع التبرعات",
    licenseNumber: "LIC-زرعة-2026",
    associationName: "جمعية زراعة المستقبل",
    licenseType: "جمع تبرعات",
    issuingAuthority: "وزارة الشؤون الاجتماعية",
    issueDate: "2025-08-20",
    expiryDate: "2026-08-20",
    alertStatus: "expired",
  },
  {
    id: "4",
    name: "ترخيص جمع التبرعات",
    licenseNumber: "LIC-أفاق-2026",
    associationName: "جمعية آفاق التنمية",
    licenseType: "جمع تبرعات",
    issuingAuthority: "وزارة الشؤون الاجتماعية",
    issueDate: "2025-08-20",
    expiryDate: "2026-08-20",
    alertStatus: "expired",
  },
  {
    id: "5",
    name: "ترخيص تشغيل مركز",
    licenseNumber: "LIC-2026-9812",
    associationName: "بيت التمكين للتسويق",
    licenseType: "تشغيل",
    issuingAuthority: "أمانة منطقة الرياض",
    issueDate: "2025-01-15",
    expiryDate: "2027-01-15",
    alertStatus: "valid",
  },
  {
    id: "6",
    name: "ترخيص تسويق ورعاية",
    licenseNumber: "LIC-EST-892",
    associationName: "جمعية معين الخيرية",
    licenseType: "تسويق",
    issuingAuthority: "هيئة الزكاة والضريبة",
    issueDate: "2024-11-01",
    expiryDate: "2026-11-15",
    alertStatus: "expiring_soon",
  },
  {
    id: "7",
    name: "ترخيص الأنشطة الخيرية",
    licenseNumber: "LIC-MKT-334",
    associationName: "مؤسسة دعم التنمية",
    licenseType: "أنشطة خيرية",
    issuingAuthority: "وزارة الشؤون الاجتماعية",
    issueDate: "2024-06-10",
    expiryDate: "2025-06-10",
    alertStatus: "expired",
  },
  {
    id: "8",
    name: "ترخيص الإعلام والتواصل",
    licenseNumber: "LIC-MED-2026",
    associationName: "بيت التمكين للتسويق",
    licenseType: "إعلام",
    issuingAuthority: "الهيئة العامة للإعلام",
    issueDate: "2025-03-01",
    expiryDate: "2026-12-01",
    alertStatus: "expiring_soon",
  },
];

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function daysLeft(expiryDate: string): number {
  return Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / 86_400_000
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

const STATUS_CONFIG: Record<
  AlertStatus,
  {
    label: string;
    pill: string;
    icon: React.ReactNode;
    footerText: (days: number) => string;
  }
> = {
  expired: {
    label: "منتهي",
    pill: "bg-[#FDF2F4] text-[#C52243] border border-[#FCD8E0]",
    icon: <AlertTriangle className="w-3 h-3" />,
    footerText: (days) => `متأخر ${Math.abs(days).toLocaleString("en-US")} يوماً`,
  },
  expiring_soon: {
    label: "ينتهي قريباً",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: <Clock className="w-3 h-3" />,
    footerText: (days) => `متبقي ${days.toLocaleString("en-US")} يوماً`,
  },
  valid: {
    label: "ساري",
    pill: "bg-[#E8F8EE] text-[#0D8A4E] border border-[#C5EED6]",
    icon: <CheckCircle2 className="w-3 h-3" />,
    footerText: (days) => `متبقي ${days.toLocaleString("en-US")} يوماً`,
  },
};

const FILTER_TABS: { id: AlertStatus | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "valid", label: "سارية" },
  { id: "expiring_soon", label: "تنتهي قريباً" },
  { id: "expired", label: "منتهية" },
];

// ─────────────────────────────────────────────
//  Add License Modal
// ─────────────────────────────────────────────
interface AddLicenseModalProps {
  onClose: () => void;
  onSave: (l: Omit<License, "id" | "alertStatus">) => void;
}

function AddLicenseModal({ onClose, onSave }: AddLicenseModalProps) {
  const [form, setForm] = useState({
    name: "",
    licenseNumber: "",
    associationName: "",
    licenseType: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.licenseNumber || !form.expiryDate) return;
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        dir="rtl"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#232B5D] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-slate-900">إضافة ترخيص جديد</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                اسم الترخيص <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="مثال: ترخيص جمع التبرعات"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                رقم الترخيص <span className="text-red-500">*</span>
              </label>
              <input
                value={form.licenseNumber}
                onChange={set("licenseNumber")}
                placeholder="LIC-XXXX-2026"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">نوع الترخيص</label>
              <select
                value={form.licenseType}
                onChange={set("licenseType")}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors appearance-none"
              >
                <option value="">اختر النوع</option>
                <option value="جمع تبرعات">جمع تبرعات</option>
                <option value="تشغيل">تشغيل</option>
                <option value="تسويق">تسويق</option>
                <option value="إعلام">إعلام</option>
                <option value="أنشطة خيرية">أنشطة خيرية</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">اسم الجمعية</label>
              <input
                value={form.associationName}
                onChange={set("associationName")}
                placeholder="اسم الجمعية أو المؤسسة"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">جهة الإصدار</label>
              <input
                value={form.issuingAuthority}
                onChange={set("issuingAuthority")}
                placeholder="مثال: وزارة الشؤون الاجتماعية"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">تاريخ الإصدار</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={set("issueDate")}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={set("expiryDate")}
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100 mt-5">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#232B5D] hover:bg-[#1a2048] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              حفظ الترخيص
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  License Card
// ─────────────────────────────────────────────
interface LicenseCardProps {
  license: License;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function LicenseCard({ license, onEdit, onDelete }: LicenseCardProps) {
  const days = daysLeft(license.expiryDate);
  const cfg = STATUS_CONFIG[license.alertStatus];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col gap-0 hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      {/* Top Row */}
      <div className="flex items-start justify-between">
        {/* Right: badge icon */}
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-5 h-5 text-[#232B5D]" />
        </div>

        {/* Left: status + actions */}
        <div className="flex items-center gap-1.5">
          {/* Status pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.pill}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>

          {/* Edit */}
          <button
            onClick={() => onEdit(license.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#232B5D] hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
            title="تعديل"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(license.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle: name + number */}
      <div className="mt-4 text-right">
        <h3 className="font-bold text-[#232B5D] text-[15px] leading-snug">{license.name}</h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-wide">{license.licenseNumber}</p>
        <p className="text-xs text-slate-500 mt-1">{license.associationName}</p>
      </div>

      {/* Divider */}
      <hr className="border-slate-100 my-4" />

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-slate-300" />
          <span>الانتهاء: {formatDate(license.expiryDate)}</span>
        </div>
        <span
          className={`font-semibold ${
            license.alertStatus === "expired"
              ? "text-[#C52243]"
              : license.alertStatus === "expiring_soon"
              ? "text-amber-600"
              : "text-[#0D8A4E]"
          }`}
        >
          {cfg.footerText(days)}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Stats Bar
// ─────────────────────────────────────────────
function StatsBar({ licenses }: { licenses: License[] }) {
  const total = licenses.length;
  const valid = licenses.filter((l) => l.alertStatus === "valid").length;
  const expiringSoon = licenses.filter((l) => l.alertStatus === "expiring_soon").length;
  const expired = licenses.filter((l) => l.alertStatus === "expired").length;

  const stats = [
    { label: "إجمالي التراخيص", value: total, color: "text-[#232B5D]", bg: "bg-[#232B5D]/8" },
    { label: "سارية", value: valid, color: "text-[#0D8A4E]", bg: "bg-[#E8F8EE]" },
    { label: "تنتهي قريباً", value: expiringSoon, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "منتهية", value: expired, color: "text-[#C52243]", bg: "bg-[#FDF2F4]" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} rounded-2xl px-5 py-4 flex flex-col gap-1 border border-white`}
        >
          <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          <span className="text-xs text-slate-500 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────
export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [filterTab, setFilterTab] = useState<AlertStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered list
  const filtered = useMemo(() => {
    let list = licenses;
    if (filterTab !== "all") list = list.filter((l) => l.alertStatus === filterTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.name.includes(q) ||
          l.licenseNumber.toLowerCase().includes(q) ||
          l.associationName.includes(q)
      );
    }
    return list;
  }, [licenses, filterTab, search]);

  function handleAdd(data: Omit<License, "id" | "alertStatus">) {
    const days = daysLeft(data.expiryDate);
    const alertStatus: AlertStatus =
      days < 0 ? "expired" : days <= 30 ? "expiring_soon" : "valid";
    setLicenses((prev) => [
      { ...data, id: String(Date.now()), alertStatus },
      ...prev,
    ]);
    setShowAddModal(false);
  }

  function handleDelete(id: string) {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  }

  function handleEdit(id: string) {
    // Placeholder — wire to edit modal as next step
    alert(`تعديل الترخيص رقم: ${id}`);
  }

  const expiredCount = licenses.filter((l) => l.alertStatus === "expired").length;
  const expiringSoonCount = licenses.filter((l) => l.alertStatus === "expiring_soon").length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ── Page Header ── */}
      <PageHeader
        overline="عمليات المبيعات"
        title="التراخيص والأصول"
        subtitle="إدارة تراخيص الجمعيات مع تنبيهات تلقائية لتواريخ الانتهاء وتتبع حالة كل ترخيص."
        actions={
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1E1B4B] hover:bg-[#2e2a72] text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة ترخيص</span>
          </Button>
        }
      >
        {/* Alert banner — show only if expired / expiring */}
        {(expiredCount > 0 || expiringSoonCount > 0) && (
          <div className="w-full mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              {expiredCount > 0 && (
                <span>
                  <strong>{expiredCount}</strong> ترخيص منتهي الصلاحية
                  {expiringSoonCount > 0 && "، "}
                </span>
              )}
              {expiringSoonCount > 0 && (
                <span>
                  <strong>{expiringSoonCount}</strong> ترخيص ينتهي خلال 30 يوماً
                </span>
              )}
              {" — يُنصح بالتجديد الفوري."}
            </p>
          </div>
        )}
      </PageHeader>

      {/* ── Content ── */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        {/* Stats */}
        <StatsBar licenses={licenses} />

        {/* Controls row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو رقم الترخيص..."
              className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900/20 focus:border-purple-900 transition-colors"
            />
          </div>

          {/* Filter pill tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  filterTab === tab.id
                    ? "bg-white text-[#232B5D] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.id !== "all" && (
                  <span className="mr-1 opacity-60">
                    ({licenses.filter((l) => tab.id === "all" || l.alertStatus === tab.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">لا توجد تراخيص</h3>
            <p className="text-sm text-slate-400">
              {search ? "لم يتطابق أي ترخيص مع بحثك. جرب كلمة أخرى." : "ابدأ بإضافة أول ترخيص."}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#232B5D] text-white text-xs font-semibold rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة ترخيص
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((license) => (
              <LicenseCard
                key={license.id}
                license={license}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddLicenseModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
    </div>
  );
}
