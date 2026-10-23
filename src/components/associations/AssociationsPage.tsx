"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Building2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  FileText,
  DollarSign,
  Calendar,
  X,
  Smartphone,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";

export interface Association {
  id: string;
  name: string;
  code: string;
  location: string;
  status: "active" | "inactive";
  contractEntity: string;
  supervisor: string;
  marketer: string;
  licenseNumber: string;
  licenseExpiry: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requestsCount: number;
  totalRevenue: number;
  agreementCommissionRate: number;
  simCardsCount: number;
  lastActivity: string;
}

const mockAssociations: Association[] = [
  {
    id: "assoc-1",
    name: "المحيصة",
    code: "ASSOC-MHS",
    location: "لم يحدد الموقع",
    status: "active",
    contractEntity: "مؤسسة بيت التمكين للتسويق",
    supervisor: "أ. سلطان المنصور",
    marketer: "أحمد منصور البارقي",
    licenseNumber: "LIC-2026-1011",
    licenseExpiry: "2026-12-31",
    contactPerson: "أ. فهد المحيص",
    contactPhone: "0501239874",
    contactEmail: "info@almuhaisah.org.sa",
    requestsCount: 6,
    totalRevenue: 85000,
    agreementCommissionRate: 8.5,
    simCardsCount: 3,
    lastActivity: "منذ ساعتين",
  },
  {
    id: "assoc-2",
    name: "روائع النجع",
    code: "ASSOC-RNJ",
    location: "لم يحدد الموقع",
    status: "active",
    contractEntity: "شركة غزارة للتجارة والتسويق",
    supervisor: "أ. سلطان المنصور",
    marketer: "سارة فهد القحطاني",
    licenseNumber: "LIC-2026-2042",
    licenseExpiry: "2026-11-20",
    contactPerson: "د. نايف الشمري",
    contactPhone: "0554433221",
    contactEmail: "contact@naja-charity.sa",
    requestsCount: 4,
    totalRevenue: 62000,
    agreementCommissionRate: 9.0,
    simCardsCount: 2,
    lastActivity: "منذ يوم واحد",
  },
  {
    id: "assoc-3",
    name: "صفينة",
    code: "ASSOC-SFN",
    location: "لم يحدد الموقع",
    status: "active",
    contractEntity: "مؤسسة معين الرقمية التجارية",
    supervisor: "م. عبدالعزيز التميمي",
    marketer: "أحمد منصور البارقي",
    licenseNumber: "LIC-2026-3088",
    licenseExpiry: "2027-02-15",
    contactPerson: "أ. عبدالملك الصالح",
    contactPhone: "0543322110",
    contactEmail: "admin@safina-org.sa",
    requestsCount: 8,
    totalRevenue: 124000,
    agreementCommissionRate: 10.0,
    simCardsCount: 4,
    lastActivity: "منذ 3 ساعات",
  },
  {
    id: "assoc-4",
    name: "خريغط",
    code: "ASSOC-KRG",
    location: "لم يحدد الموقع",
    status: "active",
    contractEntity: "مؤسسة بيت التمكين للتسويق",
    supervisor: "أ. سلطان المنصور",
    marketer: "سارة فهد القحطاني",
    licenseNumber: "LIC-2026-4050",
    licenseExpiry: "2026-10-30",
    contactPerson: "أ. إبراهيم الخريغط",
    contactPhone: "0567788991",
    contactEmail: "care@khraigat.sa",
    requestsCount: 3,
    totalRevenue: 45000,
    agreementCommissionRate: 7.5,
    simCardsCount: 2,
    lastActivity: "منذ يومين",
  },
  {
    id: "assoc-5",
    name: "جمعية إحسان لرعاية الأيتام",
    code: "ASSOC-01",
    location: "الرياض - حي الملز",
    status: "active",
    contractEntity: "شركة غزارة للتجارة والتسويق",
    supervisor: "أ. سلطان المنصور",
    marketer: "أحمد منصور البارقي",
    licenseNumber: "1042 / م.ع",
    licenseExpiry: "2026-12-31",
    contactPerson: "أ. عبدالله السليمان",
    contactPhone: "0501234567",
    contactEmail: "info@ehsan-orphan.org.sa",
    requestsCount: 14,
    totalRevenue: 280000,
    agreementCommissionRate: 10.0,
    simCardsCount: 5,
    lastActivity: "منذ 30 دقيقة",
  },
  {
    id: "assoc-6",
    name: "جمعية البر والخدمات الإنسانية",
    code: "ASSOC-02",
    location: "جدة - حي الرويس",
    status: "active",
    contractEntity: "شركة غزارة للتجارة والتسويق",
    supervisor: "أ. سلطان المنصور",
    marketer: "أحمد منصور البارقي",
    licenseNumber: "892 / م.ع",
    licenseExpiry: "2026-11-15",
    contactPerson: "د. ناصر الغامدي",
    contactPhone: "0559876543",
    contactEmail: "contact@birr-charity.sa",
    requestsCount: 9,
    totalRevenue: 195000,
    agreementCommissionRate: 8.5,
    simCardsCount: 3,
    lastActivity: "منذ 4 ساعات",
  },
  {
    id: "assoc-7",
    name: "جمعية إطعام وحفظ النعمة",
    code: "ASSOC-03",
    location: "الدمام - حي الشاطئ",
    status: "active",
    contractEntity: "مؤسسة معين الرقمية التجارية",
    supervisor: "م. عبدالعزيز التميمي",
    marketer: "سارة فهد القحطاني",
    licenseNumber: "650 / م.ع",
    licenseExpiry: "2026-06-01",
    contactPerson: "م. فيصل الخالدي",
    contactPhone: "0567788990",
    contactEmail: "care@itaam-east.sa",
    requestsCount: 11,
    totalRevenue: 160000,
    agreementCommissionRate: 9.0,
    simCardsCount: 4,
    lastActivity: "أمس",
  },
];

