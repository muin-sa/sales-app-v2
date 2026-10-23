"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
  Calendar,
  FileText,
  DollarSign,
  User,
  X,
  Check,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { RequestItem, INITIAL_REQUESTS, ASSOCIATIONS_LIST } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

type TabKey = "all" | "sales" | "referred" | "processing" | "awaiting_association" | "stalled" | "completed";

export default function RequestCenterView() {
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<string | null>(null);

  // New request form state
  const [newTitle, setNewTitle] = useState("");
  const [newAssociation, setNewAssociation] = useState(ASSOCIATIONS_LIST[0].name);
  const [newCategory, setNewCategory] = useState("كفالة أيتام وأرامل");
  const [newTargetAmount, setNewTargetAmount] = useState(50000);
  const [newNotes, setNewNotes] = useState("");

  // Edit form state
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);

  // Filtered requests based on search and active tab
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTab === "sales" && req.tab_stage !== "sales") return false;
      if (activeTab === "referred" && req.tab_stage !== "referred") return false;
      if (activeTab === "processing" && req.tab_stage !== "processing") return false;
      if (activeTab === "awaiting_association" && req.tab_stage !== "awaiting_association") return false;
      if (activeTab === "stalled" && req.tab_stage !== "stalled") return false;
      if (activeTab === "completed" && req.tab_stage !== "completed" && req.status !== "completed") return false;

      // Search query filter (by reference number or association name or title)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLowerCase();
        const matchesRef = req.reference_number.toLowerCase().includes(query);
        const matchesAssoc = req.association_name.toLowerCase().includes(query);
        const matchesTitle = req.title.toLowerCase().includes(query);
        return matchesRef || matchesAssoc || matchesTitle;
      }

      return true;
    });
  }, [requests, activeTab, searchQuery]);

  // Tab definitions matching the exact design in the screenshot
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "كل الطلبات" },
    { key: "sales", label: "لدى المبيعات" },
    { key: "referred", label: "مُحال" },
    { key: "processing", label: "في طور التجهيز" },
    { key: "awaiting_association", label: "بانتظار الجمعية" },
    { key: "stalled", label: "متعثّر" },
    { key: "completed", label: "مكتملة" },
  ];

  // Status badge styling helper
  const renderStatusBadge = (status: RequestItem["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Clock className="w-3.5 h-3.5" />
            قيد التنفيذ
          </span>
        );
      case "awaiting_supervisor":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <AlertCircle className="w-3.5 h-3.5" />
            بانتظار المشرف
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مغلق
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مكتمل
          </span>
        );
      case "stalled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle className="w-3.5 h-3.5" />
            متعثّر
          </span>
        );
      default:
        return null;
    }
  };

  // Change status handler
  const handleStatusChange = (id: string, newStatus: RequestItem["status"]) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          let label = "قيد التنفيذ";
          if (newStatus === "awaiting_supervisor") label = "بانتظار المشرف";
          if (newStatus === "closed") label = "مغلق";
          if (newStatus === "completed") label = "مكتمل";
          if (newStatus === "stalled") label = "متعثّر";
          return { ...r, status: newStatus, status_label: label };
        }
        return r;
      })
    );
    setActiveStatusDropdown(null);
  };

  // Delete request handler
  const handleDeleteRequest = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب؟")) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Increment reminder handler
  const handleIncrementReminder = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reminder_number: r.reminder_number + 1 } : r))
    );
  };

  // Add new request handler
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextIdNumber = requests.length + 1;
    const padded = String(nextIdNumber).padStart(6, "0");
    const newRef = `REQ-2026-${padded}`;

    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      reference_number: newRef,
      title: newTitle,
      association_name: newAssociation,
      association_code: "ASSOC-GEN",
      request_date: "2026/08/29",
      status: "in_progress",
      status_label: "قيد التنفيذ",
      category: newCategory,
      tab_stage: "processing",
      reminder_number: 0,
      marketer_name: "أحمد منصور البارقي",
      entity_name: "شركة غزارة للتجارة والتسويق",
      target_amount: Number(newTargetAmount),
      total_bonds_amount: 0,
      bonds_count: 0,
      notes: newNotes || "تم إنشاء الطلب وجارٍ المتابعة."
    };

    setRequests([newReq, ...requests]);
    setIsNewModalOpen(false);
    setNewTitle("");
    setNewNotes("");
  };

  // Save edit handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === editingRequest.id ? editingRequest : r))
    );
    setIsEditModalOpen(false);
    setEditingRequest(null);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. Header Section */}
      <PageHeader
        overline="عمليات المبيعات"
        title="طلبات قسم المبيعات"
        subtitle="شاشة موحدة مستلهمة من نموذج قسم المبيعات: الطلب والجمعية والتذكيرات والنتائج وملاحظات المبيعات والعلاقات والحالة قابلة للمتابعة من مكان واحد. لا يظهر الطلب للأقسام الأخرى إلا بعد إحالة إدارة المبيعات له."
        actions={
          <Button
            onClick={() => setIsNewModalOpen(true)}
            className="bg-[#1E1B4B] hover:bg-[#2E1065] text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>رفع طلب</span>
          </Button>
        }
      />

      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 space-y-6 pb-16">
        {/* 2. Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input on Right (in RTL) */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الطلب أو عنوانه..."
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#1E1B4B] text-white border-[#1E1B4B] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Requests Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold text-xs">
                <th className="py-4 px-6">الطلب</th>
                <th className="py-4 px-6">اسم الجمعية</th>
                <th className="py-4 px-6">تاريخ الطلب</th>
                <th className="py-4 px-6 text-center">الحالة</th>
                <th className="py-4 px-6 text-center">رقم التذكير</th>
                <th className="py-4 px-6 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    لا توجد طلبات مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* عمود الطلب */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                          {req.reference_number}
                        </span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">
                          {req.title}
                        </span>
                      </div>
                    </td>

                    {/* عمود اسم الجمعية */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {req.association_name}
                    </td>

                    {/* عمود تاريخ الطلب */}
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {req.request_date}
                    </td>

                    {/* عمود الحالة مع زر التعديل */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 relative">
                        {renderStatusBadge(req.status)}

                        {/* Dropdown toggle button */}
                        <button
                          onClick={() =>
                            setActiveStatusDropdown(
                              activeStatusDropdown === req.id ? null : req.id
                            )
                          }
                          className="px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all inline-flex items-center gap-1"
                        >
                          <span>تعديل الحالة</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Status Change Dropdown Menu */}
                        {activeStatusDropdown === req.id && (
                          <div className="absolute top-14 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 text-right text-xs space-y-1">
                            <button
                              onClick={() => handleStatusChange(req.id, "in_progress")}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-700 flex items-center justify-between"
                            >
                              <span>قيد التنفيذ</span>
                              {req.status === "in_progress" && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "awaiting_supervisor")}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-700 flex items-center justify-between"
                            >
                              <span>بانتظار المشرف</span>
                              {req.status === "awaiting_supervisor" && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "closed")}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 flex items-center justify-between"
                            >
                              <span>مغلق</span>
                              {req.status === "closed" && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "completed")}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-700 flex items-center justify-between"
                            >
                              <span>مكتمل</span>
                              {req.status === "completed" && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "stalled")}
                              className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center justify-between"
                            >
                              <span>متعثّر</span>
                              {req.status === "stalled" && <Check className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* عمود رقم التذكير */}
                    <td className="py-4 px-6 text-center">
                      {req.reminder_number > 0 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-indigo-950 text-sm">
                            التذكير {req.reminder_number}
                          </span>
                          <button
                            onClick={() => handleIncrementReminder(req.id)}
                            title="إرسال تذكير إضافي"
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-950 hover:bg-slate-100 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">—</span>
                      )}
                    </td>

                    {/* عمود أزرار الإجراءات (عرض، تعديل، حذف) */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* زر الحذف */}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center transition-all"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* زر التعديل */}
                        <button
                          onClick={() => {
                            setEditingRequest({ ...req });
                            setIsEditModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all"
                          title="تعديل الطلب"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* زر عرض التفاصيل */}
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsViewModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics Bar */}
        <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>إجمالي الطلبات المعروضة: <strong>{filteredRequests.length}</strong> من أصل {requests.length}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              قيد التنفيذ: {requests.filter(r => r.status === "in_progress").length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              بانتظار المشرف: {requests.filter(r => r.status === "awaiting_supervisor").length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              مغلق: {requests.filter(r => r.status === "closed").length}
            </span>
          </div>
        </div>
      </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. Modal: رفع طلب جديد */}
      {/* ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">رفع طلب مبيعات جديد</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان الطلب *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كشف أيتام - المرحلة الثانية"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    اسم الجمعية *
                  </label>
                  <select
                    value={newAssociation}
                    onChange={(e) => setNewAssociation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none bg-white"
                  >
                    {ASSOCIATIONS_LIST.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المستهدف المالي (ريال)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تصنيف الطلب
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none bg-white"
                >
                  <option value="كفالة أيتام وأرامل">كفالة أيتام وأرامل</option>
                  <option value="حملة إغاثية وعلاجية">حملة إغاثية وعلاجية</option>
                  <option value="مشروع حفظ النعمة">مشروع حفظ النعمة</option>
                  <option value="مساعدات طارئة">مساعدات طارئة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ملاحظات وتفاصيل التوريد
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب ملاحظات إضافية للتنسيق مع الجمعية..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E1B4B] text-white hover:bg-[#2E1065] shadow-xs transition-colors"
                >
                  تأكيد وحفظ الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. Modal: عرض تفاصيل الطلب */}
      {/* ========================================================================= */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-950 flex items-center justify-center font-bold text-sm">
                  REQ
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedRequest.reference_number}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedRequest.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 block mb-0.5">الجمعية المستفيدة</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedRequest.association_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">الحالة الحالية</span>
                  {renderStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">المسوق المسؤول</span>
                  <span className="font-medium text-slate-700">{selectedRequest.marketer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">الجهة التعاقدية</span>
                  <span className="font-medium text-slate-700">{selectedRequest.entity_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">تاريخ الرفع</span>
                  <span className="font-medium text-slate-700">{selectedRequest.request_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">رقم التذكير</span>
                  <span className="font-bold text-indigo-950">
                    {selectedRequest.reminder_number > 0 ? `التذكير ${selectedRequest.reminder_number}` : "لا يوجد"}
                  </span>
                </div>
              </div>

              {/* Financial Progress */}
              <div className="border border-slate-100 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">المستهدف المالي:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.target_amount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">إجمالي السندات المحصلة:</span>
                  <span className="font-bold text-emerald-600">{selectedRequest.total_bonds_amount.toLocaleString()} ر.س</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-950 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedRequest.total_bonds_amount / (selectedRequest.target_amount || 1)) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-slate-400 block mb-1">ملاحظات الطلب:</span>
                <p className="bg-slate-50 p-3 rounded-lg text-slate-700 leading-relaxed">
                  {selectedRequest.notes || "لا توجد ملاحظات مسجلة."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E1B4B] text-white hover:bg-[#2E1065]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. Modal: تعديل الطلب */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                تعديل الطلب ({editingRequest.reference_number})
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان الطلب
                </label>
                <input
                  type="text"
                  required
                  value={editingRequest.title}
                  onChange={(e) =>
                    setEditingRequest({ ...editingRequest, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم الجمعية
                </label>
                <select
                  value={editingRequest.association_name}
                  onChange={(e) =>
                    setEditingRequest({ ...editingRequest, association_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none bg-white"
                >
                  {ASSOCIATIONS_LIST.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المستهدف المالي (ريال)
                  </label>
                  <input
                    type="number"
                    value={editingRequest.target_amount}
                    onChange={(e) =>
                      setEditingRequest({ ...editingRequest, target_amount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رقم التذكير
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingRequest.reminder_number}
                    onChange={(e) =>
                      setEditingRequest({ ...editingRequest, reminder_number: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  value={editingRequest.notes || ""}
                  onChange={(e) =>
                    setEditingRequest({ ...editingRequest, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E1B4B] text-white hover:bg-[#2E1065] shadow-xs transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
