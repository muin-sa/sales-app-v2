"use client";

import React, { useState } from "react";
import {
  Users,
  Building2,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Check,
  X,
  Layers,
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  AlertTriangle,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export type RoleType = "admin" | "sales_manager" | "marketer" | "accountant" | "unassigned";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: "active" | "suspended";
  role: RoleType;
  team: string | null;
  permissions: {
    canViewAllRequests: boolean;
    canCreateRequest: boolean;
    canApproveRequest: boolean;
    canUploadBond: boolean;
    canVerifyBond: boolean;
    canManageAssociations: boolean;
    canManageLicenses: boolean;
    canCalculateCommissions: boolean;
    canViewOperationLogs: boolean;
  };
}

export interface ContractEntityItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
}

export default function SettingsPage() {
  // Initial Mock Users matching the reference image and RBAC system
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "u-1",
      name: "Mohamed Munibari",
      email: "tomyalkethiri@gmail.com",
      jobTitle: "لا يوجد منصب",
      status: "suspended",
      role: "unassigned",
      team: null,
      permissions: {
        canViewAllRequests: false,
        canCreateRequest: true,
        canApproveRequest: false,
        canUploadBond: false,
        canVerifyBond: false,
        canManageAssociations: false,
        canManageLicenses: false,
        canCalculateCommissions: false,
        canViewOperationLogs: false,
      },
    },
    {
      id: "u-2",
      name: "Mohammed Bin Hameedh",
      email: "binhameedh@gmail.com",
      jobTitle: "لا يوجد منصب",
      status: "suspended",
      role: "unassigned",
      team: null,
      permissions: {
        canViewAllRequests: true,
        canCreateRequest: true,
        canApproveRequest: true,
        canUploadBond: true,
        canVerifyBond: true,
        canManageAssociations: true,
        canManageLicenses: true,
        canCalculateCommissions: true,
        canViewOperationLogs: true,
      },
    },
    {
      id: "u-3",
      name: "بيت التمكين",
      email: "tamkenstore20@gmail.com",
      jobTitle: "لا يوجد منصب",
      status: "suspended",
      role: "unassigned",
      team: null,
      permissions: {
        canViewAllRequests: true,
        canCreateRequest: true,
        canApproveRequest: false,
        canUploadBond: true,
        canVerifyBond: false,
        canManageAssociations: true,
        canManageLicenses: false,
        canCalculateCommissions: false,
        canViewOperationLogs: true,
      },
    },
    {
      id: "u-4",
      name: "محاسب المبيعات",
      email: "finance@demo.bayt-altamkeen.local",
      jobTitle: "لا يوجد منصب",
      status: "suspended",
      role: "accountant",
      team: null,
      permissions: {
        canViewAllRequests: true,
        canCreateRequest: false,
        canApproveRequest: false,
        canUploadBond: false,
        canVerifyBond: true,
        canManageAssociations: false,
        canManageLicenses: false,
        canCalculateCommissions: true,
        canViewOperationLogs: true,
      },
    },
    {
      id: "u-5",
      name: "م. عبدالعزيز التميمي",
      email: "admin@tamkeen-mkt.sa",
      jobTitle: "مدير تقني ونظام",
      status: "active",
      role: "admin",
      team: "الإدارة العليا",
      permissions: {
        canViewAllRequests: true,
        canCreateRequest: true,
        canApproveRequest: true,
        canUploadBond: true,
        canVerifyBond: true,
        canManageAssociations: true,
        canManageLicenses: true,
        canCalculateCommissions: true,
        canViewOperationLogs: true,
      },
    },
    {
      id: "u-6",
      name: "أ. سلطان المنصور",
      email: "sales.mgr@ghazara.sa",
      jobTitle: "مدير المبيعات",
      status: "active",
      role: "sales_manager",
      team: "فريق المبيعات",
      permissions: {
        canViewAllRequests: true,
        canCreateRequest: true,
        canApproveRequest: true,
        canUploadBond: false,
        canVerifyBond: false,
        canManageAssociations: true,
        canManageLicenses: true,
        canCalculateCommissions: true,
        canViewOperationLogs: true,
      },
    },
    {
      id: "u-7",
      name: "أحمد منصور البارقي",
      email: "ahmed.mkt@ghazara.sa",
      jobTitle: "مسوق ميداني",
      status: "active",
      role: "marketer",
      team: "فريق التسويق الميداني",
      permissions: {
        canViewAllRequests: false,
        canCreateRequest: true,
        canApproveRequest: false,
        canUploadBond: true,
        canVerifyBond: false,
        canManageAssociations: false,
        canManageLicenses: false,
        canCalculateCommissions: false,
        canViewOperationLogs: false,
      },
    },
  ]);

  // Initial Contract Entities matching the reference image:
  // أخرى . OTHER
  // بيت التمكين . BAT
  // غزارة . GHZ
  // معين . MOEEN
  const [entities, setEntities] = useState<ContractEntityItem[]>([
    { id: "e-1", code: "OTHER", nameAr: "أخرى", nameEn: "OTHER" },
    { id: "e-2", code: "BAT", nameAr: "بيت التمكين", nameEn: "BAT" },
    { id: "e-3", code: "GHZ", nameAr: "غزارة", nameEn: "GHZ" },
    { id: "e-4", code: "MOEEN", nameAr: "معين", nameEn: "MOEEN" },
  ]);

  // Modals state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [permissionUser, setPermissionUser] = useState<UserItem | null>(null);
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ContractEntityItem | null>(null);

  // Form states for adding/editing entity
  const [newEntityCode, setNewEntityCode] = useState("");
  const [newEntityNameAr, setNewEntityNameAr] = useState("");

  // Form states for adding team
  const [newTeamName, setNewTeamName] = useState("");

  // Role labels and badge styles
  const getRoleLabel = (role: RoleType) => {
    switch (role) {
      case "admin":
        return "مدير النظام (Admin)";
      case "sales_manager":
        return "مدير المبيعات";
      case "marketer":
        return "مسوق ميداني";
      case "accountant":
        return "محاسب مالي";
      case "unassigned":
      default:
        return "دور غير محدد";
    }
  };

  // Handle entity deletion
  const handleDeleteEntity = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف الجهة التعاقدية "${name}"؟`)) {
      setEntities(entities.filter((e) => e.id !== id));
    }
  };

  // Handle save new or edited entity
  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityNameAr.trim() || !newEntityCode.trim()) return;

    if (editingEntity) {
      setEntities(
        entities.map((ent) =>
          ent.id === editingEntity.id
            ? { ...ent, nameAr: newEntityNameAr.trim(), code: newEntityCode.trim().toUpperCase() }
            : ent
        )
      );
      setEditingEntity(null);
    } else {
      const newEnt: ContractEntityItem = {
        id: `e-${Date.now()}`,
        code: newEntityCode.trim().toUpperCase(),
        nameAr: newEntityNameAr.trim(),
        nameEn: newEntityCode.trim().toUpperCase(),
      };
      setEntities([...entities, newEnt]);
      setIsAddEntityOpen(false);
    }
    setNewEntityCode("");
    setNewEntityNameAr("");
  };

  // Handle saving permissions
  const handleTogglePermission = (key: keyof UserItem["permissions"]) => {
    if (!permissionUser) return;
    setPermissionUser({
      ...permissionUser,
      permissions: {
        ...permissionUser.permissions,
        [key]: !permissionUser.permissions[key],
      },
    });
  };

  const handleSavePermissions = () => {
    if (!permissionUser) return;
    setUsers(users.map((u) => (u.id === permissionUser.id ? permissionUser : u)));
    setPermissionUser(null);
  };

  // Handle saving edited user profile
  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header Section */}
      <PageHeader
        overline="عمليات المبيعات"
        title="الإعدادات والبيانات الرئيسية"
        subtitle="إدارة الفرق والجهات والملفات الوظيفية وصلاحيات الدور والمستخدم. الإيقاف آمن ويحفظ السجل التاريخي والتدقيق."
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAddTeamOpen(true)}
              className="bg-[#1E1B4B] hover:bg-[#2e2a72] text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة فريق</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setEditingEntity(null);
                setNewEntityCode("");
                setNewEntityNameAr("");
                setIsAddEntityOpen(true);
              }}
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Building className="w-4 h-4 text-slate-600 stroke-[2.2]" />
              <span>إضافة جهة</span>
            </Button>
          </div>
        }
      />

      {/* Split Content Area: Two Primary Columns */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-8 mt-8 space-y-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Narrower - 35% / 4 cols): الجهات التعاقدية */}
        <section className="w-full lg:col-span-4 order-2 lg:order-1">
          <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <CardHeader className="p-5 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    الجهات التعاقدية
                  </CardTitle>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md">
                {entities.length} جهات
              </span>
            </CardHeader>

            <CardContent className="p-4 flex flex-col gap-2.5">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-[#FBFBFC] hover:bg-white hover:border-slate-200 transition-all duration-150"
                >
                  {/* Action Buttons on the Left */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteEntity(entity.id, entity.nameAr)}
                      aria-label={`حذف جهة ${entity.nameAr}`}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="حذف الجهة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingEntity(entity);
                        setNewEntityNameAr(entity.nameAr);
                        setNewEntityCode(entity.code);
                        setIsAddEntityOpen(true);
                      }}
                      aria-label={`تعديل جهة ${entity.nameAr}`}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="تعديل الجهة"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right side: Entity Name and Code */}
                  <div className="text-right">
                    <span className="font-bold text-slate-800 text-sm">
                      {entity.nameAr}
                    </span>
                    <span className="text-slate-400 font-mono text-xs mr-1.5 font-medium">
                      · {entity.code}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Right Column (Wider - 65% / 8 cols): المستخدمون والملفات الوظيفية */}
        <section className="w-full lg:col-span-8 order-1 lg:order-2">
          <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <CardHeader className="p-5 md:p-6 pb-4 border-b border-slate-100">
              <div className="flex flex-col text-right">
                <CardTitle className="text-lg font-bold text-slate-900">
                  المستخدمون والملفات الوظيفية
                </CardTitle>
                <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">
                  الفرق والأقسام والدور تحدد نطاق الوصول؛ ويمكن منح أو سحب صلاحية محددة للمستخدم.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left side: Action Buttons */}
                  <div className="flex items-center gap-2.5 order-2 sm:order-1 shrink-0">
                    <button
                      onClick={() => setPermissionUser(user)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        user.id === "u-1"
                          ? "border-[#232B5D] text-[#232B5D] bg-purple-50/30 ring-1 ring-[#232B5D]/20 shadow-2xs"
                          : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                      }`}
                    >
                      صلاحية خاصة
                    </button>

                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                    >
                      تعديل الملف
                    </button>
                  </div>

                  {/* Right side: User info and chips */}
                  <div className="flex flex-col text-right order-1 sm:order-2">
                    <span className="font-bold text-slate-900 text-base leading-snug">
                      {user.name}
                    </span>

                    <span className="text-xs text-slate-400 font-normal mt-0.5">
                      {user.email} · {user.jobTitle}
                    </span>

                    {/* Chips / Pills Row */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {/* Status Chip */}
                      {user.status === "suspended" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDF2F4] text-[#C52243] border border-[#FCD8E0]">
                          متعثّر
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8EE] text-[#0D8A4E] border border-[#C5EED6]">
                          نشط
                        </span>
                      )}

                      {/* Role Chip */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {getRoleLabel(user.role)}
                      </span>

                      {/* Team Chip */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/60">
                        {user.team ? user.team : "بلا فريق"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        </div>
      </main>

      {/* MODAL 1: صلاحية خاصة (Special RBAC Permissions Modal) */}
      {permissionUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#232B5D]" />
                  <span>الصلاحيات المخصصة</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  تحديد الصلاحيات الدقيقة للمستخدم: <strong>{permissionUser.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setPermissionUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permissions Toggles List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {[
                { key: "canViewAllRequests", label: "عرض كل طلبات المنظومة" },
                { key: "canCreateRequest", label: "إنشاء طلبات جديدة" },
                { key: "canApproveRequest", label: "اعتماد وتدقيق الطلبات (إشراف)" },
                { key: "canUploadBond", label: "رفع سندات التبرع والمرفقات" },
                { key: "canVerifyBond", label: "مطابقة والتحقق المالي من السندات" },
                { key: "canManageAssociations", label: "إدارة وتعديل بيانات الجمعيات" },
                { key: "canManageLicenses", label: "إدارة ومتابعة التراخيص وتنبيهاتها" },
                { key: "canCalculateCommissions", label: "احتساب وتدقيق عمولات المسوقين" },
                { key: "canViewOperationLogs", label: "الاطلاع على سجل العمليات والتدقيق" },
              ].map((perm) => {
                const isEnabled =
                  permissionUser.permissions[perm.key as keyof UserItem["permissions"]];
                return (
                  <div
                    key={perm.key}
                    onClick={() =>
                      handleTogglePermission(perm.key as keyof UserItem["permissions"])
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none ${
                      isEnabled
                        ? "border-[#232B5D]/40 bg-purple-50/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isEnabled
                            ? "bg-[#232B5D] border-[#232B5D] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {perm.label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isEnabled
                          ? "bg-purple-100 text-purple-900"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isEnabled ? "مفعل" : "معطل"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setPermissionUser(null)}
                className="text-xs rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSavePermissions}
                className="bg-[#232B5D] hover:bg-[#1E1B4B] text-white text-xs rounded-xl font-semibold px-5"
              >
                حفظ التعديلات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: تعديل الملف الوظيفي (Edit Profile Modal) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveUserProfile}
            className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">تعديل الملف الوظيفي</h3>
                <p className="text-xs text-slate-500 mt-0.5">تحديث بيانات المستخدم والرتبة الوظيفية</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستخدم</label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="text-xs"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المسمى الوظيفي</label>
                <Input
                  value={editingUser.jobTitle}
                  onChange={(e) => setEditingUser({ ...editingUser, jobTitle: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الدور الوظيفي (RBAC)</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as RoleType })
                  }
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#232B5D]"
                >
                  <option value="unassigned">دور غير محدد</option>
                  <option value="admin">مدير النظام (Admin)</option>
                  <option value="sales_manager">مدير المبيعات (Sales Manager)</option>
                  <option value="marketer">مسوق ميداني (Marketer)</option>
                  <option value="accountant">محاسب مالي (Accountant)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الحالة الوظيفية</label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as "active" | "suspended",
                    })
                  }
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#232B5D]"
                >
                  <option value="active">نشط (Active)</option>
                  <option value="suspended">متعثّر / موقوف (Suspended)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
                className="text-xs rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-[#232B5D] hover:bg-[#1E1B4B] text-white text-xs rounded-xl font-semibold px-5"
              >
                حفظ
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: إضافة أو تعديل جهة تعاقدية (Add / Edit Entity Modal) */}
      {isAddEntityOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveEntity}
            className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingEntity ? "تعديل الجهة التعاقدية" : "إضافة جهة تعاقدية جديدة"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  الجهات التعاقدية الشقيقة لبيت التمكين (غزارة، معين، أخرى)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEntityOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الجهة (بالعربية)
                </label>
                <Input
                  value={newEntityNameAr}
                  onChange={(e) => setNewEntityNameAr(e.target.value)}
                  placeholder="مثال: بيت التمكين، غزارة..."
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  رمز الجهة التعاقدية (Code)
                </label>
                <Input
                  value={newEntityCode}
                  onChange={(e) => setNewEntityCode(e.target.value)}
                  placeholder="مثال: BAT, GHZ, MOEEN..."
                  className="text-xs font-mono uppercase"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEntityOpen(false)}
                className="text-xs rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-[#232B5D] hover:bg-[#1E1B4B] text-white text-xs rounded-xl font-semibold px-5"
              >
                {editingEntity ? "تحديث" : "إضافة الجهة"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: إضافة فريق (Add Team Modal) */}
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newTeamName.trim()) {
                alert(`تم إنشاء الفريق: "${newTeamName.trim()}" بنجاح!`);
                setNewTeamName("");
                setIsAddTeamOpen(false);
              }
            }}
            className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">إضافة فريق عمل جديد</h3>
                <p className="text-xs text-slate-500 mt-0.5">تجميع المستخدمين والمسوقين تحت نطاق إداري موحد</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeamOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الفريق</label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="مثال: فريق مبيعات الوسطى، فريق تسويق معين..."
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddTeamOpen(false)}
                className="text-xs rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-[#232B5D] hover:bg-[#1E1B4B] text-white text-xs rounded-xl font-semibold px-5"
              >
                إنشاء الفريق
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