/**
 * Reusable Association File Detail Component (used in desktop split view & mobile drawer)
 */
function AssociationDetailView({
  association,
  onClose,
}: {
  association: Association;
  onClose: () => void;
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 md:p-8 shadow-2xs flex flex-col gap-6 animate-in fade-in-50 duration-200">
      {/* Header with Close / Deselect Button */}
      <div className="flex items-start justify-between pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#1E1B4B] flex items-center justify-center font-bold text-lg shrink-0 border border-purple-100">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {association.name}
              </h2>
              <Badge className="bg-[#E8F8EE] text-[#0D8A4E] border border-[#C5EED6] text-[11px] font-semibold px-2.5 py-0.5">
                نشط
              </Badge>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {association.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>الجهة التعاقدية:</span>
              <strong className="text-slate-700">{association.contractEntity}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            title="إغلاق الملف"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#FAF8FF] border border-[#E9E4F8] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">إجمالي الإيرادات</span>
            <DollarSign className="w-4 h-4 text-purple-700 stroke-[2.2]" />
          </div>
          <div className="text-base md:text-lg font-bold text-slate-900">
            {association.totalRevenue.toLocaleString("en-US")}{" "}
            <span className="text-xs font-normal text-slate-500">ر.س</span>
          </div>
          <span className="text-[10px] text-purple-700 mt-1 font-medium">
            نسبة العقد: {association.agreementCommissionRate}%
          </span>
        </div>

        <div className="bg-[#F2FCF7] border border-[#DCF7E9] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">الطلبات المسجلة</span>
            <FileText className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
          </div>
          <div className="text-base md:text-lg font-bold text-slate-900">
            {association.requestsCount}{" "}
            <span className="text-xs font-normal text-slate-500">طلب</span>
          </div>
          <span className="text-[10px] text-emerald-700 mt-1 font-medium">
            آخر تحديث: {association.lastActivity}
          </span>
        </div>

        <div className="bg-[#FFFDF4] border border-[#FEF3C7] rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">التراخيص النظامية</span>
            <ShieldCheck className="w-4 h-4 text-amber-600 stroke-[2.2]" />
          </div>
          <div className="text-base md:text-lg font-bold text-slate-900">سارية</div>
          <span className="text-[10px] text-amber-700 mt-1 font-medium">
            تنتهي: {association.licenseExpiry}
          </span>
        </div>

        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">الشرائح والجوالات</span>
            <Smartphone className="w-4 h-4 text-[#1E1B4B] stroke-[2.2]" />
          </div>
          <div className="text-base md:text-lg font-bold text-slate-900">
            {association.simCardsCount}{" "}
            <span className="text-xs font-normal text-slate-500">أجهزة مسجلة</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-medium">
            مسلمة بالكامل بعهد
          </span>
        </div>
      </div>

      {/* Contact Information & Staff Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Card */}
        <div className="border border-slate-200/90 rounded-xl p-4.5 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-500 stroke-[2.2]" />
            بيانات مسؤول التواصل
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الاسم:</span>
              <span className="font-semibold text-slate-800">{association.contactPerson}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">رقم الجوال:</span>
              <span dir="ltr" className="font-mono text-slate-800">{association.contactPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">البريد الإلكتروني:</span>
              <span dir="ltr" className="font-mono text-slate-800">{association.contactEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">الموقع الجغرافي:</span>
              <span className="text-slate-800">{association.location}</span>
            </div>
          </div>
        </div>

        {/* Team Assignment Card */}
        <div className="border border-slate-200/90 rounded-xl p-4.5 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-500 stroke-[2.2]" />
            فريق العمل والمتابعة
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">المشرف المسؤول:</span>
              <span className="font-semibold text-slate-800">{association.supervisor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">المسوق الميداني:</span>
              <span className="font-semibold text-slate-800">{association.marketer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">رقم ترخيص الحملة:</span>
              <span className="font-mono text-slate-800">{association.licenseNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">حالة الربط:</span>
              <span className="text-emerald-700 font-semibold">نشط ومفعل بالنظام</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Operational Activities / Requests Mock */}
      <div className="border border-slate-200/90 rounded-xl p-4.5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-purple-900 stroke-[2.2]" />
            الطلبات وسندات التبرع الحديثة
          </h3>
          <span className="text-[11px] text-purple-900 font-semibold cursor-pointer hover:underline">
            عرض كافة الطلبات ({association.requestsCount})
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-700">REQ-2026-1001</span>
              <span className="text-slate-600 font-medium">حملة كفالة أيتام - المرحلة الأولى</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800">50,000 ر.س</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">مكتمل</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-700">REQ-2026-1002</span>
              <span className="text-slate-600 font-medium">دعم الحالات الطبية وسندات التبرع المباشر</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800">30,000 ر.س</span>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">بانتظار المشرف</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" className="text-xs rounded-xl border-slate-200 px-4 py-2 font-medium cursor-pointer">
          تعديل بيانات الجمعية
        </Button>
        <Button className="bg-[#1E1B4B] hover:bg-[#2e2a72] text-white text-xs rounded-xl px-4 py-2 font-semibold cursor-pointer">
          رفع طلب جديد لهذه الجمعية
        </Button>
      </div>
    </div>
  );
}

export default function AssociationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState("all");
  const [selectedMarketer, setSelectedMarketer] = useState("all");
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | null>(null);

  // Filtered associations list
  const filteredAssociations = useMemo(() => {
    return mockAssociations.filter((assoc) => {
      // Search matching
      const matchesSearch =
        assoc.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        assoc.code.toLowerCase().includes(searchQuery.trim().toLowerCase());

      // Entity filter
      const matchesEntity =
        selectedEntity === "all" || assoc.contractEntity === selectedEntity;

      // Supervisor filter
      const matchesSupervisor =
        selectedSupervisor === "all" || assoc.supervisor === selectedSupervisor;

      // Marketer filter
      const matchesMarketer =
        selectedMarketer === "all" || assoc.marketer === selectedMarketer;

      return matchesSearch && matchesEntity && matchesSupervisor && matchesMarketer;
    });
  }, [searchQuery, selectedEntity, selectedSupervisor, selectedMarketer]);

  // Currently selected association object
  const selectedAssociation = useMemo(() => {
    return mockAssociations.find((a) => a.id === selectedAssociationId) || null;
  }, [selectedAssociationId]);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header Section */}
      <PageHeader
        overline="عمليات المبيعات"
        title="الجمعيات"
        subtitle="ملفات تعريف مترابطة تضم البيانات الأساسية والإيرادات والطلبات والتراخيص والجوالات وسجل الاستلام والتسليم."
        actions={
          <Button className="bg-[#1E1B4B] hover:bg-[#2e2a72] text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة جمعية +</span>
          </Button>
        }
      />

      {/* Split Content Area */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: List & Filters (Full width on mobile, 42% / 5 cols on desktop) */}
        <section className="w-full lg:col-span-5 flex flex-col gap-4">
          {/* Search Bar */}
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الجمعية..."
            icon={<Search className="w-4 h-4 text-slate-400 stroke-[2.2]" />}
            className="w-full bg-white shadow-2xs border-slate-200"
          />

          {/* Filter Dropdowns Stacked */}
          <div className="flex flex-col gap-2.5">
            <Select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              aria-label="تصفية بالجهة التعاقدية"
            >
              <option value="all">كل الجهات التعاقدية</option>
              <option value="مؤسسة بيت التمكين للتسويق">مؤسسة بيت التمكين للتسويق</option>
              <option value="شركة غزارة للتجارة والتسويق">شركة غزارة للتجارة والتسويق</option>
              <option value="مؤسسة معين الرقمية التجارية">مؤسسة معين الرقمية التجارية</option>
            </Select>

            <Select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              aria-label="تصفية بالمشرف"
            >
              <option value="all">كل المشرفين</option>
              <option value="أ. سلطان المنصور">أ. سلطان المنصور</option>
              <option value="م. عبدالعزيز التميمي">م. عبدالعزيز التميمي</option>
            </Select>

            <Select
              value={selectedMarketer}
              onChange={(e) => setSelectedMarketer(e.target.value)}
              aria-label="تصفية بالمسوق"
            >
              <option value="all">كل المسوقين</option>
              <option value="أحمد منصور البارقي">أحمد منصور البارقي</option>
              <option value="سارة فهد القحطاني">سارة فهد القحطاني</option>
            </Select>
          </div>

          {/* Associations List */}
          <div className="flex flex-col gap-2.5 mt-2">
            {filteredAssociations.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">لا توجد جمعيات تطابق شروط البحث</p>
                <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو تعديل الفلاتر</p>
              </div>
            ) : (
              filteredAssociations.map((assoc) => {
                const isSelected = selectedAssociationId === assoc.id;
                return (
                  <Card
                    key={assoc.id}
                    onClick={() => setSelectedAssociationId(assoc.id)}
                    className={`cursor-pointer transition-all duration-200 border rounded-xl overflow-hidden hover:shadow-xs ${
                      isSelected
                        ? "border-purple-900 bg-purple-50/20 ring-2 ring-purple-900/15 shadow-xs"
                        : "border-slate-200/90 bg-white hover:border-slate-300"
                    }`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      {/* Right side: Name and Location */}
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                          {assoc.name}
                        </span>
                        <span className="text-xs text-slate-400 font-normal mt-0.5">
                          {assoc.location}
                        </span>
                      </div>

                      {/* Left side: Active Pill Badge */}
                      <div className="shrink-0">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#0D8A4E] border border-[#C5EED6]">
                          نشط
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* Left Column (Desktop Split View - 58% / 7 cols): Hidden on mobile */}
        <section className="hidden lg:block lg:col-span-7">
          {!selectedAssociation ? (
            /* Empty State on Desktop */
            <div className="w-full min-h-[540px] bg-white rounded-2xl border border-slate-200/90 p-8 md:p-14 flex flex-col items-center justify-center text-center shadow-2xs">
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-5 shadow-inner">
                <Building2 className="w-10 h-10 stroke-[1.7]" />
              </div>

              <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight mb-2">
                اختر جمعية لعرض ملفها
              </h2>

              <p className="text-xs md:text-sm text-slate-400 max-w-md leading-relaxed font-normal">
                ستظهر هنا العلاقة بين الإيرادات والطلبات والتراخيص والجوالات وسجل الاستلام والتسليم.
              </p>
            </div>
          ) : (
            /* Selected Association Details on Desktop */
            <AssociationDetailView
              association={selectedAssociation}
              onClose={() => setSelectedAssociationId(null)}
            />
          )}
        </section>
        </div>
      </main>

      {/* Mobile Drawer / Modal when an Association is Selected */}
      {selectedAssociation && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedAssociationId(null)}
            aria-label="إغلاق الملف"
          />
          <div className="relative z-10 w-full max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-8 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            <AssociationDetailView
              association={selectedAssociation}
              onClose={() => setSelectedAssociationId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
